import React, { useState } from 'react';
import { Request } from "./api";
import './App.css';
import toast from 'react-hot-toast';


export const AddRoomForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');

  const [price, setPrice] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);

  const imageOptions = [
    { label: "Image 1", path: "roomImg1" },
    { label: "Image 2", path: "roomImg2" },
    { label: "Image 3", path: "roomImg3" },
    { label: "Image 4", path: "roomImg4" },
    { label: "Image 5", path: "roomImg5" },
  ];

  const handleReset = () => {
    setType("");
    setDescription("");
    setImage("");
    setPrice(0);
    setCapacity(0);
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    

    if (type && description && image && price && capacity) {
      Request.createRoom({
        type: type,
        description: description,
        image: image,
        capacity: capacity,
        price: price,
      })
      .then(() => {
        setIsLoading(false);
        toast.success("Room created successfully");
        handleReset();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
    } else {
      setIsLoading(false);
      toast.error("Please fill out form");
    }

  };

  return (
    <>
      <div className="new-room-form" >
        <h2>Add new room</h2>
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
      
      <select onChange={(e) => setImage(e.target.value)} value={image} className="inputField">
        <option value={image}>Select an Image</option>
        {imageOptions.map((option, index) => (
          <option key={index} value={option.path}>{option.label}</option>
        ))}
      </select>

      <select 
        name="capacity" 
        value={capacity}
        onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : 0)} 
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
        onChange={(e) => setPrice(e.target.value  ? Number(e.target.value) : 0)}
        placeholder="Price"
        className="inputField"
      />

      <button 
      type="submit"
      className="submitButton"
      disabled={isLoading}
       >Add Room</button>
    </form>
    </div>
    </>
  );
};

export default AddRoomForm;
