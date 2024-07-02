const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json()); // Parse JSON bodies

app.get('/', (req, res) => {
    res.json({ message: "first page" });
});

// API endpoint to receive data and forward it via Socket.IO
app.post('/sendUserData', async (req, res) => {
    const data = req.body;

    console.log("Received user data via POST:", data);
    io.emit('sendUserData', data);
    res.send("Data received and emitted");
    // try {
    //     const response = await axios.post('https://api.gamedeveloper.com/userData', data, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });

    //     console.log('Response from game developer API:', response.data);

    //     res.json({ status: 'success', message: 'Data forwarded successfully.', apiResponse: response.data });
    // } catch (error) {
    //     console.error('Error sending data to game developer API:', error);
    //     res.status(500).json({ status: 'error', message: 'Failed to forward data.', error: error.message });
    // }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });

    // Additional Socket.IO event handlers can be added here
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server listening on port ${PORT}`);
});
