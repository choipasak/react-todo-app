import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import cn from 'classnames';
import '../scss/TodoInput.scss';

const TodoInput = ({ addTodo }) => {
  // 입력창이 열리는 여부를 표현하는 상태 값
  const [open, setOpen] = useState(false);

  // 할 일 입력창에 입력한 내용을 표현하는 상태 값
  // 사용자가 input에 입력하면 그 값에 상태를 관리 해 주기 위해서
  const [todoText, setTodoText] = useState('');

  // + 버튼 클릭 시 이벤트
  const onToggle = () => {
    setOpen(!open);
    /*
     그냥 값을 true로 하면 안됨.
     그럼 누르고 나서도 상태가 안바뀜.
     그래서 open상태에 따라 반대 값으로 뒤집겠다 하면 ok
    */
  };

  // input change 이벤트 핸들러
  const todoChangeHandler = (e) => {
    setTodoText(e.target.value);
    // 여기에 매가 값으로 콜 백 함수 주면 안전 + 저장 된 값 가져오기 가능
  };

  // submit 이벤트 핸들러
  const submitHandler = (e) => {
    e.preventDefault(); // 태그의 기본 기능 제한(submit 막기)
    // 부모가 전달한 함수의 매개 값으로 입력 값 넘기기!
    addTodo(todoText);

    // 입력이 끝나면 입력창 띄우기
    setTodoText('');
  };

  return (
    <>
      {open && (
        <div className='form-wrapper'>
          <form
            className='insert-form'
            onSubmit={submitHandler}
          >
            <input
              type='text'
              placeholder='할 일을 입력 후, 엔터를 누르세요!'
              onChange={todoChangeHandler}
              value={todoText}
            />
          </form>
        </div>
      )}
      {/* 
          cn() : 첫번째 파라미터는 항상 유지할 default 클래스
                 두번째 파라미터는 논리 상태값
                 => 논리 상태값이 true일 경우 해당 클래스 추가
                    false일 경우 제거.
                    {클래스이름: 논리값}, 예시 -> {'open': open}
                    클래스 이름 지정 안할 시 변수명이 클래스 이름으로 사용됨!
        */}
      <button
        className={cn('insert-btn', { open })} // 상태변수 open
        onClick={onToggle}
      >
        <MdAdd />
      </button>
    </>
  );
};

export default TodoInput;
