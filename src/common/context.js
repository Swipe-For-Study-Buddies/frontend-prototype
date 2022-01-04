import { createContext } from 'react';

const ContextStore = createContext({
  currentUser: {},
  setCurrentUser: () => { },
  addMessage: () => { },
});

export default ContextStore;