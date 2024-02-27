import React, { useEffect, useState } from 'react';
import { Request } from './api';
import { imageMap } from './booking';
import RoomDetailsModal from './RoomDetailsModal';
import UpdateRoomInfo from './updateRoomInfo';
import { userToken } from './App';
import toast from 'react-hot-toast';

export type Room = {
    id: number;
    type: string;
    image: string;
    price: number;
    description: string;
    capacity: number;
};

const UpdateRoom: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); 
    const [roomToUpdate, setRoomToUpdate] = useState<Room | null>(null);


    const handleTouchStart = (e: any) => {
        e.currentTarget.classList.toggle('hover');
    };

    const handleBookingConfirmation = (room: Room) => {
        setSelectedRoom(room);
      };

    const handleCloseModal = () => {
        setRoomToUpdate(null);
        setSelectedRoom(null);
      };

      const handleUpdateRoom = (room: Room) => {
        setRoomToUpdate(room)
      };
    
      const handleRemoveRoom = (roomId: number) => {
        if (userToken) {
            try {
                Request.deleteRoom(userToken, roomId);
                toast.success("Room successfully deleted");
                window.location.reload();
                handleCloseModal();
            } catch (error) {
                console.error("Error deleting room:", error);
                toast.error("Failed to delete room");
            }
        } else {
            toast.error("Please Login to account");
        }
      };

    useEffect(() => {

        Request.getRooms()
        .then(fetchedRooms => {
            setRooms(fetchedRooms);
        }).catch(error => {
            console.error('Error fetching rooms:', error); 
        });

    }, []);

    return (
        <div className="contentUpdateRoom">
            <div className="wrapper">
                <div className="cols">
                {rooms.map(room => (
                        <div key={room.id} className="col-update" onTouchStart={handleTouchStart}>
                            <div className="container" onClick={() => {handleBookingConfirmation(room)}}>
                                <div className="front"  style={{ backgroundImage: `url(${imageMap[room.image]}` }}>
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
            {!roomToUpdate && <RoomDetailsModal 
                    room={selectedRoom}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateRoom}
                    onRemove={handleRemoveRoom}
                />}

            {roomToUpdate && <UpdateRoomInfo
                    roomToUpdate={roomToUpdate}
                    onClose={handleCloseModal}
             />}
        </div>
    )
}

export default UpdateRoom;