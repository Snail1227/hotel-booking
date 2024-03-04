import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Request } from "./api";
import toast from "react-hot-toast";
import { userToken } from "./App";

type BookingDetails = {
  checkInDate: string;
  checkOutDate: string;
  roomId: number;
  type: string;
  capacity: number;
  price: number;
  description: string;
};

type LocationState = {
  bookingDetails: BookingDetails;
  totalDays: number;
};

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { bookingDetails, totalDays } = state;
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    console.log(userToken);
    if (userToken) {
      const fetchUserName = async () => {
        try {
          const response = await Request.getUserName(userToken!);
          if (response && response.username) {
            setUserName(response.username);
          } else {
            console.error("Username not found in response");
          }
        } catch (error) {
          console.error("Failed to fetch user name:", error);
        }
      };
      fetchUserName();
    } else {
      toast.error("Please Log in.");
    }
  }, [userToken]);

  const formattedCheckInDate = new Date(
    bookingDetails.checkInDate
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedCheckOutDate = new Date(
    bookingDetails.checkOutDate
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const totalPrice = totalDays * bookingDetails.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userToken) {
      Request.createBooking({
        userToken: userToken,
        roomId: bookingDetails.roomId,
        checkIn: bookingDetails.checkInDate,
        checkOut: bookingDetails.checkOutDate,
        totalPrice: totalPrice,
      })
        .then(() => {
          toast.success("Your booking request successfully created");
          setIsConfirmed(true);
        })
        .catch((error) => {
          toast.error(`Error creating the booking request: ${error}`);
        });
    } else {
      toast.error("Please log In.");
    }
  };

  return (
    <div className="containerConfirmed">
      <div className="booking-confirmation">
        <h2>Booking Confirmation</h2>
        {isConfirmed ? (
          <div className="booking-confirmation-thanks">
            <p>Thank you, {userName}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username: </label>
              <span>{userName}</span>
            </div>
            <div>
              <label>Check-in Date: </label>
              <span>{formattedCheckInDate}</span>
            </div>
            <div>
              <label>Check-out Date: </label>
              <span>{formattedCheckOutDate}</span>
            </div>
            <div>
              <label>Room Info: </label>
              <br />
              <br />
              <div className="room-info">
                <div>
                  <label>&nbsp;Type:</label>
                  <p>&nbsp;{bookingDetails.type}</p>
                </div>
                <div>
                  <label>&nbsp;Capacity:</label>
                  <p>&nbsp;{bookingDetails.capacity}</p>
                </div>
                <div>
                  <label>&nbsp;Price per night:</label>
                  <p>&nbsp;${bookingDetails.price}</p>
                </div>
              </div>
              <div>
                <label>Total nights: </label>
                <span>{totalDays}</span>
              </div>
              <div>
                <label>Total price: </label>
                <span>${totalPrice}</span>
              </div>
            </div>

            <button type="submit">Confirm Booking</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;
