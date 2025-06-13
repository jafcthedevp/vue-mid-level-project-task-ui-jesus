import axios from 'axios';


const api = axios.create({
  baseURL: "https://681507e7225ff1af162aeb7e.mockapi.io/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;