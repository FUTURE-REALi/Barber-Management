import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const UserDataContext = createContext()

const UserContext = ({children}) => {
    const [userData, setUserData] = useState({
        fullname: '',
        username: '',
        email: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role === 'user') {
          axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                if (response.status === 200) {
                  setUserData(response.data);
                }
            }
            ).catch((error) => {
              setUserData({
                fullname: '',
                username: '',
                email: ''
              });
            })
        }
    }
    , []);

  return (
    <div>
        <UserDataContext.Provider value={{userData, setUserData}}>
            {children}
        </UserDataContext.Provider>
    </div>
  )
}

export default UserContext