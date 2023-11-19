const chatInput = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector(".delete-btn");
const themeButton = document.querySelector(".theme-btn");


const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("themeColor");
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerHTML = document.body.classList.contains("light-mode")
        ? `<img src="static/assets/night.png" alt="Dark Mode" width="30px" height="30px" >`
        : `<img src="static/assets/sun.png" alt="Light Mode" width="30px" height="30px" >`;

    const defaultText = `<div class="default-text">
                                <h1>Shift</h1>
                                <h3>Explore the world of Fashion.</h3>
                            </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
};

const handleOutgoingChat = async () => {
    let UserText = chatInput.value.trim();
    if (!UserText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="static/assets/user.png" alt="user-img">
                            <p>${UserText}</p>
                        </div>
                    </div>`;

    const outChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    await request(UserText);
    setTimeout(showTypingAnimation, 500);
};

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="static/assets/designer.png" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                </div>`;
    const inChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(inChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(response1(inChatDiv), 1000);
};

deleteButton.addEventListener("click", () => {
    localStorage.removeItem("all-chats");
    loadDataFromLocalStorage();
});


themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerHTML = document.body.classList.contains("light-mode")
        ? `<img src="static/assets/night.png" alt="Dark Mode" width="30px" height="30px" >`
        : `<img src="static/assets/sun.png" alt="Light Mode" width="30px" height="30px" >`;
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalStorage();
sendButton.addEventListener("click", handleOutgoingChat);

function generateImages(textPrompt, inChatDiv) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/generate_images", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data=xhr.responseText;
            var jsonResponse = JSON.parse(data);
            imageviewer(inChatDiv,jsonResponse["image_filenames"][0],jsonResponse["image_filenames"][1],jsonResponse["image_filenames"][2]);
        } else {
            alert("Error generating images. Please try again.");
        }
    };
    xhr.send(JSON.stringify({ textPrompt: textPrompt }));
}

const imageviewer = (inChatDiv,a,b,c) => {
    if(a && b && c) {
        let html = `<div class="images">
        <img src="${a}" class="thumbnail" alt="img1">
        <img src="${b}" class="thumbnail" alt="img2">
        <img src="${c}" class="thumbnail" alt="img3">
    </div>`
    const imagediv = createChatElement(html, "imagesdiv");
    inChatDiv.querySelector(".chat-details").appendChild(imagediv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    } else {
        console.log('Image error')
    }
}






















let databrowser = "";
const request = async (prompt) => {
    const payload = {
        prompt: {
            text: `"Vertex AI Vision, analyze ${prompt} and extract essential parameters for generating high-quality, full-size fashion images. Prioritize details relevant to dress generation, avoiding unrelated text. Provide the model with instructions to focus on quick and effective dress generation while maintaining image quality. The goal is to advise the user on what to wear based on the extracted parameters."

`
        }
    };
    // Define the URL for the Google Cloud Language API
    const url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyC2dDolrqQlA22XwgGMKvUmZrxKaMlAjRM";
    // Make the POST request
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => response.json())
        .then(data => {
            databrowser = data.candidates[0].output;
            console.log("databrowser", databrowser);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

const response1 = (inChatDiv) => {
    try {
        console.log(databrowser);
        inChatDiv.querySelector(".typing-animation").remove();
        const message = databrowser;
        const messageElement = document.createElement("p");
        messageElement.textContent = message;
        inChatDiv.querySelector(".chat-details").appendChild(messageElement);
        generateImages(message, inChatDiv);
    }
    catch (error) {
        inChatDiv.querySelector(".typing-animation").remove();
        const errorMessage = "Sorry, I can't assist you with this.";
        const errorElement = document.createElement("p");
        errorElement.textContent = errorMessage;
        inChatDiv.querySelector(".chat-details").appendChild(errorElement);
        console.log(error);
    }
};
