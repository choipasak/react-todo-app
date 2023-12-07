import React, { useEffect, useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import '../scss/TodoTemplate.scss';
import { Spinner } from 'reactstrap';

import { API_BASE_URL as BASE, TODO, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import { getLoginUserInfo } from '../../utils/login-util';
import HttpService from '../../utils/httpService';

const TodoTemplate = () => {
  const redirection = useNavigate();

  // 로그인 인증 토큰 얻어오기 -> Context API를 구축하기 전에는 login-utils에 토큰을 얻어왔었음
  // 엇 그렇게 얻어와야 할듯
  const [token, setToken] = useState(getLoginUserInfo().token);
  // getLoginUserInfo()를 부르면 객체가 오기때문에 거기서 token만 받겠다고 해줘야 함.
  // fetch 요청 보낼 때 사용할 요청 헤더 설정
  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 일종의 타입을 선언
    Authorization: 'Bearer ' + token,
  };

  // 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함
  const API_BASE_URL = BASE + TODO; // 여러번 사용하기 귀찮아서 변수로 선언
  const API_USER_URL = BASE + USER;
  // 목록은 페이지가 띄워지자마자 나타나야 함.
  // 시작하자 렌더링 시켜주는 훅 useEffect를 사용하자! + 상태변화관리인 useState도 같이 사용

  // todos 배열을 상태 관리하겠다
  const [todos, setTodos] = useState([]);

  // 로딩 상태값 관리(처음에는 무조건 로딩이 필요하기 때문에 true -> 로딩 끝나면 false로 전환)
  const [loading, setLoading] = useState(true);

  // id가 시퀀스 함수(DB 연동시키면 필요 없어짐.)
  const makeNewId = () => {
    // 할 일이 1개도 없으면
    if (todos.length === 0) return 1;
    return todos[todos.length - 1].id + 1; // 맨 마지막 할 일 객체의 id보다 하나 크게
  };

  /*
    todoInput에게 todoText를 받아오는 함수
    자식 컴포넌트가 부모컴포넌트에게 데이터를 전달할 때는
    일반적인 props 사용이 불가능.
    부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달
    자식 컴포넌트에서 전달받은 함수를 호출하면서 매개 값으로 데이터를 전달.
  */

  const addTodo = async (todoText) => {
    const newTodo = {
      title: todoText,
    }; // 나중에 fetch를 이용해서 백엔드에 insert 요청 보내야함
    /*
    1. todos.push(newTodo); : (X) -> 이렇게 작성하면 안된다. 상태 변수(useState 변수)는 setter로 변경해야 함
    2. setTodos(todos.push(newTodo)); : (X) -> 객체 자체를 통채로 변경해야 함. 새로운 배열로 갈아 끼워야 한다.
    - react의 상태 변수는 불변성(immutable)을 가지기 때문에
    기존 상태에서 변경은 불가능 -> 새로운 상태로 만들어서 변경해야 한다.
    */
    //   setTodos((oldTodos) => {
    //     // oldTodos에는 가장 최신의 상태값(스냅샷)객체가 온다.
    //     return [...oldTodos, newTodo];
    //   });
    /*
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((json) => {
        setTodos(json.todos);
      });
      */
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify(newTodo),
    });

    if (res.status === 200) {
      const json = await res.json();
      setTodos(json.todos);
    } else if (res.status === 401) {
      alert('COMMON등급 회원은 일정 등록이 5개로 제한 됩니다.');
    } else if (res.status === 400) {
      alert('올바르지 않은 입력값 입니다!');
    }
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    // 주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴.
    // setTodos(todos.filter((todo) => todo.id !== id));
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: requestHeader,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('data -> ', json);
        setTodos(json.todos);
      });
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {
    fetch(API_BASE_URL, {
      method: 'PATCH',
      headers: requestHeader,
      body: JSON.stringify({
        done: !done,
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => setTodos(json.todos));
  };

  /*
    내가 시도한 버전
    fetch(API_BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id, done),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if(json.todos.done)
        setTodos(json.todos);
      });
    */
  /*
    방법1
    const copyTodos = [...todos]; // 배열 복사해왔음
    for (let cTodo of copyTodos) {
      if (cTodo.id === id) {
        cTodo.done = !cTodo.done;
      }
    }
    setTodos(copyTodos);
    */
  // 방법2
  // setTodos(
  //   todos.map((todo) =>
  //     todo.id === id ? { ...todo, done: !todo.done } : todo
  //   )
  // );

  // 체크가 안 된 할 일의 개수 카운트 하기
  const countRestTodo = () => todos.filter((todo) => !todo.done).length; // !todo.done -> false인 애들 말하는 것임
  // 배열 안에 남은 객체는 done: true 인 애들이니까 배열의 길이를 알면 끝
  /*
  내가 한 버전
  let count = 0;
  const countRestTodo = {
    // 객체가 잇는데 그 안에 done의 값이 true 인 애들만 카운트ㅏ하기
    todos.map(todo => todo.done === true ? count++ : )
};*/

  // 비동기 방식 등업 함수
  const fetchPromote = async () => {
    const res = await fetch(API_USER_URL + '/promote', {
      method: 'PUT',
      headers: requestHeader,
    });

    if (res.status === 403) {
      alert('이미 프리미엄 회원입니다.');
    } else if (res.status === 200) {
      const json = await res.json();
      console.log('dto 필드명 확인용도: ', json);
      // 백엔드에 작성 되어 있는 DTO의 필드명으로 작성 해 줘야 한다.
      localStorage.setItem('ACCESS_TOKEN', json.token);
      localStorage.setItem('USER_ROLE', json.role);
      setToken(json.token);
    }
  };

  // 등업 요청 to 서버 (COMMON -> PREMIUM)
  const promote = () => {
    console.log('등업 서버에 요청!');
    fetchPromote();
  };

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    HttpService(API_BASE_URL, {
      method: 'GET',
      headers: requestHeader,
    });

    if (res) {
      if (res.status === 200) return res.json();
    }

    // console.log(json);
    // 여기 안에 fetch문을 작성해서 목록 가져와서 화면에 뿌릴 것임
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    fetch(API_BASE_URL, {
      method: 'GET',
      headers: requestHeader,
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) {
          alert('로그인이 필요한 서비스입니다!');
          redirection('/login');
          return;
        } else {
          alert('관리자에게 문의하세요!');
        }
        return;
      })
      .then((json) => {
        console.log(json);

        // fetch를 통해 받아온 데이터를 상태 변수에 할당
        if (json) setTodos(json.todos);

        // 로딩 완료 처리
        setLoading(false);
      });
  }, []);

  // 로딩이 끝난 후 보여줄 컴포넌트
  const loadEndedPage = (
    <div className='TodoTemplate'>
      <TodoHeader
        count={countRestTodo}
        promote={promote}
      />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );

  // 로딩 중일 때 보여줄 컴포넌트
  const loadingPage = (
    <div className='loading'>
      <Spinner color='danger'>loading...</Spinner>
    </div>
  );

  return <>{loading ? loadingPage : loadEndedPage}</>;
};

export default TodoTemplate;
