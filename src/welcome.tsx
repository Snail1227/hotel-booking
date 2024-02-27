import React, { useState } from 'react';
import { Link } from "react-router-dom";
import roomImg1 from "./roomImg/room-1.jpg"
import roomImg2 from "./roomImg/room-2.png"
import roomImg3 from "./roomImg/room-3.png"
import roomImg4 from "./roomImg/room-4.png"
import roomImg5 from "./roomImg/room-5.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export function Welcome() {
    const images: string[] = [roomImg1, roomImg2, roomImg3, roomImg4, roomImg5];
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const nextImage = (): void => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    
    const prevImage = (): React.CSSProperties => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        return{
            padding: "2px 10px",
            transition: 'padding 0.5s, opacity 0.5s',
        }
    };

    const getImageStyle = (index: number): React.CSSProperties => {
        const isActive = index === currentImageIndex;
        return {
            
            transform: `
                translate(-50%, -50%) 
                ${isActive ? 'rotate(0deg)' : 'rotate(-3deg) scale(0.8)'}
            `,
            opacity: isActive ? 1 : 0.5, 
            position: 'absolute',
            left: '150px',
            top: '125px',
            transition: 'transform 0.5s, opacity 0.5s', 
            zIndex: isActive ? 100 : 1, 
        };
    };

    const testimonialsData = [
        {
            id: 1,
            text: "This hotel exceeded all my expectations! The booking system was incredibly user-friendly, making my reservation process a breeze. Highly recommend to anyone looking for luxury and ease!",
            author: "Alex Johnson",
        },
        {
            id: 2,
            text: "A seamless experience from start to finish. The customer service was outstanding, and the room was beyond comfortable. I've never had a smoother booking experience!",
            author: "Samantha Lee",
        },
        {
            id: 3,
            text: "From the intuitive booking system to the warm welcome upon arrival, everything was perfect. It's rare to find a hotel that pays such attention to detail. Will be back for sure!",
            author: "Michael Brown",
        },
    ];


    return (
        <>
            <main className="welcomeContent">
            <div className="grid">
                <section>
                    <hgroup>
                        <h2 className='welcome-header'>Welcome to Hotel Paradise</h2>
                        <h3>Experience Luxury and Comfort</h3>
                    </hgroup>
                    <div className='about-hotel-and-rooms'>
                        <div className='room-img'>
                            <div className="grid-img">
                                <div className='room'>
                                    {images.map((src, index) => (
                                        <img 
                                            key={index} 
                                            src={src} 
                                            alt={`Room Type ${index + 1}`} 
                                            style={getImageStyle(index)} 
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className='room-btn'>
                                <FontAwesomeIcon className="arrow-btn left-arrow" onClick={prevImage} icon={faArrowLeft} />
                                <FontAwesomeIcon className="arrow-btn right-arrow" onClick={nextImage} icon={faArrowRight} />
                            </div>
                        </div>
                        <div className='welcome-text'>
                            <h3 id="about">About Our Hotel</h3>
                            <p>In the bustling world of hospitality, our hotel stands out not just for its exceptional service and luxurious accommodations, but also for our revolutionary hotel booking system. 
                                Crafted with precision and user-centric design, our system offers an unrivaled ease of use, ensuring guests can effortlessly reserve their stay within minutes. 
                                The intuitive interface, coupled with real-time availability updates and detailed room descriptions, allows for a seamless planning experience. 
                                Beyond convenience, our system ensures secure transactions, giving peace of mind to travelers from around the globe. It's this dedication to innovation and customer satisfaction that elevates our hotel, making it a premier choice for those seeking a flawless travel experience. 
                                With our state-of-the-art booking system, we promise not just a stay, but a journey of luxury, comfort, and unparalleled ease.</p>
                    
                        </div>
                    </div>
                    <div className="link-container">
                        <Link className="bookingButton" to="/booking">Book Now</Link>
                    </div>
                    <h3 id="reviews">Reviews</h3>
                    <h3>Testimonials</h3>
                    <div className="testimonial-container">
                        {testimonialsData.map((testimonial) => (
                            <div className="testimonial-card" key={testimonial.id}>
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <p className="testimonial-author">- {testimonial.author}</p>
                            </div>
                        ))}
                    </div>      
                    </section>
                </div>
            </main>
        </>
    );
}