import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import { isLogin, getLoginUserInfo } from '../../utils/login-util';
import AuthContext from '../../utils/AuthContext';
import { API_BASE_URL, USER } from '../../config/host-config';

const Header = () => {
  const profileRequestURL = `${API_BASE_URL}${USER}/load-profile`;

  const redirection = useNavigate();

  // 프로필 이미지 url 상태 변수
  const [profileUrl, setProfileUrl] = useState(null);

  // AuthContext에서 로그인 상태를 가져옵니다.
  const { isLoggedIn, userName, onLogout } = useContext(AuthContext);

  // 로그아웃 핸들러
  const logoutHandler = () => {
    // AuthContext의 onLogout 함수를 호출하여 로그인 상태를 업데이트 합니다.
    onLogout();
    redirection('/login');
  };

  // 프로필 이미지 요청
  const fetchProfileImage = async () => {
    const res = await fetch(profileRequestURL, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
      },
    });
    console.log(res);
    if (res.status === 200) {
      // 서버에서는 byte[]로 직렬화 된 이미지가 응답되므로
      // blob()을 통해 전달 받아야 한다.
      // json()으로 받으면 안됌!
      const profileBlob = await res.blob();
      // 해당 이미지를 imgUrl로 변경
      const imgUrl = window.URL.createObjectURL(profileBlob);
      setProfileUrl(imgUrl);
    } else {
      const err = await res.text();
      setProfileUrl(null);
    }
  };

  // 로그인의 상태가 변화될 때 화면이 리렌더링이 되고,
  // 그에 맞는 회원의 프로필 이미지 요청이 들어갈 수 있도록
  useEffect(() => {
    if (isLoggedIn) fetchProfileImage();
  }, [isLoggedIn]);

  return (
    <AppBar
      position='fixed'
      style={{
        background: '#38d9a9',
        width: '100%',
      }}
    >
      <Toolbar>
        <Grid
          justify='space-between'
          container
        >
          <Grid
            item
            flex={9}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h4'>
                {isLoggedIn // login-utils에서 가져온 것임. 여기로 true가 왔으면 토큰이 있는 것.
                  ? userName + '님'
                  : '오늘'}
                의 할일
              </Typography>
              {isLoggedIn && (
                <img
                  src={profileUrl || require('../../assets/img/anonymous.jpg')}
                  alt='프로필 사진'
                  style={{
                    marginLeft: 20,
                    width: 75,
                    height: 75,
                    borderRadius: '50%',
                  }}
                ></img>
              )}
            </div>
          </Grid>

          <Grid item>
            <div className='btn-group'>
              {/* Link는 라우터가 제공하는 태그임.
                a태그와 다르게 Link태그를 누르면 라우터가 반응해서
                화면을 재렌더링하지 않고 이동이 가능하게 된다.
                게빌지 도구에는 a라고 나오지만 실제는 라우터가 작동함
                하나의 컴포넌트 안에서 바뀌면서 변화한다.
                실제 브라우저에서도 부드럽게 이동하는 것을 볼 수 있음.
                (a태그는 기능을 억제하고 이동까지 시켜줘야 했었음)
             */}
              {isLoggedIn ? (
                <button
                  className='logout-btn'
                  onClick={logoutHandler}
                >
                  로그아웃
                </button>
              ) : (
                <>
                  <Link to='/login'>로그인</Link>
                  <Link to='/join'>회원가입</Link>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
