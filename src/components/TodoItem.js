import React from 'react';
import { MdDelete, MdDone } from 'react-icons/md';
import './scss/TodoItem.scss';

const TodoItem = () => {
  return (
    <li className='todo-list-item'>
      <div className='check-circle'>
        <MdDone />
      </div>
      <span className='text'>할일어저구저저구</span>
      <div className='remove'>
        <MdDelete />
      </div>
    </li>
  );
};

export default TodoItem;
