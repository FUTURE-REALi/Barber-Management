import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import NavBar from './components/NavBar.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/navbar" element={<NavBar />} />
      </Routes>
    </div>
  )
}

export default App