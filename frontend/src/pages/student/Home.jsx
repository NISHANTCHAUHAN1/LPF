import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/authContext';
import React, { useContext } from 'react'

const Home = () => {
  const { resetCredentials } = useContext(AuthContext);
  const handleLogout = () => {
    resetCredentials()
    sessionStorage.clear();
  }
  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default Home
