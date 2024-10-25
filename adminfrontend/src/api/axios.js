import axios from 'axios'


// const BASE_URL = 'http://16.16.186.73:4000'

const BASE_URL = 'http://51.21.150.105:4000'



export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});