import React, { createContext, useState } from 'react'

export const StoreDataContext = createContext();
const StoreContext = ({children}) => {

  const [storeData,setStoreData] = useState({
    storename: '',
    ownername: '',
    email: '',
    address:{
      building: '',
      city: '',
      state: '',
      zip: '',
    },
    phone: ''
  });

  return (
    <div>
      <StoreDataContext.Provider value={{storeData, setStoreData}}>
        {children}
      </StoreDataContext.Provider>
    </div>
  )
}

export default StoreContext