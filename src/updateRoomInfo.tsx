import React, { useEffect, useState } from "react";
import { Request } from "./api";
import "./App.css";
import toast from "react-hot-toast";
import { Room } from "@prisma/client";
import { userToken } from "./App";

interface roomInfo {
  roomToUpdate: Room | null;
  onClose: () => void;
}

export const UpdateRoomInfo: React.FC<roomInfo> = ({ roomToUpdate, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const roomId = roomToUpdate?.id;
  const [type, setType] = useState<string>(roomToUpdate?.type || "");
  const [description, setDescription] = useState<string>(
    roomToUpdate?.description || ""
  );
  const [image, setImage] = useState<string>(roomToUpdate?.image || "");
  const [price, setPrice] = useState<number>(roomToUpdate?.price || 0);
  const [capacity, setCapacity] = useState<number>(roomToUpdate?.capacity || 0);

  const imageOptions = [
    { label: "Image 1", path: "roomImg1" },
    { label: "Image 2", path: "roomImg2" },
    { label: "Image 3", path: "roomImg3" },
    { label: "Image 4", path: "roomImg4" },
    { label: "Image 5", path: "roomImg5" },
  ];

  useEffect(() => {
    if (roomToUpdate) {
      setType(roomToUpdate.type);
      setDescription(roomToUpdate.description);
      setImage(roomToUpdate.image);
      setPrice(roomToUpdate.price);
      setCapacity(roomToUpdate.capacity);
    } else {
      handleReset();
    }
  }, [roomToUpdate]);

  const handleReset = () => {
    setType("");
    setDescription("");
    setImage("");
    setPrice(0);
    setCapacity(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const roomData = {
      type,
      description,
      image,
      price,
      capacity,
    };

    console.log(userToken)

    if (typeof roomId !== "undefined" && userToken) {
      try {
        await Request.updateRoom(roomId, roomData, userToken);
        toast.success("Room updated successfully");
        window.location.reload();
        handleReset();
      } catch (error) {
        toast.error("Failed to update room");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Invalid room ID");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay-updateRoom">
        <div className="modal-container-updateRoom">
          <div className="modal-header">
                  <h3 onClick={onClose}>✕</h3>
              </div>
          <h2>Update room</h2>
          <form onSubmit={handleSubmit} className="formContainer">
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="inputField"
            >
              <option value="">Select Room Type</option>
              <option value="Twin Room">Twin Room</option>
              <option value="Queen Room">Queen Room</option>
              <option value="Triple Room">Triple Room</option>
              <option value="Standard Room">Standard Room</option>
              <option value="Studio">Studio</option>
            </select>

            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
              className="textAreaField"
            />

            <select
              onChange={(e) => setImage(e.target.value)}
              value={image}
              className="inputField"
            >
              <option value={image}>Select an Image</option>
              {imageOptions.map((option, index) => (
                <option key={index} value={option.path}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              name="capacity"
              value={capacity}
              onChange={(e) =>
                setCapacity(e.target.value ? Number(e.target.value) : 0)
              }
              className="inputField"
            >
              <option value="">Select people</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <input
              name="price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value ? Number(e.target.value) : 0)
              }
              placeholder="Price"
              className="inputField"
            />

            <button type="submit" className="submitButton" disabled={isLoading}>
              Update Room
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateRoomInfo;
