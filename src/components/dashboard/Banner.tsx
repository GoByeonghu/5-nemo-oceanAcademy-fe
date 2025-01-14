// 강의 배너 이미지 

import React from 'react';
import styles from './Banner.module.css';

interface BannerProps {
    image: string;
    children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ image }) => {
    return (
        <div
            className={styles.banner}
            style={{ backgroundImage: `url(${image})` }}
        />
    );
};

export default Banner;
