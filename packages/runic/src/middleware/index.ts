/*
IDEA:

const withMiddleware = combineMiddleware([
  loggingMiddleware,
  errorReportingMiddleware,
  persistenceMiddleware,
  devToolsMiddleware,
  immerMiddleware, // or mutativeMiddleware
]);

function combineMiddleware(middlewares: Middleware[]) {
  return (args: Array<unknown>, store: Store) => {
    // ...
  };
}

const userStore = withMiddleware(['user'], createStore({
  id: 1,
  name: 'John Doe',
}));

const counterStore = withMiddleware(['counter'], createStore({
  count: 0,
}));
*/
