// Importar las dependencias necesarias
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Importar el módulo 'path' de Node.js

// Crear una aplicación Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar middleware para servir archivos estáticos desde la carpeta 'public'
const publicPath = path.join(__dirname, 'public'); // Ruta absoluta de la carpeta 'public'
app.use(express.static(publicPath));

// Variable para mantener el conteo de personas conectadas
let connectedUsers = 0;

// Configurar el manejo de conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Incrementar el contador de personas conectadas
    connectedUsers++;

    // Emitir el nuevo contador de personas conectadas a todos los clientes
    io.emit('updateConnectedClients', connectedUsers);

    let username = ''; // Variable para almacenar el nombre de usuario del cliente

    // Manejar el evento de recepción de mensajes
    socket.on('chat message', (msg) => {
        console.log('Mensaje recibido en el servidor:', msg);
        // Emitir el mensaje recibido a todos los clientes conectados
        io.emit('chat message', { username, message: msg });
    });

    // Manejar el evento de cambio de nombre de usuario
    socket.on('change username', (newUsername) => {
        console.log('Cambiando nombre de usuario:', newUsername);
        username = newUsername;
    });

    // Manejar el evento de desconexión de un cliente
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
        // Decrementar el contador de personas conectadas
        connectedUsers--;
        // Emitir el nuevo contador de personas conectadas a todos los clientes
        io.emit('updateConnectedClients', connectedUsers);
    });
});

// Iniciar el servidor y escuchar en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
