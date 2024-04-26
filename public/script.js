document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesList = document.getElementById('messages');
    const connectedClientsCount = document.getElementById('connectedClientsCount');

    // Verificar la conexión al servidor
    socket.on('connect', () => {
        console.log('Conexión establecida con el servidor');
    });

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        const username = 'Extraño'; // Nombre predeterminado
        if (message !== '') {
            console.log('Enviando mensaje al servidor:', message);
            // Enviar el mensaje al servidor con el evento 'chat message'
            socket.emit('chat message', { username, message }); // Enviamos tanto el nombre como el mensaje
            messageInput.value = '';
        }
    }

    // Manejar el evento 'chat message' del servidor
    socket.on('chat message', (data) => {
        // Agregar el mensaje recibido a la lista de mensajes del chat
        console.log('Mensaje recibido del servidor:', data);
        const { username, message } = data; // Desestructuramos el objeto para obtener el nombre y el mensaje
        const listItem = document.createElement('li');
        listItem.textContent = `${username}: ${message}`; // Agregamos el nombre al mensaje
        messagesList.appendChild(listItem);
        // Desplazar la lista de mensajes hacia abajo para mostrar el último mensaje
        messagesList.scrollTop = messagesList.scrollHeight;
    });

    // Manejar el evento 'updateConnectedClients' del servidor
    socket.on('updateConnectedUsers', (count) => {
        connectedClientsCount.textContent = `Conectados: ${count}`;
    });
});
