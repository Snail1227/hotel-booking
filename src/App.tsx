import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import {Welcome} from './welcome';
import {Booking} from './booking';
import { Toaster } from "react-hot-toast";
import SignUp from './Signup';
import Login from './Login';
import AddNewRoom from './addNewRoom';
import { Header } from './header';
import { Footer } from './footer';
import BookingConfirmation from './confirmBooking';
import Sidebar from './userSidebar';
import { Request } from './api';
import History from './userHistory';
import { UserProfile } from './userProfile';
import UpdateRoom from './updateRoom';


export const userToken = localStorage.getItem("logged");

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("logged") !== null;
    

    const checkRole = async () => {
      if (userToken) {
        const isAdmin = await Request.confirmAdminRole(userToken);
        setIsAdmin(isAdmin);
      }
    };
    setIsLoggedIn(isUserLoggedIn);

    checkRole();
  }, []);

  const LocationAwareFooter = () => {
    const location = useLocation();
    const isSignUpActive = location.pathname === '/signup';
    const isLogInActive = location.pathname === '/login';
    const isAddRoomActive = location.pathname === '/addNewRoom';
    const isBookingConfirmation = location.pathname === '/bookingConfirmation';
    const isBookingHistory = location.pathname === '/userHistory';

    return <Footer 
      isSignUpActive={isSignUpActive}
      isLogInActive={isLogInActive} 
      isAddRoomActive={isAddRoomActive}
      isBookingConfirmation={isBookingConfirmation}
      isBookingHistory={isBookingHistory}
      />;
  };


  return (
    <>
      <Router >
        <Toaster />
          <Header
            isLoggedIn={isLoggedIn}
            />
            {isLoggedIn && <Sidebar 
              isAdmin={isAdmin} 
              setIsLoggedIn={setIsLoggedIn}
            />}
          <Routes >
            <Route index path="/welcome" element={<Welcome />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/signup" element={<SignUp
              setIsLoggedIn={setIsLoggedIn}
             />} />
            <Route path="/login" element={<Login 
              updateIsAdmin={setIsAdmin}
              setIsLoggedIn={setIsLoggedIn}
              />} 
            />
            <Route path="/addNewRoom" element={<AddNewRoom />} />
            <Route path="/updateRoom" element={<UpdateRoom />} />
            <Route path="/bookingConfirmation" element={<BookingConfirmation />} />
            <Route path="/userHistory" element={<History />} />
            <Route path="/userProfile" element={<UserProfile />} />
          </Routes >
          <LocationAwareFooter />
      </Router>
      
    </>
  );
};

export default App;
