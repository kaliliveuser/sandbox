(function() {
    // Embedding code: <script src="chatbot.js"></script>

    // 1. CONFIGURATION
    const API_KEY = "YOUR_OPENAI_API_KEY";
    const SYSTEM_MESSAGE = `You are a helpful assistant.`;

    const CHATBOT_NAME = "My Chatbot";
    const CHAT_BUTTON_COLOR = "#00aaff";
    const CHAT_HEADER_COLOR = "#00aaff";
    const disclaimerText = 'You are interacting with an AI Chatbot. The information provided here is for general informational purposes only and is not a substitute for professional advice. We do not guarantee the accuracy or completeness of the information provided. Any reliance you place on such information is strictly at your own risk. We are not liable for any losses or damages arising from your use of this chatbot. For specific advice, please consult with a qualified professional. All conversations may be recorded to improve our services. By using this chatbot, you agree to these terms. AI inference graciously provided by pollinations.ai';

    // 2. CREATE AND INJECT CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }

        #chatbot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: ${CHAT_BUTTON_COLOR};
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-size: 28px;
            transition: transform 0.2s;
        }
        #chatbot-button:hover {
            transform: scale(1.1);
        }

        #chatbot-popup {
            display: none;
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            border: 1px solid #ccc;
            //border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            /* overflow: hidden; <--- THIS LINE IS REMOVED */
            background-color: white;
            z-index: 1001; 
        }

        #chatbot-header {
            background-color: ${CHAT_HEADER_COLOR};
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            position: relative; 
        }

        #chatbot-messages {
            flex-grow: 1;
            padding: 10px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            background-color: #f9f9f9;
        }

        .chatbot-message {
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 18px;
            max-width: 85%;
            word-wrap: break-word;
        }

        .user-message {
            background-color: #007bff;
            color: white;
            align-self: flex-end;
        }

        .assistant-message {
            background-color: #e9e9eb;
            color: black;
            align-self: flex-start;
            white-space: pre-wrap; /* Crucial for rendering newlines and formatting */
        }

        #chatbot-input-container {
            display: flex;
            padding: 10px;
            border-top: 1px solid #ccc;
            background-color: #fff;
        }

        #chatbot-input {
            flex-grow: 1;
            border: 1px solid #ccc;
            border-radius: 20px;
            padding: 10px;
            margin-right: 10px;
        }
        #chatbot-input:disabled {
            background-color: #f1f1f1;
        }

        #chatbot-send {
            background-color: ${CHAT_BUTTON_COLOR};
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 15px;
            cursor: pointer;
        }
        #chatbot-send:disabled {
            background-color: #a0a0a0;
        }
        
        #chatbot-exit {
            display: none; /* Hidden by default */
            background-color: #ff4d4d;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 15px;
            cursor: pointer;
            margin-left: 10px;
        }

        .thinking-indicator {
            display: flex;
            align-items: center;
            padding: 8px 12px;
        }

        .thinking-indicator span {
            height: 8px;
            width: 8px;
            margin: 0 2px;
            background-color: #aaa;
            border-radius: 50%;
            display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .thinking-indicator .dot1 { animation-delay: -0.32s; }
        .thinking-indicator .dot2 { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); } 
            40% { transform: scale(1.0); }
        }
        
                /* --- Tooltip CSS (Positioning Corrected) --- */
        .tooltip-container {
            position: relative;
            display: inline-block;
        }
        .tooltip-icon {
            font-family: 'Georgia', serif;
            font-style: italic;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            border: 1px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 20px;
        }
        .tooltip-text {
            visibility: hidden;
            width: 280px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 8px;
            position: absolute;
            z-index: 1002;
            top: 120%;
            /* --- MODIFIED --- */
            right: 0; /* Align to the right of the container */
            /* transform: translateX(50%); <-- REMOVED */
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 12px;
            font-weight: normal;
        }
        .tooltip-text::after {
            content: "";
            position: absolute;
            bottom: 100%;
            /* --- MODIFIED --- */
            right: 8px; /* Position arrow on the right side */
            /* left: 50%; <-- REMOVED */
            /* margin-left: -5px; <-- REMOVED */
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent #555 transparent;
        }
        .tooltip-container:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        
        /* --- Mobile Responsive Styles --- */
        @media (max-width: 600px) {
            #chatbot-popup {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
                border: none;
                box-shadow: none;
            }

            #chatbot-container {
                bottom: 15px;
                right: 15px;
            }

            #chatbot-button {
                width: 55px;
                height: 55px;
            }

             /* Make header elements relatively positioned to the header itself */
            #chatbot-header {
                position: relative;
            }

            /* Adjust tooltip positioning for mobile */
            .tooltip-container {
                position: absolute;
                top: 50%;
                right: 15px;
                transform: translateY(-50%);
            }
            
            #chatbot-header {
                position: relative;
            }

            .tooltip-container {
                position: absolute;
                top: 50%;
                right: 15px;
                transform: translateY(-50%);
            }

            /* --- ADD THESE STYLES BELOW --- */

            .tooltip-text {
                /* Position the tooltip below the icon */
                top: 120%; 
                bottom: auto; /* Unset the bottom property to avoid conflicts */
            }

            .tooltip-text::after {
                /* Flip the arrow to point upwards */
                bottom: 100%;
                top: auto; /* Unset the top property to avoid conflicts */
                border-color: transparent transparent #555 transparent;
            }
            
            #chatbot-exit {
                display: inline-block; /* Show the exit button on mobile */
            }
        }
    `;
    document.head.appendChild(style);

    // 3. CREATE HTML ELEMENTS
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    const chatbotIcon = '<span>&#128172;</span>';
    const closeIcon = '<span>&times;</span>';

    const chatbotButton = document.createElement('div');
    chatbotButton.id = 'chatbot-button';
    chatbotButton.innerHTML = chatbotIcon;

    const chatbotPopup = document.createElement('div');
    chatbotPopup.id = 'chatbot-popup';
    chatbotPopup.style.display = 'none';

    chatbotPopup.innerHTML = `
        <div id="chatbot-header">${CHATBOT_NAME}
            <div class="tooltip-container">
                <span class="tooltip-icon">i</span>
                <div class="tooltip-text">${disclaimerText}</div>
            </div>
        </div>
        <div id="chatbot-messages"></div>
        <div id="chatbot-input-container">
            <input type="text" id="chatbot-input" placeholder="Type a message...">
            <button id="chatbot-send">Send</button>
            <button id="chatbot-exit">Exit</button>
        </div>
    `;

    chatbotContainer.appendChild(chatbotButton);
    document.body.appendChild(chatbotPopup); // Append popup separately to avoid z-index issues
    document.body.appendChild(chatbotContainer);

    // 4. CHATBOT FUNCTIONALITY
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotExit = document.getElementById('chatbot-exit');
    let conversationHistory = [{ role: "system", content: SYSTEM_MESSAGE }];

    const toggleChatbot = () => {
        if (chatbotPopup.style.display === 'none') {
            chatbotPopup.style.display = 'flex';
            chatbotButton.innerHTML = closeIcon;
        } else {
            chatbotPopup.style.display = 'none';
            chatbotButton.innerHTML = chatbotIcon;
        }
    };

    const addMessage = (role, content) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', `${role}-message`);
        messageElement.textContent = content;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return messageElement;
    };

    const showThinkingIndicator = () => {
        const thinkingElement = document.createElement('div');
        thinkingElement.classList.add('chatbot-message', 'assistant-message', 'thinking-indicator');
        thinkingElement.innerHTML = `<span class="dot1"></span><span class="dot2"></span><span class="dot3"></span>`;
        chatbotMessages.appendChild(thinkingElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return thinkingElement;
    };

    const sendMessage = async () => {
        const userInput = chatbotInput.value.trim();
        if (userInput === '') return;

        addMessage('user', userInput);
        conversationHistory.push({ role: "user", content: userInput });
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        chatbotSend.disabled = true;

        const thinkingIndicator = showThinkingIndicator();

        try {
            const response = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
                body: JSON.stringify({ model: 'openai', messages: conversationHistory, stream: true })
            });

            chatbotMessages.removeChild(thinkingIndicator);

            if (!response.ok) {
                const errorData = await response.json();
                addMessage('assistant', `Error: ${errorData.error.message}`);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let assistantMessageElement = null;
            let assistantResponse = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                let boundary = buffer.indexOf('\n');

                while (boundary !== -1) {
                    let line = buffer.substring(0, boundary).trim();
                    buffer = buffer.substring(boundary + 1);

                    if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();
                        if (data === '[DONE]') {
                            console.log('done');
                            break;
                        }
                        if (data.includes("---")) {
                            console.log('ad');
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                assistantResponse += content;
                                if (!assistantMessageElement) {
                                    assistantMessageElement = addMessage('assistant', '');
                                }
                                assistantMessageElement.textContent = assistantResponse;
                                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                            }
                        } catch (error) {
                            console.error('Could not parse JSON from stream:', data, error);
                        }
                    }
                    boundary = buffer.indexOf('\n');
                }
            }
            if (assistantResponse) {
                conversationHistory.push({ role: "assistant", content: assistantResponse });
            }

        } catch (error) {
            if (thinkingIndicator && chatbotMessages.contains(thinkingIndicator)) {
                chatbotMessages.removeChild(thinkingIndicator);
            }
            addMessage('assistant', 'Sorry, something went wrong. Please check the console for details.');
            console.error('Error fetching chat completion:', error);
        } finally {
            chatbotInput.disabled = false;
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }
    };

    chatbotButton.addEventListener('click', toggleChatbot);
    chatbotSend.addEventListener('click', sendMessage);
    chatbotExit.addEventListener('click', toggleChatbot);
    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
})();
