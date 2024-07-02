const axios = require('axios');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Middleware to parse JSON bodies
app.use(express.json());
app.get('/', (req, res) => {
res.json('firtpage');
})
// Define your route to handle POST requests
app.post('/sendUserData', async (req, res) => {
    const data = req.body;
    const { id } = data; // Assuming the ID is part of the incoming data

    // Emit the ID via Socket.IO to fetch user information
    io.emit('fetchUserData', id);

    res.send("ID sent to fetch user data via Socket.IO");
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle the event to fetch user data based on ID
    socket.on('fetchUserDataResponse', async (userData) => {
        console.log('Received user data via Socket.IO:', userData);

        try {
            // Forward userData to the game developer API using Axios
            const response = await axios.post('https://api.gamedeveloper.com/userData', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response from game developer API:', response.data);

            // Respond to the client with the API response
            res.json({ status: 'success', message: 'Data forwarded successfully.', apiResponse: response.data });
        } catch (error) {
            console.error('Error sending data to game developer API:', error);
            res.status(500).json({ status: 'error', message: 'Failed to forward data.', error: error.message });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = 9000;
http.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
