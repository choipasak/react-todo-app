import React, { useEffect } from 'react';
import { API_BASE_URL, USER } from '../../config/host-config';

const KaKaoLoginHandler = () => {
  console.log(
    '사용자가 동의화면을 통해 필수정보 동의 후 KaKao 서버에서 redirect를 진행함!'
  );
  const REQUEST_URL = API_BASE_URL + USER;
  // URL에 쿼리스트링으로 전달 된 인가 코드를 얻어오는 방법.
  const code = new URL(window.location.href).searchParams.get('code');

  // 처음 렌더링 되는 useEffect를 사용해서 값을 먼저 가져와 줄라고 사용함
  useEffect(() => {
    // 컴포넌트가 렌더링 될 때, 인가 코드를 백으로 전송하는 fetch 요청!
    const kakaoLogin = async () => {
      const res = await fetch(REQUEST_URL + '/kakaoLogin?code=' + code);
    };

    // 렌더링 될 때 실행 되게 여기에 작성
    kakaoLogin();
  }, []);

  return <div>KaKaoLoginHandler</div>;
};

export default KaKaoLoginHandler;
