import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import NavBar from './components/NavBar.jsx'
import UserLogin from './pages/UserLogin.jsx'

const App = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/login' && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
      </Routes>
    </div>
  )
}

export default App