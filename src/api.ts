export const baseUrl = "http://localhost:4000";

export interface BookingDelete {
  userToken: string;
  bookingId: number;
}

interface UserParams {
  username?: string;
  email: string;
  password: string;
}

interface Room {
  type: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
}

interface BookingInfo {
  userToken: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}

export const Request = {

  updateRoom: async (roomId: number, roomData: Omit<Room, 'id'>, userToken: string) => {
    return await fetch(`${baseUrl}/updateRoom/${roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
      body: JSON.stringify(roomData),
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    });
  },

  deleteRoom: async (userToken: string, roomId: number) => {
    return await fetch(`${baseUrl}/updateRoom/${roomId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    });
  },

  updateBooking: async (userToken: string) => {
    return await fetch(`${baseUrl}/userHistory`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    });
  },

  deleteBooking: async ({userToken, bookingId}: BookingDelete) => {
    return await fetch(`${baseUrl}/userHistory`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        bookingId: bookingId
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    });
  },

  getUserProfile: async (token: string) => {
    return await fetch(`${baseUrl}/userProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    });
  },

  userHistory: async (token: string) => {
    return await fetch(`${baseUrl}/userHistory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch userName");
      }
      return response.json();
    });
  },

  createUser: async ({ username, email, password }: UserParams) => {
    return await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      return response.json();
    })
  },

  createRoom: async ({ type, description, image, price, capacity}: Room) => {
    return await fetch(`${baseUrl}/addNewRoom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: type,
        description: description,
        image: image,
        price: price,
        capacity: capacity,
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to create room");
      }
      return response.json();
    })
  },

  getUserName: async (userToken: string) => {
    return await fetch(`${baseUrl}/bookingConfirmation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch userName");
      }
      return response.json();
    });
  },

  confirmAdminRole: async (userToken: string) =>{
    return await fetch(`${baseUrl}/adminCenter`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to create booking request");
      }
      return response.json();
    })
  },

  createBooking: async ({userToken, roomId, checkIn, checkOut, totalPrice}: BookingInfo) => {
    return await fetch(`${baseUrl}/bookingConfirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({
        roomId: roomId,
        checkIn: checkIn,
        checkOut: checkOut,
        totalPrice: totalPrice,
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to create booking request");
      }
      return response.json();
    })
  },


  getRooms: async () => {
    return await fetch(`${baseUrl}/booking`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      return response.json();
    });
  },
  

  logInUser: async ({ email, password }: UserParams) => {
    return await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then(data => {
        
        return data;
      });
  },
   
};
