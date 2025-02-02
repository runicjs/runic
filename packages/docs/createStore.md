```ts
// src/stores/app.ts

export type UserState = {
  id: string;
  name: string;
  email: string;
};

export type Filter = 'all' | 'active' | 'completed';

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  userId: string;
};

export type TodoListState = {
  filter: Filter;
  todos: Todo[];
};

const app = createStore({
  options: {
    producer: immer.produce,
    // ...
  },

  middleware: [
    reactUseMiddleware(), // Provides the store.use function.
    localstorageMiddleware('app'),
    memoizeFunctionsMiddleware(),
    // ...
  ],

  // Runes cannot be access directly from outside of the store.
  runes: {
    user: createRune<UserState>({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    }),

    todoList: createRune<TodoListState>({
      filter: 'all',
      todos: [
        { id: '1', text: 'Buy milk', done: false, userId: '1' },
        { id: '2', text: 'Buy bread', done: false, userId: '1' },
        { id: '3', text: 'Buy eggs', done: false, userId: '2' },
      ],
    }),
  },

  // What if you can call getters directly, and also use them
  // as selectors with e.g.
  //   app.use(store.getters.getFilteredTodos)
  //   app.use('getFilteredTodos')
  getters: {
    getEmail: ({ user }) => user.email,
    getFilter: ({ todoList }) => todoList.filter,
    getTodos: ({ todoList }) => todoList.todos,
    getUserTodos: ({ user, todoList }) => todoList.todos.filter((todo) => todo.userId === user.id),
    getActiveTodos: ({ todoList }) => todoList.todos.filter((todo) => !todo.done),
    getCompletedTodos: ({ todoList }) => todoList.todos.filter((todo) => todo.done),
    getHasActiveTodos: ({ todoList }) => todoList.todos.some((todo) => !todo.done),
    getHasCompletedTodos: ({ todoList }) => todoList.todos.some((todo) => todo.done),
    getFilteredTodos: ({ todoList: { filter, todos } }) => {
      return todos.filter((todo) => {
        if (filter === 'active') return !todo.done;
        if (filter === 'completed') return todo.done;
        return true;
      });
    },
    getTodosByFilter: ({ todoList: { todos } }, filter: Filter) => {
      return todos.filter((todo) => {
        if (filter === 'active') return !todo.done;
        if (filter === 'completed') return todo.done;
        return true;
      });
    },
    getTodo: ({ todoList: { todos } }, id: string) => {
      return todos.find((todo) => todo.id === id);
    },
  },

  setters: {
    // When writing setters, the first argument is the state drafts
    // from your configured producer, rather than the state itself.
    setFilter: ({ todoList: { filter } }, filter: Filter) => {
      todoList.filter = filter;
    },

    addTodo: ({ todoList: { todos } }, todo: Todo) => {
      todos.push(todo);
    },

    toggleTodo: ({ todoList: { todos } }, id: string) => {
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) return;
      todo.done = !todo.done;
    },

    deleteTodo: ({ todoList: { todos } }, id: string) => {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index === -1) return;
      todos.splice(index, 1);
    },
  },
});
```

Which will give us this API:

```ts
// Use any getter as a selector (in a react component)
const filteredTodos = app.use('getFilteredTodos')

// Gives the state objects.
const unsubscribe = app.subscribe(({ user, todoList }) => {
  console.log('user', user)
  console.log('todoList', todoList)
});

// Gives the drafts, based on the configured producer.
app.update(({ user, todoList }) => {
  user.name = 'Jane Doe'
  todoList.filter = 'completed'
})

// Getters created automatically for each rune
app.getUser() // => User
app.getTodoList() // => TodoList

// Getters
app.getEmail() // => 'john.doe@example.com'
app.getFilter() // => Filter
app.getTodos() // => [Todo]
app.getUserTodos() // => [Todo]
app.getActiveTodos() // => [Todo]
app.getCompletedTodos() // => [Todo]
app.getHasActiveTodos() // => boolean
app.getHasCompletedTodos() // => boolean
app.getFilteredTodos() // => [Todo]
app.getTodosByFilter(filter: Filter) // => [Todo]
app.getTodo(id: string) // => Todo

// Setters
app.setFilter(filter: Filter) // => void
app.addTodo(todo: Todo) // => void
app.toggleTodo(id: string) // => void
app.deleteTodo(id: string) // => void
```

You could also do something like this:

```ts
getters: {
  user: {
    getId: ({ user }) => user.id,
    getEmail: ({ user }) => user.email,
  },
  getFilter: ({ todoList }) => todoList.filter,
  todos: {
    get: ({ todoList: { todos } }, id: string) => {
      return todos.find((todo) => todo.id === id);
    },
    getAll: ({ todoList }) => todoList.todos,
    getForUser: ({ user, todoList }) => todoList.todos.filter((todo) => todo.userId === user.id),
    // TODO: Can/should these be memoized by arguments?
    getByUserId: ({ todoList }, userId: string) => todoList.todos.filter((todo) => todo.userId === userId),
    getActive: ({ todoList }) => todoList.todos.filter((todo) => !todo.done),
    getCompleted: ({ todoList }) => todoList.todos.filter((todo) => todo.done),
    getHasActive: ({ todoList }) => todoList.todos.some((todo) => !todo.done),
    getHasCompleted: ({ todoList }) => todoList.todos.some((todo) => todo.done),
    getFiltered: ({ todoList: { filter, todos } }) => {
      return todos.filter((todo) => {
        if (filter === 'active') return !todo.done;
        if (filter === 'completed') return todo.done;
        return true;
      });
    },
    getByFilter: ({ todoList: { todos } }, filter: Filter) => {
      return todos.filter((todo) => {
        if (filter === 'active') return !todo.done;
        if (filter === 'completed') return todo.done;
        return true;
      });
    },
  },
},
```

Which would yield this API:

```ts
store.user.getId() // => string
store.user.getEmail() // => string
store.getFilter() // => Filter
store.todos.get(id: string) // => Todo
store.todos.getAll() // => [Todo]
store.todos.getForUser() // => [Todo]
store.todos.getByUserId(userId: string) // => [Todo]
store.todos.getActive() // => [Todo]
store.todos.getCompleted() // => [Todo]
store.todos.getHasActive() // => boolean
store.todos.getHasCompleted() // => boolean
store.todos.getFiltered() // => [Todo]
store.todos.getByFilter(filter: Filter) // => [Todo]
```

And of course all of this would be type-safe. `createStore` would create a Store type that has all of this baked in.
