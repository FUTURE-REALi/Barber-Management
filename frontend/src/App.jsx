import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import NavBar from './components/NavBar.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignUp from './pages/UserSignUp.jsx'
import StoreLogin from './pages/StoreLogin.jsx'
import StoreLandingPage from './pages/StoreLangingPage.jsx'
import StoreRegister from './pages/StoreRegister.jsx'
import StoreHomePage from './pages/StoreHomePage.jsx'
const App = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/registerstore' && location.pathname !== '/storelogin' && location.pathname !== '/storelanding' && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/storelanding" element={<StoreLandingPage />}></Route>
        <Route path="/storelogin" element={<StoreLogin />}></Route>
        <Route path="/registerstore" element={<StoreRegister/>}></Route>
        <Route path="/storehome" element={<StoreHomePage />}></Route>
      </Routes>
    </div>
  )
}

export default App