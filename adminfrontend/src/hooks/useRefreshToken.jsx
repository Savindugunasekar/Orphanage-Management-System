import React from 'react'
import useAuth from './useAuth'
import axios from '../api/axios'
import { jwtDecode } from 'jwt-decode'

export const useRefreshToken = () => {

    const { setAuth } = useAuth()

    const refresh = async () => {

        const response = await axios.get('/refresh', {
            withCredentials: true
        })

        const accessToken = response.data.accessToken;


        const decoded = jwtDecode(accessToken);
        const roles = decoded?.UserInfo?.roles || [];
        const username = decoded?.UserInfo?.username;
        const userId = decoded?.UserInfo?.userId


        const orphanageid = decoded?.UserInfo?.orphanageid;



        setAuth(prev => {

            return {
                ...prev, accessToken: response.data.accessToken, roles: roles, username: username, orphanageId: orphanageid, userId: userId

            }
        })

        return response.data.accessToken
    }

    return refresh


}

export default useRefreshToken