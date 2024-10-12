import axios from 'axios'

const BASE_URL = 'http://16.16.186.73:4000'

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});