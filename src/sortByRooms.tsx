import React from "react";

interface SortByRoomsProps {
    onSortChange: (sortOption: string) => void;
}

const SortByRooms: React.FC<SortByRoomsProps> = ({ onSortChange }) => {

    const handleSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(event.target.value);
    };
    return (
        <div className="select-dropdown-container">
            <select 
                className="select-dropdown"
                onChange={handleSelected}
            >
                <option value="">Select sort by</option>
                <option value="price-higher-to-lower">Price higher to lower</option>
                <option value="price-lower-to-higher">Price lower to higher</option>
                <option value="capacity-higher-to-lower">People allowed higher to lower</option>
                <option value="capacity-lower-to-higher">People allowed lower to higher</option>
                <option value="room-type">Type of rooms</option>
            </select>
        </div>
    )
}

export default SortByRooms
