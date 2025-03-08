import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()

const UserContext = ({children}) => {
    const [userData, setUserData] = useState({
        fullname: '',
        username: '',
        email: ''
    });

  return (
    <div>
        <UserDataContext.Provider value={{userData, setUserData}}>
            {children}
        </UserDataContext.Provider>
    </div>
  )
}

export default UserContext