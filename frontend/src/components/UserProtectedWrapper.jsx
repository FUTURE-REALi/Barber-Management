import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
const UserProtectedWrapper = ({children}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserDataContext);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setUserData(response.data);
                    setIsLoading(false);
                }
            }
            ).catch((error) => {
                localStorage.removeItem('token');
                console.log(error);
                navigate('/login');
            })
        }
    }, [token])
    if (isLoading) {
        return <div>Loading...</div>
    }
    else {
        return (
            <>
                {children}
            </>
        )
    }
}

export default UserProtectedWrapper