import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';
import { KAKAO_AUTH_URL } from '../../config/kakao-config';

const Login = () => {
  const redirection = useNavigate();

  const { onLogin } = useContext(AuthContext);

  const REQUEST_URL = BASE + USER + '/signin';

  // 서버에 비동기 로그인 요청(= AJAX요청 이라고도 함, 같은 말임)
  // 함수 앞에 async를 붙이면 해당 함수는 프로미스 객체를 바로 리턴합니다.
  const fetchLogin = async () => {
    // 이메일, 비밀번호 입력 태그 얻어오기
    // 로그인에서는 따로 검증을 하지 않겠다. (왜냐면 DB에 들어갈 값이 아니기 때무네 + useState를 사용 할 필요가 없음)
    // 왜냐면 회원가입에서 검증을 빡세게 했기 때문에!
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');

    /*
     await는 async로 선언 된 함수에서만 사용이 가능합니다.
     await는 프로미스 객체가 처리 될 때까지 기다립니다.
     프로미스 객체의 반환값을 바로 활용할 수 있도록 도와줍니다.
     then()을 활용하는 것보다 가독성이 좋고, 쓰기도 쉽습니다.
    */
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        // 앞의 변수명을 dto 필드명과 맞춰줘야 한다.
        email: $email.value,
        password: $password.value,
      }),
    });
    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }

    const { token, userName, email, role } = await res.json(); // 서버에서 온 json읽기

    /*
      json에 담긴 인증 정보를 클라에 보관
      1. 로컬 스토리지 - 브라우저가 종료되어도 보관 됨
      2. 세션 스토리지 - 브라우저가 종료되면 사라짐
    */
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('LOGIN_USERNAME', userName);
    localStorage.setItem('USER_ROLE', role); // 로컬 스토리지에 정보 3개 저장하고 홈으로 넘어가게 할 것임.

    // Context API를 사용하여 로그인 상태를 업데이트 합니다.
    onLogin(token, userName, role);

    // 홈으로 리다이렉트
    redirection('/');

    // 위의 로직과 아래의 로직이 똑같이 실행된다.
    /*
      await는 순서가 보장된다.
      위의 await가 끝나기 전까지 아래의 await가 절대 실행되지 않음
      순서를 위해서 then절을 사용한 것이었는데,
      async와 await를 통해서 키워드만으로 내부의 로직을 정리할 수 있게 되었다.
    */

    /*
    
     - 이 fetch문 자체를 줄일 수 있음 -> 위의 async + await문

    fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        // 앞의 변수명을 dto 필드명과 맞춰줘야 한다.
        email: $email.value,
        password: $password.value,
      }),
    })
      .then((res) => {
        if (res.status === 400) {
          // 가입이 안되있거나, 비번이 틀린거임
          // 백에서는 String타입인 e.getMessage()를 하고 있기 때문에 그걸 그대로 띄우면 된다.
          return res.text(); // 에러메세지는 text이기 때문에 text()를 사용해 리턴
        }
        return res.json(); // 400 에러가 아니라면 로그인 성공이기 때문에 json()을 리턴.
      })
      .then((result) => {
        // 에러라면 String이 오고 아니라면 json객체가 옴
        // typeof라는 타입을 가려주는 JS함수
        if (typeof result === 'string') {
          alert(result);
          return;
        }
        console.log(result);
      });
      */
  };

  // form태그에 onSubmit걸어줬음
  const loginHandler = (e) => {
    // submit 기능 막고,
    e.preventDefault();

    // 서버에 로그인 요청 전송
    fetchLogin();
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Typography
            component='h1'
            variant='h5'
          >
            로그인
          </Typography>
        </Grid>
      </Grid>

      <form
        noValidate
        onSubmit={loginHandler}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='email address'
              name='email'
              autoComplete='email'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password'
              label='on your password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
            >
              로그인
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <a href={KAKAO_AUTH_URL}>
              <img
                style={{ width: '100%' }}
                alt='카카오 로그인 버튼'
                src={require('../../assets/img/kakao_login_medium_wide.png')}
              ></img>
            </a>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
