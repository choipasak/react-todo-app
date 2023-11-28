// 로그인 한 유저의 데이터 객체를 반환하는 함수
export const getLoginUserInfo = () => {
  return {
    token: localStorage.getItem('ACCESS_TOKEN'),
    username: localStorage.getItem('LOGIN_USERNAME'),
    role: localStorage.getItem('USER_ROLE'),
  };
};

// 로그인 여부를 확인하는 함수
/*
const isLogin = () => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token === null) return false;
  return true;
};
*/

// 더 줄인 isLogin()
export const isLogin = () => !!localStorage.getItem('ACCESS_TOKEN');
// 앞에 !가 2개 붙으면 -> 논리 값으로 바꿔준다.
/*
    ! 1개 : 논리 반전 연산자(부정)
    !! 2개: 만약 null이 왔다면 null값은 false값이 됌.으로 만들어주는 식(논리부정을 한번 하면 논리 값으로 되니까 그 반전 시킨 값을 다시 반전시켜준거임)
    정상적인 토큰 값이 왔을 때도 마찬가지임.
    정상적인 토큰 값은 String이니까 논리 부정으로 false값으로 바꾸고 그걸 다시 바꿔서 true값으로 만들어 준다.
    원래 원하던 결과인 정상적 토큰값 -> true값 으로 만들어 준 것임

    - 정리
    특정 값이나 메서드의 리턴값을 논리 타입으로 변환하고자 할 때 !!를 붙인다.
    localStorage.getItem의 결과를 논리타입으로 리턴 -> 값이 있으면 true, null이면 false로 리턴.
*/
