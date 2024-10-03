import React from 'react'
import { Button } from './components/ui/button';
import { Route, Routes } from "react-router-dom";
import Auth from './pages/auth/auth';


const App = () => {
  return (
    <Routes>
      <Route path='auth' element={ <Auth /> } />
    </Routes>

  )
}

export default App
