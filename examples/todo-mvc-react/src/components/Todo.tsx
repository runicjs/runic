import { useEffect, useState } from 'react';
import { removeTodo, setTodoCompletionStatus, setTodoText } from '../actions';
import { Todo as TodoModel } from '../types';

export default function Todo({ todo }: { todo: TodoModel }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  useEffect(() => {
    setEditText(todo.text);
  }, [todo.text]);

  const onEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const onEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setTodoText(todo.id, event.currentTarget.value?.trim() || '');
      setIsEditing(false);
    } else if (event.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const onTodoEdit = () => {
    setIsEditing(true);
  };

  const onTodoToggle = () => {
    setTodoCompletionStatus(todo.id, !todo.completed);
  };

  const onTodoDestroy = () => {
    removeTodo(todo.id);
  };

  return (
    <li className={isEditing ? 'editing' : todo.completed ? 'completed' : ''}>
      {isEditing ? (
        <input className="edit" value={editText} onChange={onEditChange} onKeyDown={onEditKeyDown} />
      ) : (
        <div className="view">
          <input className="toggle" type="checkbox" checked={todo.completed} onChange={onTodoToggle} />
          <label onDoubleClick={onTodoEdit}>{todo.text}</label>
          <button className="destroy" onClick={onTodoDestroy} />
        </div>
      )}
    </li>
  );
}
