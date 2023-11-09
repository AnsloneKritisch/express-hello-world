const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while (!name)

let typingTimeout;

textarea.addEventListener('keydown', () => {
    socket.emit('typing', { user: name, typing: true });
    clearTimeout(typingTimeout); // Clear any existing timeout
});

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    } else {
        socket.emit('typing', { user: name, typing: false });
        setTypingTimeout();
    }
});

function setTypingTimeout() {
    typingTimeout = setTimeout(() => {
        socket.emit('typing', { user: name, typing: false });
    }, 2000); // Adjust the timeout duration as needed (e.g., 2000 milliseconds = 2 seconds)
}

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

// Check if the user tries to navigate back to the main page
window.addEventListener("popstate", function (event) {
    // Redirect the user back to the chat page
    window.location.href = '/chat';
});

// Prevent the user from navigating back using browser history
history.pushState(null, null, document.URL);

socket.on('typing', (data) => {
    let typingMessage = `${data.user} is typing...`;
    document.querySelector('.typing').innerText = data.typing ? typingMessage : '';
    if (data.typing) {
        clearTimeout(typingTimeout); // Clear the timeout if typing is detected
    }
});