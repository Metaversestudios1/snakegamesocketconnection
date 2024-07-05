const axios = require('axios');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.json('firstpage');
});


app.post('/fetchUserData', (req, res) => {
    const data = req.body;
    const { id } = data; // Assuming the ID is part of the incoming data
    io.emit('fetchUserData', id);
    res.json(data);
  
});

app.post('/sendUserData', async (req, res) => {
    const data = req.body;
    const { id } = data; 
   io.emit('fetchUserData', id);
    res.json("ID sent to fetch user data via Socket.IO");
    //res.send("ID sent to fetch user data via Socket.IO");
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle the event to fetch user data based on ID
    socket.on('fetchUserData', async (id) => {
        console.log('Fetching user data for ID:', id);

        // Simulate fetching user data (you should replace this with your actual data fetching logic)
        const userData = { id: id, name: 'User ' + id }; // Example user data

        // Emit the fetched user data back to the PHP server
        socket.emit('fetchUserDataResponse', userData);
    });

    socket.on('fetchUserDataResponse', async (userData) => {
        console.log('Received user data via Socket.IO:', userData);

        try {
            // Forward userData to the game developer API using Axios
            //const response = await axios.post('http://localhost/admin_pannel/sendUserData', userData, {
           
            const response = await axios.post('https://snakegameadmin.000webhostapp.com/gameplay', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response from game developer API:', response.data);
        } catch (error) {
            console.error('Error sending data to game developer API:', error);
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
