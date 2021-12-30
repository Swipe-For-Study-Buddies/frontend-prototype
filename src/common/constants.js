const API_URL = process.env.NODE_ENV === 'production' ?
  'http://localhost:8080/api/auth/' :
  'http://localhost:8080/api/auth/'

export { API_URL }
