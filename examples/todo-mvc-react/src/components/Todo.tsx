import { memo, useCallback, useEffect, useState } from 'react';
import * as app from '../stores/app';
import { Todo as TodoModel } from '../types';

const Todo = memo(({ todo }: { todo: TodoModel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  useEffect(() => {
    setEditText(todo.text);
  }, [todo.text]);

  const onEditChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  }, []);

  const onEditKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        app.setTodoText(todo.id, event.currentTarget.value?.trim() || '');
        setIsEditing(false);
      } else if (event.key === 'Escape') {
        setEditText(todo.text);
        setIsEditing(false);
      }
    },
    [todo.id, todo.text],
  );

  const onTodoEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const onTodoToggle = useCallback(() => {
    app.setTodoCompletionStatus(todo.id, !todo.completed);
  }, [todo.id, todo.completed]);

  const onTodoDestroy = useCallback(() => {
    app.removeTodo(todo.id);
  }, [todo.id]);

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
});

export default Todo;
