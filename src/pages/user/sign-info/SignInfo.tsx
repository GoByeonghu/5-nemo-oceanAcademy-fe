import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './SignInfo.module.css';
import WideButton from '../../../components/wide-button/WideButton';
import Row from 'components/Row';
import Column from 'components/Column';
import Space from 'components/Space';

interface LocationState {
  token: string;
  refreshToken: string;
}

const SignInfo = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [helperText, setHelperText] = useState('');
  const navigate = useNavigate();
  const location = useLocation<LocationState | undefined>(); // 수정: state가 없을 수 있음을 명시적으로 처리
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1184);

  // 오류 수정: location.state가 없을 때 기본값 처리 및 경고 메시지
  const token = location?.state?.token;
  const refreshToken = location?.state?.refreshToken;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1184);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file); // 파일 객체 저장
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('유효하지 않은 파일입니다. 5MB 이하의 .jpg/jpeg 또는 .png 파일만 가능합니다.');
    }
  };

  // 회원가입 완료 처리
  const handleSignupComplete = async () => {
    if (!nickname) {
      setHelperText('닉네임을 입력해주세요.');
      return;
    }

    if (!token || !refreshToken) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    const signupRequestDto = {
      nickname,
      email: email.trim() === '' ? null : email,
    };

    const formData = new FormData();
    formData.append('signupRequestDto', new Blob([JSON.stringify(signupRequestDto)], { type: 'application/json' }));

    if (selectedFile) {
      formData.append('imagefile', selectedFile);
    }

    try {
      const response = await axios.post(endpoints.user, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        alert('회원가입이 완료되었습니다.');
        navigate('/');
      } else {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError인 경우
        console.error('Error during sign-up:', error.response?.data || error.message);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else if (error instanceof Error) {
        // 일반 Error 객체인 경우
        console.error('Error during sign-up:', error.message);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else {
        // 알 수 없는 에러인 경우
        console.error('Unknown error during sign-up:', error);
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className={styles.container}>
      {isMobile ? (
        <Column>
          {/* 제목 */}
          <Row align='left'><div className={styles.title}>프로필 설정</div></Row>
          <Space height='20px'/>
          <hr />
          <Space height='20px'/>
          
          <Row align='left'>
            <label htmlFor="fileInput" className={styles.label}>프로필 사진<span className={styles.requiredMark}>*</span></label>
            <Column>
              <Row>
                {/* 파일변경 - 숨김 */}
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />

                {/* 사진변경버튼 */}
                <button
                  className={styles.uploadButton}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                
                {/* 미리보기 */}
                {preview ? (
                  <img src={preview} alt="Preview" className={styles.previewImage} />
                ) : (
                  '+'
                )}
                </button>
              </Row>
              <Row>
                <div className={styles.bulletList}>  
                  <p>
                    - 사진은 1개만 업로드할 수 있습니다. <br />
                    - 파일 사이즈는 100*100을 권장합니다. <br />
                    - 파일 크기는 5MB 이하만 가능합니다. <br />
                    - 파일은 .jpg, .jpeg, .png만 업로드할 수 있습니다. <br />
                    - 사진을 업로드하지 않을 경우 기본 프로필로 설정됩니다.
                  </p>
                </div>
              </Row>
            </Column>
          </Row>
          <Space height='20px'/>

          {/* 닉네임 */}
          <Row align='left'>
            
            <label className={styles.label}>
              닉네임<span className={styles.requiredMark}>*</span>
            </label>
            <Column>
              <input
                type="text"
                className={styles.inputField}
                placeholder="닉네임을 설정해주세요."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              {helperText && <p className={styles.helperText}>{helperText}</p>}
            </Column>
          </Row>
          <Space height='20px'/>
          
          {/* 이메일 */}
          <Row align='left'>
            <label className={styles.label}>이메일<span className={styles.requiredMark}>*</span></label>
            <Column>
              <input
                type="email"
                className={styles.inputField}
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Column>
          </Row>
          <Space height='40px'/>

          <WideButton 
            text="회원 가입 완료" 
            onClick={handleSignupComplete}
          />
        </Column>
      ) : (
        <Column>
          {/* 제목 */}
          <Row align='left'><div className={styles.title}>프로필 설정</div></Row>
          <Space height='20px'/>
          <hr />
          <Space height='20px'/>
          
          <Row align='left'>
            <label htmlFor="fileInput" className={styles.label}>프로필 사진<span className={styles.requiredMark}>*</span></label>
            <Column>
              <Row>
                {/* 파일변경 - 숨김 */}
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />

                {/* 사진변경버튼 */}
                <button
                  className={styles.uploadButton}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                
                {/* 미리보기 */}
                {preview ? (
                  <img src={preview} alt="Preview" className={styles.previewImage} />
                ) : (
                  '+'
                )}
                </button>
              </Row>
              <Row>
                <div className={styles.bulletList}>  
                  <p>
                    - 사진은 1개만 업로드할 수 있습니다. <br />
                    - 파일 사이즈는 100*100을 권장합니다. <br />
                    - 파일 크기는 5MB 이하만 가능합니다. <br />
                    - 파일은 .jpg, .jpeg, .png만 업로드할 수 있습니다. <br />
                    - 사진을 업로드하지 않을 경우 기본 프로필로 설정됩니다.
                  </p>
                </div>
              </Row>
            </Column>
          </Row>
          <Space height='20px'/>

          {/* 닉네임 */}
          <Row align='left'>
            
            <label className={styles.label}>
              닉네임<span className={styles.requiredMark}>*</span>
            </label>
            <Column>
              <input
                type="text"
                className={styles.inputField}
                placeholder="닉네임을 설정해주세요."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              {helperText && <p className={styles.helperText}>{helperText}</p>}
            </Column>
          </Row>
          <Space height='20px'/>
          
          {/* 이메일 */}
          <Row align='left'>
            <label className={styles.label}>이메일<span className={styles.requiredMark}>*</span></label>
            <Column>
              <input
                type="email"
                className={styles.inputField}
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Column>
          </Row>
          <Space height='40px'/>

          <WideButton 
            text="회원 가입 완료" 
            onClick={handleSignupComplete}
          />
        </Column>
      )}
    </div>
  );
};

export default SignInfo;