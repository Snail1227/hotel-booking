import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from 'express';
import { z } from "zod";
import cors from 'cors';
import bcrypt from "bcrypt";
import { encryptPassword } from "./encryption";
import { validateBookingDates, verifyToken } from "./middleware";
import { env } from "process";
const jwt = require('jsonwebtoken');

declare namespace Express {
    export interface Request {
      userId?: number;
      body?: string;
    }
  }
  
require('dotenv').config();
// const path = require('path');
const prisma = new PrismaClient();
const app = express();
export const jwtSecret = env.JWT_SECRET;

app.use(express.static('../../public'));

// app.use(express.static(path.join(__dirname, '../../public')));

app.use(express.json());

app.use(cors());
const PORT = 4000;


const userSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
});

const roomSchema = z.object({
    type: z.string(),
    description: z.string(),
    image: z.string(),
    price: z.number(),
    capacity: z.number(),
});

const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});


// app.use(express.static(path.join(__dirname, 'build')));


app.post('/signup', async (req: Request, res: Response) => {
    
    try {
        const { username, email, password } = userSchema.parse(req.body);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            res.status(409).json('Username or Email already exists');
            return;
        }

        const hashedPassword = await encryptPassword(password);

        const defaultRole = "user";
        await prisma.user.create({
            data: { username, email, password: hashedPassword, role: defaultRole }
        });

        res.status(201).json("User created");
    } catch (err) {
        res.status(500).json("An error occurred");
    }
});

app.get('/booking', async(req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany();
        res.status(200).send(rooms);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching the rooms" });
    }
})

app.get('/bookingConfirmation', verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;

    if (typeof userId === 'undefined') {
        
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).send({ username: user.username });

    } catch (err) {
        
        res.status(500).json({ error: "An error occurred while fetching the user" });
    }
});

app.get('/adminCenter', verifyToken, async (req: Request, res: Response) => {

    const userId = req.userId;

    if (typeof userId === 'undefined') {
        return res.status(404).json({ message: "User ID is missing or invalid. Authentication required." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role === 'admin') {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }

    } catch (err) {
        
        res.status(500).json({ error: "An error occurred while fetching the user" });
    }
})

app.post("/addNewRoom", async (req: Request, res: Response) => {
    try {
        const {type, description, image, price, capacity} = roomSchema.parse(req.body);

        await prisma.room.create({
            data: { type, description, image, price, capacity }
        });

        res.status(200).json("Room created");
    }catch (err) {
        res.status(500).json("An error occurred");
    }
});

app.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = userLoginSchema.parse(req.body);

        
        const user = await prisma.user.findUnique({
            where: { email }
        });
        const isAdmin = user?.role === "admin";
        if (user && await bcrypt.compare(password, user.password)) {
            
            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
            res.json({ message: "Login successful", token, role: isAdmin});
        } else {
            
            res.status(401).json("Invalid email or password");
        }
    } catch (err) {
        
        console.error(err);
        res.status(500).json("An error occurred");
    }
});

app.post("/bookingConfirmation", verifyToken, validateBookingDates, async (req: Request, res: Response) => {
    const { roomId, checkIn, checkOut, totalPrice } = req.body;
    const userId = req.userId;

    if (typeof userId === 'undefined') {
        return res.status(404).json({ message: "User ID is missing or invalid. Authentication required." });
    }


    try {
        const booking = await prisma.booking.create({
            data: {
                userId: userId,
                roomId: roomId,
                checkInDate: new Date(checkIn),
                checkOutDate: new Date(checkOut),
                totalPrice: totalPrice,
                status: 'Pending',
            },
        });

        res.json({ message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Failed to create booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/userProfile', verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;

    if (typeof userId === 'undefined') {
        
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).send({ username: user.username, email: user.email });

    } catch (err) {
        
        res.status(500).json({ error: "An error occurred while fetching the user" });
    }
});

app.get('/userHistory', verifyToken, async (req, res) => {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const allBookings = await prisma.booking.findMany({
        where: { userId: req.userId },
        include: { room: true },
      });
      res.json(allBookings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching booking history' });
    }
  });


app.delete("/userHistory", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;
    const bookingId = req.body.bookingId;

    if (typeof userId === 'undefined') {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const booking = await prisma.booking.deleteMany({
            where: {
                id: bookingId,
                userId: userId,
            }
        });

        if (booking.count === 0) {
            return res.status(404).json({ error: "Booking not found or not yours" });
        }

        res.status(200).json({ message: "Booking successfully canceled" });


    } catch (err) {
        
        res.status(500).json({ error: "An error occurred while fetching the user" });
    }
})

app.put('/userHistory', verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;

    if (typeof userId === 'undefined') {
        return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    try {
        const bookingsToUpdate  = await prisma.booking.findMany({
            where: {
                userId: userId,
                status: "Pending",
                checkOutDate: {
                    lt: today
                }
            }
        });


        for (let booking of bookingsToUpdate) {
            await prisma.booking.update({
                where: {
                    id: booking.id
                },
                data: {
                    status: "Processed"
                }
            });
        }

        res.status(200).json({ message: `Updated ${bookingsToUpdate.length} bookings to 'Processed' status.` });


    } catch (err) {
        
        res.status(500).json({ error: "An error occurred while fetching the user" });
    }

})

app.put('/updateRoom/:roomId', verifyToken, async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const roomData = req.body;
    const userId = req.userId;

    if (typeof userId === 'undefined') {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const updatedRoom = await prisma.room.update({
          where: { id: parseInt(roomId, 10) },
          data: roomData,
        });
        res.status(200).json(updatedRoom);
      } catch (error) {
        res.status(500).json({ error: "Failed to update room" });
      }
})

app.delete('/updateRoom/:roomId', verifyToken, async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const userId = req.userId;

    if (typeof userId === 'undefined') {
        return res.status(404).json({ error: "User not found" });
    }
    console.log(roomId);

    try {
        const id = parseInt(roomId, 10);
        await prisma.room.delete({
          where: { 
            id: id 
        },
        });
        res.status(200).json({ message: "Room successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete room" });
    }
});

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../../public', 'index.html'));
//   });
  

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
