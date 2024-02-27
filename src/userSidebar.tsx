import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminHeader } from './adminHeader';


interface NavBar {
    isLoggedIn?: boolean;
    setIsLoggedIn?: (value: boolean) => void;
    isAdmin: boolean;
}



const Sidebar: React.FC<NavBar> = ({
    setIsLoggedIn,
    isAdmin
  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogOut = () => {
    localStorage.removeItem('logged');
    toggleSidebar();
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    navigate('/welcome');
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'close'}`}>
        {/* Sidebar content goes here */}
        <li className='hidden' onClick={toggleSidebar}><Link to="/userProfile" >My profile</Link></li>
        <li className='hidden' onClick={toggleSidebar}><Link to="/userHistory" >Booking history</Link></li>
        <li
            className='hidden' 
            onClick={() => handleLogOut()}
        ><Link to="/logout" >Log Out</Link></li>
        <AdminHeader isAdmin={isAdmin} toggleSidebar={toggleSidebar}/>
      </div>
      <div className="sidebar-icon" >
        {/* Replace this div with an actual icon from FontAwesome or another library */}
        <div >
            <p onClick={toggleSidebar}>{!isOpen ? "☰" : "✕"}</p> 
        </div>
      </div>
    </>
  );
};

export default Sidebar;
