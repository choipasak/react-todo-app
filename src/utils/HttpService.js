import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

// 모든 fetch요청을 하나의 함수를 사용하여 처리할 수 있게 하는 로직.
const HttpService = async (url, options) => {
  const redirection = useNavigate();
  const { onLogout } = useContext(AuthContext);

  const res = await fetch(url, options);

  if (res.status === 401) {
    // 401은 토큰 만료라고 정해놔서(서버에서) 관련 처리 로직
    const data = await res.json();
    console.log('401 토큰 만료!: ', data);
    onLogout();
    alert('토큰이 만료되었습니다. 다시 로그인 해 주세요.');
    redirection('/login');
  }

  // status가 401이 아닌 경우
  return res; // 원하는 곳에 풀어서 사용해라 라는 의미!
};

export default HttpService;
