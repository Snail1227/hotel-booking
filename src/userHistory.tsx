import React, { useEffect, useState } from "react";
import { Request } from "./api";
import toast from "react-hot-toast";
import { userToken } from "./App";

interface BookingHistoryProp {
  id: number;
  room: {
    type: string;
  };
  status: string;
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
}

const History = () => {
  const [bookings, setBookings] = useState<BookingHistoryProp[]>([]);

  useEffect(() => {

    const updateBookingStatus = async () => {
      if (userToken) {
        try {
          await Request.updateBooking(userToken);
        } catch (err) {
          toast.error("Error fetching bookings updates" + err);
        }
      } else {
        toast.error("Please log in to your account.");
      }
    };

    const fetchHistory = async () => {
      if (userToken) {
        try {
          const bookings = await Request.userHistory(userToken);

          setBookings(bookings);
        } catch (err) {
          toast.error("Error fetching bookings history");
        }
      } else {
        toast.error("Please log in to your account.");
      }
    };

    updateBookingStatus();
    fetchHistory();
  }, []);

  const handleCancelBooking = async (bookingId: number) => {
    if (!userToken) {
      toast.error("You need to log in to cancel a booking.");
      return;
    }

    try {
      await Request.deleteBooking({ userToken, bookingId });
      toast.success("Booking cancelled successfully.");
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking.");
    }
  };

  return (
    <div className="contentBookingHistory">
      <div className="booking-history">
        <h2>Booking History</h2>

        <div className="booking-table">
          <div className="booking-history-table-header">
            <div className="booking-header-item">Room Type</div>
            <div className="booking-header-item">Check-in</div>
            <div className="booking-header-item">Check-out</div>
            <div className="booking-header-item">Price</div>
            <div>Change</div>
          </div>
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-history-table-row">
              <div className="booking-header-item">{booking.room.type}</div>
              <div className="booking-header-item">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </div>
              <div className="booking-header-item">
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </div>
              <div className="booking-header-item">${booking.totalPrice}</div>
              {booking.status !== "Processed" ? (
                <button
                  className="booking-cancel-btn"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancel
                </button>
              ) : (
                <p>Processed</p>
              )}
            </div>
          ))}
          </div>
      </div>
    </div>
  );
};

export default History;
