import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',

});

// used to add jwt token from localstorage to every request
API.interceptors.request.use((cpnfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        cpnfig.headers.Authorization = `Bearer ${token}`;
    }
    return cpnfig;
})

export default API;
