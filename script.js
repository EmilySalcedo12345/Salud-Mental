const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable para almacenar el mensaje del usuario.
const API_KEY = "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"; // MI API KEY
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Cree un elemento de chat <li> con el mensaje pasado y el nombre de clase
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // retornar chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Definir las propiedades y el mensaje para la solicitud de API.
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`

        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        })
    }

    // Envíe una solicitud POST a la API, obtenga una respuesta y establezca la respuesta como texto de párrafo
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Algo salió mal. Por favor, inténtelo de nuevo.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Obtenemos mensaje ingresado por el usuario y elimine los espacios en blanco adicionales
    if (!userMessage) return;

    // Borre el área de texto de entrada y establezca su altura por defecto
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Agregar el mensaje al chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Mostrar el mensaje "Pensando..." mientras espera la respuesta
        const incomingChatLi = createChatLi("Pensando...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Ajustar la altura del área de texto de entrada según su contenido
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // Si se presiona la tecla Enter sin la tecla Shift y la ventana
    // el ancho es mayor a 800px, maneja el chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));