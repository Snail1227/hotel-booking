import React from 'react';
import { imageMap } from "./booking";
import { Room } from "./updateRoom";

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  onUpdate: (room: Room) => void;
  onRemove: (roomId: number) => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose, onUpdate, onRemove }) => {
    if (!room) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-container">
            <div className="modal-header">
                <h3 onClick={onClose}>✕</h3>
            </div>
            <div className="modal-content">
                <h2>{room.type}</h2>
                <img src={imageMap[room.image]} alt={room.type} />
                <p>Capacity: {room.capacity}</p>
                <p>Price: ${room.price}</p>
                <p>{room.description}</p>
                <div className="modal-actions">
                    <div className="button-wrapper">
                        <button className='updateBtn' onClick={() => onUpdate(room)}>Update</button>
                    </div>
                    <div className="button-wrapper">
                        <button className='removeBtn' onClick={() => onRemove(room.id)}>Remove</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
};

export default RoomDetailsModal;
