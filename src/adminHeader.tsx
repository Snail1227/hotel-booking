import { Link } from 'react-router-dom';
import React from 'react';

interface AdminProps {
    isAdmin: boolean;
    toggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminProps> = ({
    isAdmin,
    toggleSidebar
}) => {

    return (

      <div className={isAdmin ? "container-admin" : "container-admin inactive-header"}>
        <h3>Admin center</h3>
          <ul>
            <li onClick={toggleSidebar}><Link to="/addNewRoom">Add Room</Link></li>
            <li onClick={toggleSidebar}><Link to="/updateRoom">Update Room</Link></li>
          </ul>
      </div>
      );
}