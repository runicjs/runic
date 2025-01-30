export type Filter = 'all' | 'active' | 'completed';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type NewTodo = Omit<Todo, 'id'>;
