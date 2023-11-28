import React, { useEffect, useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import '../scss/TodoTemplate.scss';
import { API_BASE_URL as BASE, TODO } from '../../config/host-config';

const TodoTemplate = () => {
  // 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함
  const API_BASE_URL = BASE + TODO; // 여러번 사용하기 귀찮아서 변수로 선언
  // 목록은 페이지가 띄워지자마자 나타나야 함.
  // 시작하자 렌더링 시켜주는 훅 useEffect를 사용하자! + 상태변화관리인 useState도 같이 사용

  // todos 배열을 상태 관리하겠다
  const [todos, setTodos] = useState([]);

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    const json = await res.json();
    setTodos(json.todos);
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    // 주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴.
    // setTodos(todos.filter((todo) => todo.id !== id));
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
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
      headers: { 'Content-Type': 'application/json' },
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

  useEffect(() => {
    // 여기 안에 fetch문을 작성해서 목록 가져와서 화면에 뿌릴 것임
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    fetch(API_BASE_URL)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        // fetch를 통해 받아온 데이터를 상태 변수에 할당
        setTodos(json.todos);
      });
  }, []);

  return (
    <div className='TodoTemplate'>
      <TodoHeader count={countRestTodo} />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
};

export default TodoTemplate;
