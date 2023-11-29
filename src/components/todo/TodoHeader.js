import React from 'react';
import '../scss/TodoHeader.scss';

const TodoHeader = ({ count, promote }) => {
  const today = new Date();

  const dateString = today.toLocaleDateString('ko-kr', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dayName = today.toLocaleDateString('ko-kr', { weekday: 'long' });

  const upgrade = () => {
    if (window.confirm('프리미엄으로 업그레이드 하시겠습니까?')) {
      promote();
    }
  };

  // 등급에 따른 조건별 렌더링
  // COMMON과 PREMIUM
  const gradeView = () => {
    // 로그인은 한 상태.
    // 로컬스토리지에서 등급 뽑기
    const role = localStorage.getItem('USER_ROLE');
    console.log('[TodoHeader.js] 현재 로그인 한 회원의 등급: ', role);
    if (role === 'COMMON') {
      return (
        <span
          className='promote badge bg-warning'
          onClick={upgrade}
        >
          일반 회원
        </span>
      );
    } else if (role === 'PREMIUM') {
      return <span className='promote badge bg-danger'>프리미엄 회원</span>;
    } else if (role === 'ADMIN') {
      return <span className='promote badge bg-info'>관리자</span>;
    }
  };

  return (
    <header>
      <h1>{dateString}</h1>
      <div className='day'>{dayName}</div>
      <div className='tasks-left'>할 일 {count()}개 남음</div>
      {gradeView()}
    </header>
  );
};

export default TodoHeader;
