import React from 'react';
import { Link} from 'react-router-dom';
import "./App.css"

interface HeaderProps {
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
}) => {
  
  return (
    <nav className="container-fluid">
      <ul>
        <li><strong>Hotel Paradise</strong></li>
      </ul>
      <ul>
        <li><Link to="/welcome" >Home</Link></li>
        <li><Link to="/booking">Book Now</Link></li>
        <li className={isLoggedIn ? 'inactive-header' : ''}><Link to="/signup" >Create Account</Link></li>
        
      </ul>
    </nav>
  );
};
