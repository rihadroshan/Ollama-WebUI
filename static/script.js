let shouldAutoScroll = true;

function throttle(func, limit) {
    let lastCall = 0;
    return function (...args) {
        const now = performance.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function setupScrollObserver() {
    const chatContainer = document.getElementById("chat-container");
    const sentinel = document.createElement("div");
    sentinel.classList.add("sentinel");
    sentinel.style.height = "1px";
    
    const observer = new IntersectionObserver(
        ([entry]) => {
            shouldAutoScroll = entry.isIntersecting;
        },
        {
            root: chatContainer,
            threshold: 0.1
        }
    );

    chatContainer.appendChild(sentinel);
    observer.observe(sentinel);
}

function scrollToBottom(smooth = true) {
    const chatContainer = document.getElementById("chat-container");
    requestAnimationFrame(() => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: smooth ? "smooth" : "instant"
        });
    });
}

function isNearBottom() {
    const chatContainer = document.getElementById("chat-container");
    return chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
}

function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 250)}px`;
}

async function fetchBotResponse(userInput) {
    try {
        const response = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userInput })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        return data.response || "I'm not sure how to respond to that.";
    } catch (error) {
        console.error("Error fetching bot response:", error);
        return "Internal Server Error! Try again later.";
    }
}

function typeBotMessage(botResponse) {
    const chatContainer = document.getElementById("chat-container");
    
    const botMessageContainer = document.createElement("div");
    botMessageContainer.className = "message-container bot-message-container";
    
    const messageGroup = document.createElement("div");
    messageGroup.className = "message-group";
    
    const botAvatar = document.createElement("div");
    botAvatar.className = "bot-avatar";
    botAvatar.innerHTML = "🤖";
    
    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "message bot-message";
    
    messageGroup.appendChild(botAvatar);
    messageGroup.appendChild(botMessageDiv);
    botMessageContainer.appendChild(messageGroup);
    chatContainer.appendChild(botMessageContainer);
    
    let index = 0;
    function typeNextCharacter() {
        if (index < botResponse.length) {
            botMessageDiv.innerHTML += botResponse.charAt(index);
            index++;
            setTimeout(typeNextCharacter, 20);
        }
        scrollToBottom();
    }
    typeNextCharacter();
}

async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    const chatContainer = document.getElementById("chat-container");
    const inputField = document.getElementById("user-input");

    const userMessageContainer = document.createElement("div");
    userMessageContainer.className = "message-container user-message-container";

    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "message user-message";
    userMessageDiv.textContent = userInput;

    userMessageContainer.appendChild(userMessageDiv);
    chatContainer.appendChild(userMessageContainer);

    inputField.value = "";
    inputField.style.height = "auto";
    scrollToBottom();

    const botResponse = await fetchBotResponse(userInput);
    typeBotMessage(botResponse);
}

document.addEventListener("DOMContentLoaded", () => {
    setupScrollObserver();

    const textarea = document.getElementById("user-input");
    
    textarea.addEventListener("input", function () {
        autoResize(this);
    });

    textarea.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    const chatContainer = document.getElementById("chat-container");
    chatContainer.addEventListener(
        "DOMNodeInserted",
        throttle(() => {
            if (isNearBottom()) {
                scrollToBottom();
            }
        }, 100)
    );
});
