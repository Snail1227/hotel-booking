import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Request } from './api';
import toast from 'react-hot-toast';

interface UserInfoProp {
    username: string;
    email: string;
}


export function UserProfile() {
    const [userInfo, setUserInfo] = useState<UserInfoProp | null>(null);

    const token = localStorage.getItem("logged");

    useEffect(() => {
        if (token) {
          const fetchUserName = async () => {
            try {
              const response = await Request.getUserProfile(token);
              if (response && response.username && response.email) { 
                setUserInfo(response)
              } else {
                toast.error("Info not found in response");
              }
            } catch (error) {
                toast.error("Failed to fetch user name:" + error);
            }
          };
          
      
          fetchUserName();
        }
      }, [token]);

    return (
        <div className='containerUserProfile'>
            <div className='user-form'>
                <div>
                    <FontAwesomeIcon icon={faUser} className='userIcon'/>
                </div>
                <div className='user-info'>
                    <div className='user-username'>
                        <h4>UserName: </h4>
                        <p>{userInfo?.username}</p>
                    </div>
                    <div className='user-email'>
                        <h4>Email: </h4>
                        <p>{userInfo?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

