document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesList = document.getElementById('messages');
    const connectedClientsCount = document.getElementById('connectedClientsCount');
    const usernameInput = document.getElementById('usernameInput');
    const setUsernameButton = document.getElementById('setUsernameButton');
    const chatContainer = document.getElementById('chat-container');
    const userEntryContainer = document.getElementById('user-entry-container');

    setUsernameButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username !== '') {
            setUsername(username);
        }
    });

    function setUsername(username) {
        socket.emit('change username', username);
        userEntryContainer.style.display = 'none';
        chatContainer.style.display = 'block';
    }

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
        if (message !== '') {
            console.log('Enviando mensaje al servidor:', message);
            socket.emit('chat message', message);
            messageInput.value = '';
        }
    }

    // Manejar el evento 'chat message' del servidor
    socket.on('chat message', (data) => {
        console.log('Mensaje recibido del servidor:', data);
        const listItem = document.createElement('li');
        listItem.textContent = `${data.username}: ${data.message}`;
        messagesList.appendChild(listItem);
        messagesList.scrollTop = messagesList.scrollHeight;
    });

    // Manejar el evento 'updateConnectedClients' del servidor
    socket.on('updateConnectedUsers', (count) => {
        connectedClientsCount.textContent = `Conectados: ${count}`;
    });
});
