import React, { useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import './scss/TodoTemplate.scss';

const TodoTemplate = () => {
  // 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함 -> 나중에 하자!

  // todos 배열을 상태 관리하겠다
  const [todos, setTodos] = useState([
    {
      // 객체로 관리 -> 객체 하나가 할일 1개
      id: 1,
      title: '아침 산책하기',
      done: true,
    },
    {
      // 객체로 관리 -> 객체 하나가 할일 1개
      id: 2,
      title: '오늘 주간 신문 읽기',
      done: true,
    },
    {
      // 객체로 관리 -> 객체 하나가 할일 1개
      id: 3,
      title: '샌드위치 사먹기',
      done: false,
    },
    {
      // 객체로 관리 -> 객체 하나가 할일 1개
      id: 4,
      title: '리액트 복습하기',
      done: false,
    },
  ]);

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
  const addTodo = (todoText) => {
    const newTodo = {
      id: makeNewId(),
      title: todoText,
      done: false,
    }; // 나중에 fetch를 이용해서 백엔드에 insert 요청 보내야함
    /*
    1. todos.push(newTodo); : (X) -> 이렇게 작성하면 안된다. 상태 변수(useState 변수)는 setter로 변경해야 함
    2. setTodos(todos.push(newTodo)); : (X) -> 객체 자체를 통채로 변경해야 함. 새로운 배열로 갈아 끼워야 한다.
    - react의 상태 변수는 불변성(immutable)을 가지기 때문에
    기존 상태에서 변경은 불가능 -> 새로운 상태로 만들어서 변경해야 한다.
    */

    setTodos((oldTodos) => {
      // oldTodos에는 가장 최신의 상태값(스냅샷)객체가 온다.
      return [...oldTodos, newTodo];
    });
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    // 주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴.
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id) => {
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
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

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
