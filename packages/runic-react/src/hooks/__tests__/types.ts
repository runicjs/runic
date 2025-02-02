export type SimpleState = {
  x: number;
};

export type Vector2State = {
  x: number;
  y: number;
};

export type Vector3State = {
  x: number;
  y: number;
  z: number;
};

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export type TodoListState = {
  filter: string;
  todos: Todo[];
};
