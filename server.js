// server-socket.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Configuración de middleware
app.use(cors());
app.use(bodyParser.json());

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.IO y permitir CORS (ajusta el origin según tus necesidades)
const io = socketIo(server, {
    cors: {
        origin: "*", // Permite cualquier origen
        methods: ["GET", "POST"]
    }
});

// Evento de conexión de clientes
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Endpoint para simular la actualización de una tarea
// Se espera recibir: { userId: "123", task: {...} }
app.post('/updateTask', (req, res) => {
    const { userId, task } = req.body;
    console.log(`Actualización para usuario ${userId}`, task);

    // Emite el evento "taskUpdated" a todos los clientes.
    // Si deseas enviar a usuarios específicos, puedes filtrar aquí o usar "rooms"
    io.emit('taskUpdated', { userId, task });

    res.status(200).json({ message: 'Notificación de actualización enviada' });
});

// Inicia el servidor en el puerto 5002 (o el que desees)
const PORT = process.env.PORT || 5002;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Socket.IO corriendo en http://0.0.0.0:${PORT}`);
});