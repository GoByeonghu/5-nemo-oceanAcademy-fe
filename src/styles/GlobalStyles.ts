// CommonStyles.ts - 공통적인 스타일 정의 
import styled from 'styled-components';

// 공통적인 컨테이너 스타일
export const Container = styled.div`
  width: 390px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding-bottom: 80px;
`;

// 공통적인 버튼 스타일
export const Button = styled.button`
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// 공통적인 제목 스타일
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;