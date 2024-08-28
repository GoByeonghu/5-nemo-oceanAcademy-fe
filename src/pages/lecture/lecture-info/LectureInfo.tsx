// #H-1: LectureInfo (/lecture/info) - 강의 소개 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureInfo.module.css';
import { Container } from '../../../styles/GlobalStyles';

interface LectureData {
    class_id: number; 
    name: string; // 강의 제목
    banner_image: string | null; // 배너 이미지 경로
    instructor: string; // 강사 이름
    category: string; // 카테고리 이름
    object: string; // 강의 목표
    description: string; // 강의 소개 
    instructor_info: string; // 강사 소개
    precourse: string; // 강의에 필요한 사전 지식 및 준비 안내
}

const LectureInfo: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [lectureData, setLectureData] = useState<LectureData | null>(null);
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
    const { classId } = useParams<{ classId: string }>();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchLectureInfo = async () => {
            try {
                const response = await axios.get(`${endpoints.getLectures}/${classId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLectureData(response.data);
            } catch (error) {
                console.error('Failed to fetch lecture data:', error);
            }
        };

        const fetchUserRole = async () => {
            try {
                const response = await axios.get(endpoints.getRole.replace('{classId}', classId || ''), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.role === '강사' || response.data.role === '수강생') {
                    setIsEnrolled(true);
                } else {
                    setIsEnrolled(false);
                }
            } catch (error) {
                console.error('Failed to fetch user role:', error);
                setIsEnrolled(false); // 오류 시 수강 신청 버튼을 표시
            }
        };

        if (classId) {
            fetchLectureInfo();
            fetchUserRole();
        }
    }, [classId, token]);

    const handleEnrollment = async () => {
        try {
            const response = await axios.post(endpoints.enrollment.replace('{classId}', classId || ''), {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                alert(response.data.message);
                navigate('/enrollment');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert('권한이 없습니다. 로그인 후 다시 시도해주세요.');
                } else if (error.response?.status === 400) {
                    alert(error.response.data.message || '수강신청을 실패했습니다.');
                } else {
                    alert('알 수 없는 오류가 발생했습니다.');
                }
            } else {
                console.error('Enrollment request failed:', error);
                alert('수강신청을 실패했습니다.');
            }
        }
    };

    if (!lectureData) {
        return <Container>Loading...</Container>; // 데이터를 불러오기 전 로딩 표시
    }

    return (
        <div className={styles.container}>
            <p className={styles.instructor}>{lectureData.instructor}</p>
            <h1 className={styles.title}>{lectureData.name}</h1>
            <div className={styles.banner} style={{ backgroundImage: `url(${lectureData.banner_image_path || '/default-image.png'})` }}></div>
            <div className={styles.category}>카테고리 ID: {lectureData.category_id}</div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>강의 목표</h3>
                <p className={styles.infoContent}>{lectureData.object || '강의 목표 정보 없음'}</p>
            </div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>강의 소개</h3>
                <p className={styles.infoContent}>{lectureData.description || '강의 소개 정보 없음'}</p>
            </div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>강사 소개</h3>
                <p className={styles.infoContent}>{lectureData.instructor_info || '강사 소개 정보 없음'}</p>
            </div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>사전 준비 사항</h3>
                <p className={styles.infoContent}>{lectureData.prerequisite || '사전 준비 사항 정보 없음'}</p>
            </div>

            <div className={styles.buttonContainer}>
                <Button text={isEnrolled ? "대시보드 가기" : "수강신청"} onClick={handleEnrollment} />
            </div>

            <Navigation />
        </div>
    );
};

export default LectureInfo;
