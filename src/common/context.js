import { createContext } from 'react';

const ContextStore = createContext({
  currentUser: {},
  setCurrentUser: () => { },
})

export default ContextStore