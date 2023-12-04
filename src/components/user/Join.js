import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';
import CustomSnackBar from '../layout/CustomSnackBar';
import './join.scss';
import rocktheworld from '../../assets/img/79505b031fb97b848044ad0f4935cd98.jpg';

const Join = () => {
  // useRef를 사용해서 태그를 참조하기
  const $fileTag = useRef();

  const redirection = useNavigate();

  const { isLoggedIn } = useContext(AuthContext); // 현제 유저가 로그인 중인지 아닌지를 알려주는 상태변수
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setOpen(true);
      // 일정 시간 뒤 Todo 화면으로 redirection
      setTimeout(() => {
        redirection('/');
      }, 3000);
    }
  }, [isLoggedIn, redirection]); // 여기의 배열을 비워서 스낵바가 작동을 안했음.
  // 2개의 변수를 집어 넣어줘야 useEffect가 작동이 되는 것임.

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
  const fetchSignUpPost = async () => {
    /*
      정리!
      - multipart/form-data는 무조건 Form을 사용해야 해서 이렇게 된 것임.
      - 기존 회원가입은 단순히 텍스트를 객체로 모은 후 JSON으로 변환해서 요청 보내주면 끝.
      이제는 프로필 이미지가 추가됨 -> 파일 첨부요청은 multipart/form-data로 전송해야 함.
      그래서 그냥 바로 전달하면 안된다.
      FormData객체를 활용해서 Content-Type을 multipart/form-data로 지정한 후 전송하려 함.
      그럼 JSON 데이터는? Content-Type이 application/json이다.
      이렇게 타입(Content-Type)이 다른 것들끼리 한번에 보내면
      서버에서는 에러(415 - unsupported Media Type)가 남 -> 받은 데이터가 뭔 타입인지 몰겟다!
      그렇다면 -> JSON을 Blob으로 바꿔서 함께 보내자.
      - Blob: 이미지나 사운드 비디오 같은 멀티미디어 파일을 가장 작은 byte단위로
      쪼개어 파일의 손상을 방지하게 해주는 타입 -> multipart/form-data에도 허용됨.
    */

    // userValue는 JS객체임 그래서 JSON형태로 바꿔서 보내줘야함.
    // 왜냐면 Form은 JS객체를 받지 않기 때문! (ERROR)
    // JSON을 Blob타입으로 변경 후 FormData에 넣기
    const userJsonBlob = new Blob([JSON.stringify(userValue)], {
      type: 'application/json',
    });

    // 이미지 파일과 회원 정보 JSON을 하나로 묶어서 보낼 예정.
    // FormData 객체를 사용해서 보낼 것임.
    const userFormData = new FormData();
    // 앞의 이름으로 서버로 넘어감 앞의 식별자가 파라미터명이 되는 것
    userFormData.append('user', userJsonBlob);
    userFormData.append('profileImage', $fileTag.current.files[0]); // 보낼 때는 객체 자체를 보낸다.

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      body: userFormData,
    });
    console.log(res);
    if (res.status === 200) {
      alert('회원가입에 성공했습니다!');
      redirection('/login');
    } else {
      alert(res.text());
      alert('서버와의 통신이 원활하지 않습니다.');
    }

    // 아래의 내용은 사용하지 X 아까워서 못 없앴음. ㅋㅋ
    /*
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
    */
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

  // 이미지 파일 상태 변수 선언
  const [imgFile, setImgFile] = useState(null);

  // 이미지 파일을 선택했을 때 썸네일 뿌리기!
  const showThumbnailHandler = (e) => {
    // 이벤트 객체 사용할거니까 받아줘야 함!

    // 1. 첨부 된 파일의 정보를 얻어오자!
    const file = $fileTag.current.files[0];

    // 첨부한 파일 이름을 얻은 후, 확장자만 추출.(소문자로 일괄 변경)
    const fileExt = file.name.slice(file.name.indexOf('.') + 1).toLowerCase();

    if (
      fileExt !== 'jpg' &&
      fileExt !== 'png' &&
      fileExt !== 'jpeg' &&
      fileExt !== 'gif'
    ) {
      alert('이미지 파일(jpg, png, jpeg, gif)만 등록이 가능합니다!');

      // 사용자가 맞지 않는 파일의 확장자를 첨부한 것을 발견했다면,
      // input의 상태도 원래대로 돌려 놓아야 한다.
      // 그렇지 않으면 잘못된 파일을 input 태그가 여전히 가지고 있게 됨 -> 서버 요청 시 에러 유발!
      $fileTag.current.value = '';

      return;
    }

    // console.log(file);
    // 2. 바꿀 파일로 파일 교체 해주기
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // 3. 파일 바꿔줬으면 상태변화하고 저장.
    reader.onloadend = () => {
      // console.log('결과: ', reader.result); -> 파일리더가 읽어들인 결과 값
      setImgFile(reader.result);
    };
  };

  return (
    <>
      {!isLoggedIn && (
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
                <div
                  className='thumbnail-box'
                  /*
                    이 div가 클릭되면 밑밑의 input태그를 클릭하는 기능+효과 와
                    똑같이 작동하게 하곘다.
                    useRef를 사용해서 -> 맨 위에 선언되어 있음!
                  */
                  onClick={() => {
                    $fileTag.current.click();
                  }}
                >
                  <img
                    // 삼항연산식까지 안가도 된다. if문도 필요X
                    src={imgFile || require('../../assets/img/image-add.png')}
                    alt='profile'
                  />
                </div>
                <label
                  className='signup-img-label'
                  htmlFor='profile-img'
                >
                  프로필 이미지 추가
                </label>
                <input
                  id='profile-img'
                  type='file'
                  style={{ display: 'none' }}
                  accept='image/*'
                  ref={$fileTag}
                  onChange={showThumbnailHandler}
                />
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
                  style={
                    correct.userName ? { color: 'green' } : { color: 'red' }
                  }
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
                <span
                  style={correct.email ? { color: 'green' } : { color: 'red' }}
                >
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
                  style={
                    correct.password ? { color: 'green' } : { color: 'red' }
                  }
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
                    correct.passwordCheck
                      ? { color: 'green' }
                      : { color: 'red' }
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
      )}
      <CustomSnackBar open={open} />
      {/* 로그인을 했다면 위의 내용을 보여주고, 로그인 상태가 아니라면 위의 리턴 내용을 보여주지 않곘다 
        그니까 로그인 중이면 회원가입 페이지를 보여주지 않겠다!!!
      */}
    </>
  );
};

export default Join;
