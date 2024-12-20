
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;

// Store your API key securely; avoid exposing it in client-side code.
const API_KEY = ""; // Replace with your actual API key securely.

if (!API_KEY || API_KEY.startsWith("sk-proj")) {
    console.error("API key is missing or invalid. Please provide a valid API key.");
    alert("API key is missing. Ensure you have added your API key securely.");
}

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent =
        className === "outgoing"
            ? `<p>${message}</p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const generateResponse = () => {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }],
        }),
    };

    fetch(API_URL, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const botMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
            const botResponse = createChatLi(botMessage, "incoming");

            // Remove the "Thinking..." message and display the bot's response
            const thinkingMessage = chatbox.querySelector(".chat.incoming:last-child p");
            if (thinkingMessage?.textContent === "Thinking...") {
                thinkingMessage.textContent = botMessage;
            } else {
                chatbox.appendChild(botResponse);
            }

            // Scroll to the latest message
            chatbox.scrollTop = chatbox.scrollHeight;
        })
        .catch((error) => {
            console.error("Error fetching response:", error);
            const errorMessage = createChatLi("Error: Unable to fetch response. Please try again.", "incoming");
            chatbox.appendChild(errorMessage);

            // Scroll to the latest message
            chatbox.scrollTop = chatbox.scrollHeight;
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    // Clear the input field
    chatInput.value = "";

    // Scroll to the latest message
    chatbox.scrollTop = chatbox.scrollHeight;

    // Simulate bot's "Thinking..." message and generate a response
    setTimeout(() => {
        chatbox.appendChild(createChatLi("Thinking...", "incoming"));
        chatbox.scrollTop = chatbox.scrollHeight;
        generateResponse();
    }, 600);
};

// Attach the event listener for the send button
sendChatBtn.addEventListener("click", handleChat);

// Optional: Add 'Enter' key functionality for sending messages
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleChat();
    }
});
