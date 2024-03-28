import React, { useEffect, useMemo, useState } from "react";
import { Request } from "./api";
import SortByRooms from "./sortByRooms";
import DatePicker, { DateRange } from "./Calendar";
import roomImg1 from "./roomImg/room-1.jpg";
import roomImg2 from "./roomImg/room-2.webp";
import roomImg3 from "./roomImg/room-3.webp";
import roomImg4 from "./roomImg/room-4.webp";
import roomImg5 from "./roomImg/room-5.webp";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Room = {
  id: string;
  type: string;
  image: string;
  price: number;
  description: string;
  capacity: number;
};

export const imageMap: { [key: string]: string | undefined } = {
  roomImg1: roomImg1,
  roomImg2: roomImg2,
  roomImg3: roomImg3,
  roomImg4: roomImg4,
  roomImg5: roomImg5,
};

export function Booking() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rangeData, setRangeData] = useState<DateRange | null>(null);
  const [totalDays, setTotalDays] = useState<number>(0);

  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleRangeDate = (data: DateRange) => {
    setRangeData(data);
    if (data.checkOutDate) {
      setIsOpen(false);
    }
  };

  const handleTouchStart = (e: any) => {
    e.currentTarget.classList.toggle("hover");
  };

  useEffect(() => {
    Request.getRooms()
      .then((fetchedRooms) => {
        setRooms(fetchedRooms);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, []);

  const sortedRooms = useMemo(() => {
    return rooms.sort((a, b) => {
      switch (sortOption) {
        case "price-higher-to-lower":
          return b.price - a.price;
        case "price-lower-to-higher":
          return a.price - b.price;
        case "capacity-higher-to-lower":
          return b.capacity - a.capacity;
        case "capacity-lower-to-higher":
          return a.capacity - b.capacity;
        case "room-type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [rooms, sortOption]);

  const handleBookingConfirmation = (room: any) => {
    if (!!rangeData?.checkInDate) {
      if (rangeData?.checkOutDate) {
        const roomsDetails = {
          roomId: room.id,
          type: room.type,
          capacity: room.capacity,
          price: room.price,
          description: room.description,
          totalDays: totalDays,
          ...rangeData,
        };
        navigate("/bookingConfirmation", {
          state: {
            bookingDetails: roomsDetails,
            totalDays: totalDays,
          },
        });
      } else {
        toast.error("Please choose check out date");
      }
    } else {
      toast.error("Please choose check in date");
    }
  };
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="bookingContent">
      <h1 className="booking-header">Booking</h1>

      <div className="center-container">
        <SortByRooms onSortChange={handleSortChange} />
        <div className="calendar-area">
          <h2 onClick={toggleDatePicker} style={{ cursor: "pointer" }}>
            Select Dates
          </h2>
          {rangeData?.checkOutDate && (
            <div className="show-dateRange">
              <p>
                {rangeData?.checkInDate
                  ? rangeData.checkInDate.toLocaleDateString()
                  : ""}
              </p>
              <p>{rangeData?.checkOutDate ? "to" : ""}</p>
              <p>
                {rangeData?.checkOutDate
                  ? rangeData.checkOutDate.toLocaleDateString()
                  : ""}
              </p>
            </div>
          )}
          <div className={`date-picker-container ${!isOpen ? "" : "open"}`}>
            <DatePicker
              bookingData={handleRangeDate}
              setTotalDays={(days) => setTotalDays(days)}
            />
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="cols">
          {sortedRooms.map((room) => (
            <div
              key={room.id + sortOption}
              className="col"
              onTouchStart={handleTouchStart}
            >
              <div
                className="container"
                onClick={() => {
                  handleBookingConfirmation(room);
                }}
              >
                <div
                  className="front"
                  style={{ backgroundImage: `url(${imageMap[room.image]})` }}
                >
                  <div className="inner">
                    <p>{room.type}</p>
                    <p>{room.capacity}</p>
                    <span>${room.price}</span>
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <p>{room.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
