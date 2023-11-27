import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const redirection = useNavigate();

  const API_BASE_URL = BASE + USER;

  // 상태변수로 회원가입 입력 값 관리
  const [userValue, setUserValue] = useState({
    userName: '',
    password: '',
    email: '',
  });

  // 검증 메세지에 대한 상태변수 관리
  // 입력값과 메세지는 따로 상태 관리(메세지는 백엔드로 보내줄 필요 없음.)
  // 메세지 영역이 각 입력창마다 있기 때문에 객체를 활용해서 한 번에 관리.
  const [message, setMessage] = useState({
    userName: '',
    password: '',
    passwordCheck: '',
    email: '',
  });

  // 검증 완료 체크에 대한 상태 변수 관리
  // 각각의 입력 창마다 검증 상태를 관리해야 하기 때문에 객체로 선언.
  // 상태를 유지하려는 이유 -> 마지막에 회원 가입 버튼을 누를 때 까지 검증 상태를 유지해야 하기 때문에
  // 상태 변수로 관리 해 주는 것이다.
  // 모든 입력값의 검증 값이 true인지를 체크하고(1번) 그걸 유지 시켜주는 상태관리 변수
  const [correct, setCorrect] = useState({
    userName: false,
    password: false,
    passwordCheck: false,
    email: false,
  });

  // 검증된 데이터를 각각의 상태변수에 저장 해 주는 함수!
  const saveInputState = ({ key, inputValue, msg, flag }) => {
    // key값(saveInputState의 key: 'userName')에 따라 나머지 값들을 세팅해주자

    // 입력값 세팅
    // 패스워드 확인 입력값은 굳이 userValue 상태로 유지할 필요가 없기 때문에
    // 임의의 문자열 'pass'를 넘기고 있습니다.
    // => 'pass'가 넘어온다면 setUserValue()를 실행하지 않겠다.
    inputValue !== 'pass' && // 넘어온 inputValue의 값이 pass가 아니라면
      // 밑의 로직을 실행하겠다
      setUserValue((oldVal) => {
        return { ...oldVal, [key]: inputValue };
      });

    // msg 세팅(스냅샷 방식)
    setMessage((oldMsg) => {
      return { ...oldMsg, [key]: msg }; // key 변수의 값을 프로퍼티 이름으로 활용.
    });

    // 입력값 검증 상태(flag) 세팅
    setCorrect((oldCorrect) => {
      return { ...oldCorrect, [key]: flag };
    });
  };

  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = (e) => {
    const nameRegex = /^[가-힣]{2,5}$/;
    const inputValue = e.target.value;

    // 입력값 검증 (초기 값)
    let msg; // 검증 메세지를 저장할 변수
    let flag = false; // 입력 값 검증 여부 체크 변수

    // 만약 inputValue가 비어 있다면 (undefinded, null, NaN, '' => 모두 다 논리 연산에서 false로 인식 된다.)
    if (!inputValue) {
      msg = '유저 이름은 필수입니다.';
    } else if (!nameRegex.test(inputValue)) {
      // nameRegex를 테스트 하겠다는 JS제공 메서드 test() / 매개 값 안에 테스트 할 값을 대입
      msg = '2~5 글자 사이의 한글로 작성하세요!';
    } else {
      msg = '사용 가능한 이름입니다.';
      flag = true;
    }

    // 검사 테스트를 통과 했다면!
    // '프로퍼티 이름 = 전달하고자 하는 값의 이름' 일 때는 프로퍼티 이름 생략 가능
    // 객체 프로퍼티에서 세팅하는 변수의 이름과 키 값이 동일한 경우에는
    // 콜론 생략이 가능.
    saveInputState({
      key: 'userName',
      inputValue,
      msg,
      flag,
    });
  };

  // 이메일 중복 체크 서버 통신 함수
  const fetchDuplicateCheck = (email) => {
    let msg = '',
      flag = false;
    fetch(`${API_BASE_URL}/check?email=${email}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((json) => {
        // console.log(json);
        if (json) {
          // 중복임
          msg = '이메일이 중복되었습니다.';
        } else {
          // 중복아님
          msg = '사용 가능한 이메일 입니다.';
          flag = true;

          saveInputState({
            key: 'email',
            inputValue: email,
            msg,
            flag,
          });
        }
      });
  };

  // 이메일 입력창 체인지 이벤트 핸들러
  const emailHandler = (e) => {
    const inputValue = e.target.value;
    const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '이메일은 필수 값입니다!';
    } else if (!emailRegex.test(inputValue)) {
      msg = '이메일 형식이 올바르지 않습니다.';
    } else {
      // 이메일 중복 체크
      fetchDuplicateCheck(inputValue);
    }

    // email쪽에서 부른 saveInputState
    saveInputState({
      key: 'email',
      inputValue,
      msg,
      flag,
    });
  };

  // 패스워드 입력창 체인지 이벤트 핸들러
  const passwordHandler = (e) => {
    // 패스워드가 변경됐다? -> 패스워드 확인란을 비우고 시작하자.
    // 동작 시점이 렌더링 후 사용자가 입력할때 실행되기 때문에
    // JS문법 가능
    // 그치만 첫 렌더링때는 발생 안함
    // 왜 이렇게까지 하냐 -> useState 써주기 싫어서
    document.getElementById('password-check').value = '';
    setMessage({ ...message, passwordCheck: '' });
    setCorrect({ ...correct, passwordCheck: false });

    const inputValue = e.target.value;
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;

    let msg,
      flag = false;

    if (!inputValue) {
      msg = '비밀 번호는 필수 입니다.';
    } else if (!pwRegex.test(inputValue)) {
      msg = '8글자 이상의 영문, 숫자, 특수문자를 포함 해 주세요.';
    } else {
      msg = '사용 가능한 비밀번호 입니다.';
      flag = true;
    }

    saveInputState({
      key: 'password',
      inputValue,
      msg,
      flag,
    });
  };

  // 비밀번호 확인란 체인지 이벤트 핸들러
  //  DB로 값을 보낼 필요가 없음
  // 굳이 상태로 기억하지 않아도 된다.
  // 왜냐면 사용자가 입력했을 때의 값과 일치하기만 하면 되니까
  // 그리고 saveInputState도
  const pwCheckHandler = (e) => {
    let msg;
    let flag = false;
    if (!e.target.value) {
      // 여기는 inputValue를 넘길 필요가 없음
      msg = '비밀번호 확인란은 필수입니다.';
    } else if (userValue.password !== e.target.value) {
      msg = '비밀번호가 일치하지 않습니다.';
    } else {
      msg = '비밀번호가 일치합니다.';
      flag = true;
    }

    saveInputState({
      key: 'passwordCheck',
      inputValue: 'pass', // 사용자가 입력한 값으로 보내지 않고 그냥 내가 pass라는 문자열을 넘기겠다.
      msg,
      flag,
    });
  };

  // 4개의 입력칸이 모두 검증에 통과 했는지 여부를 검사
  const isValid = () => {
    // 여기는 객체이므로 배열 고차함수인 map이나 filter 사용하지 못한다.
    for (const key in correct) {
      const flag = correct[key];
      if (!flag) return false;
    }
    return true;
  };

  // 회원 가입 처리 서버 요청
  const fetchSignUpPost = () => {
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userValue),
    }).then((res) => {
      if (res.status === 200) {
        alert('회원 가입에 성공했습니다!');
        // 로그인 페이지로 리다이렉트
        redirection('/login');
      } else {
        alert('서버와의 통신이 원활하지 않습니다. 관리자에게 문의하세요.');
      }
    });
  };

  // 회원가입 버튼 클릭 이벤트 핸들러
  const joinButtonClickHandler = (e) => {
    e.preventDefault(); // submit 기능 죽여놓기

    // 모든 사용자의 입력 값이
    if (isValid()) {
      // 회원 가입 서버 요청
      fetchSignUpPost();
    } else {
      alert('입력란을 다시 확인해 주세요!');
    }
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <form noValidate>
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
              계정 생성
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              autoComplete='fname'
              name='username'
              variant='outlined'
              required
              fullWidth
              id='username'
              label='유저 이름'
              autoFocus
              onChange={nameHandler}
            />
            <span
              style={correct.userName ? { color: 'green' } : { color: 'red' }}
            >
              {message.userName}
            </span>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='이메일 주소'
              name='email'
              autoComplete='email'
              onChange={emailHandler}
            />
            <span style={correct.email ? { color: 'green' } : { color: 'red' }}>
              {message.email}
            </span>
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
              label='패스워드'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={passwordHandler}
            />
            <span
              style={correct.password ? { color: 'green' } : { color: 'red' }}
            >
              {message.password}
            </span>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password-check'
              label='패스워드 확인'
              type='password'
              id='password-check'
              autoComplete='check-password'
              onChange={pwCheckHandler}
            />
            <span
              id='check-span'
              style={
                correct.passwordCheck ? { color: 'green' } : { color: 'red' }
              }
            >
              {message.passwordCheck}
            </span>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              style={{ background: '#38d9a9' }}
              onClick={joinButtonClickHandler}
            >
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          justify='flex-end'
        >
          <Grid item>
            <Link
              href='/login'
              variant='body2'
            >
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Join;
