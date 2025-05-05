// DOM Elements
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const themeToggle = document.querySelector('.theme-toggle');
const voiceInput = document.querySelector('.voice-input');

// Dummy Order Data
const dummyOrders = [
    { id: "12345", status: "Shipped", deliveryDate: "April 30, 2025", items: ["Laptop", "Mouse", "Keyboard"], trackingNumber: "TRK78901234" },
    { id: "67890", status: "Delivered", deliveryDate: "April 25, 2025", items: ["Smartphone", "Case"], trackingNumber: "TRK56789012" },
    { id: "11223", status: "Pending", deliveryDate: "Not yet processed", items: ["Headphones", "Charger"], trackingNumber: "Not yet assigned" },
    { id: "44556", status: "In Transit", deliveryDate: "May 5, 2025", items: ["Tablet", "Stylus"], trackingNumber: "TRK34567890" },
    { id: "77889", status: "Processing", deliveryDate: "May 10, 2025", items: ["Smartwatch", "Band"], trackingNumber: "Not yet assigned" }
];

// Support FAQs
const supportFAQs = [
    { question: "How can I change my shipping address?", answer: "To change your shipping address, please provide your order ID and the new address. If your order hasn't been shipped yet, we can update it for you." },
    { question: "How do I cancel my order?", answer: "To cancel your order, please provide your order ID. If your order hasn't been shipped yet, we can cancel it and process a refund." },
    { question: "What should I do if my order hasn't arrived?", answer: "If your order hasn't arrived by the expected delivery date, please check the tracking information. If there are issues, contact our support team with your order ID." },
    { question: "How do I request a refund?", answer: "To request a refund, please provide your order ID and reason for the refund. Our team will review your request and get back to you within 24-48 hours." },
    { question: "What are your return policies?", answer: "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Please contact support with your order ID to initiate a return." }
];

// Support Form State
let supportFormState = {
    active: false,
    step: 0,
    data: {
        name: "",
        orderId: "",
        issue: ""
    }
};

// Theme Management
let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Auto-resize textarea
function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
}

// Message Creation
function createMessage(content, isUser = false, isSupportAgent = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} ${isSupportAgent ? 'support-agent' : ''}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : (isSupportAgent ? '<i class="fas fa-headset"></i>' : '<i class="fas fa-robot"></i>');
    
    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = content;
    
    messageContent.appendChild(avatar);
    messageContent.appendChild(text);
    messageDiv.appendChild(messageContent);
    
    return messageDiv;
}

// Add message to chat
function addMessage(content, isUser = false, isSupportAgent = false) {
    const message = createMessage(content, isUser, isSupportAgent);
    chatArea.appendChild(message);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Track Order Function
function trackOrder(orderId) {
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing';
    typingIndicator.innerHTML = '<div class="message-content"><div class="avatar"><i class="fas fa-robot"></i></div><div class="text">Retrieving order status...</div></div>';
    chatArea.appendChild(typingIndicator);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Simulate processing delay
    setTimeout(() => {
        chatArea.removeChild(typingIndicator);
        
        // Find the order in dummy data
        const order = dummyOrders.find(o => o.id === orderId);
        
        if (order) {
            // Format order details
            let orderDetails = `Order #${order.id} Status: ${order.status}\n`;
            
            if (order.status !== "Pending" && order.status !== "Processing") {
                orderDetails += `Estimated Delivery: ${order.deliveryDate}\n`;
                orderDetails += `Tracking Number: ${order.trackingNumber}\n\n`;
            }
            
            orderDetails += `Items: ${order.items.join(", ")}\n\n`;
            
            // Add status-specific message
            if (order.status === "Delivered") {
                orderDetails += "Your order has been delivered. Thank you for shopping with us!";
            } else if (order.status === "Shipped" || order.status === "In Transit") {
                orderDetails += "Your order is on its way! You can track it in real-time using the tracking number above.";
            } else if (order.status === "Processing") {
                orderDetails += "We're currently processing your order. It will be shipped soon.";
            } else if (order.status === "Pending") {
                orderDetails += "Your order is pending. Our team will process it shortly.";
            }
            
            addMessage(orderDetails);
            
            // Add follow-up options
            setTimeout(() => {
                addMessage("Would you like to track another order or contact support?");
            }, 1000);
        } else {
            // Order not found
            addMessage(`Sorry, no order found with ID: ${orderId}. Please check and try again.`);
            
            // Add follow-up options
            setTimeout(() => {
                addMessage("Would you like to try another order ID or contact support?");
            }, 1000);
        }
    }, 2000); // 2-second delay to simulate fetching
}

// Handle Support Form
function handleSupportForm(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for escalation request
    if (lowerMessage === "escalate") {
        supportFormState.active = false;
        addMessage("I'm connecting you to a senior representative. Please wait a moment...", false, true);
        setTimeout(() => {
            addMessage("Hello, I'm Sarah, a senior customer service representative. How can I assist you today?", false, true);
        }, 2000);
        return true;
    }
    
    // Check for FAQ questions
    for (const faq of supportFAQs) {
        if (lowerMessage.includes(faq.question.toLowerCase())) {
            addMessage(faq.answer, false, true);
            return true;
        }
    }
    
    // Handle support form steps
    if (supportFormState.active) {
        if (supportFormState.step === 0) {
            supportFormState.data.name = userMessage;
            supportFormState.step = 1;
            addMessage("Thank you! Please provide your Order ID (if applicable).", false, true);
            return true;
        } else if (supportFormState.step === 1) {
            supportFormState.data.orderId = userMessage;
            supportFormState.step = 2;
            addMessage("Please describe your issue in detail.", false, true);
            return true;
        } else if (supportFormState.step === 2) {
            supportFormState.data.issue = userMessage;
            supportFormState.step = 3;
            
            // Submit form (simulated)
            addMessage("Thank you for submitting your support request!", false, true);
            setTimeout(() => {
                addMessage(`We have received your request with the following details:\n\nName: ${supportFormState.data.name}\nOrder ID: ${supportFormState.data.orderId}\nIssue: ${supportFormState.data.issue}\n\nOur support team will review your request and get back to you within 24-48 hours.`, false, true);
                setTimeout(() => {
                    addMessage("Is there anything else I can help you with?", false, true);
                }, 1000);
            }, 1000);
            
            // Reset form state
            supportFormState.active = false;
            supportFormState.step = 0;
            supportFormState.data = { name: "", orderId: "", issue: "" };
            return true;
        }
    }
    
    // Handle support options
    if (lowerMessage === "email support" || lowerMessage === "email") {
        addMessage("You can reach our support team at support@dummycompany.com. We typically respond within 24-48 hours.", false, true);
        return true;
    } else if (lowerMessage === "call support" || lowerMessage === "call") {
        addMessage("You can call our support team at +1 (555) 123-4567. Our support hours are Monday-Friday, 9 AM to 5 PM EST.", false, true);
        return true;
    } else if (lowerMessage === "support form" || lowerMessage === "form") {
        supportFormState.active = true;
        supportFormState.step = 0;
        addMessage("Please provide your name to start the support form.", false, true);
        return true;
    } else if (lowerMessage === "faq" || lowerMessage === "faqs") {
        let faqList = "Here are some frequently asked questions:\n\n";
        supportFAQs.forEach((faq, index) => {
            faqList += `${index + 1}. ${faq.question}\n`;
        });
        faqList += "\nPlease type the question you're interested in, or type 'back' to return to the main menu.";
        addMessage(faqList, false, true);
        return true;
    } else if (lowerMessage === "back") {
        addMessage("How can we help you today? You can:\n\n1. Email Support\n2. Call Support\n3. Fill out a support form\n4. View FAQs\n\nOr type 'escalate' to speak with a senior representative.", false, true);
        return true;
    }
    
    return false;
}

// Simulate bot response
function simulateBotResponse(userMessage) {
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing';
    typingIndicator.innerHTML = '<div class="message-content"><div class="avatar"><i class="fas fa-robot"></i></div><div class="text">Typing...</div></div>';
    chatArea.appendChild(typingIndicator);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Simulate processing delay
    setTimeout(() => {
        chatArea.removeChild(typingIndicator);
        
        // Check if we're in support mode
        if (supportFormState.active || userMessage.toLowerCase().includes('support') || userMessage.toLowerCase().includes('help')) {
            if (handleSupportForm(userMessage)) {
                return; // Support form or FAQ handled the message
            }
        }
        
        // Enhanced response logic for all button actions
        let response;
        const lowerMessage = userMessage.toLowerCase();
        
        // Check if message contains an order ID (5-digit number)
        const orderIdMatch = userMessage.match(/\b\d{5}\b/);
        if (orderIdMatch) {
            const orderId = orderIdMatch[0];
            trackOrder(orderId);
            return; // Return early as trackOrder will handle the response
        }
        
        // Handle quick action buttons
        if (lowerMessage === "track order") {
            response = "Please enter your 5-digit Order ID to track your package.";
        } else if (lowerMessage === "history") {
            response = "Here are your recent orders:\n\n";
            dummyOrders.forEach(order => {
                response += `Order #${order.id} - ${order.status} (${order.deliveryDate})\n`;
            });
            response += "\nWould you like to track any specific order?";
        } else if (lowerMessage === "address") {
            response = "To change your delivery address, please provide:\n\n1. Your order ID\n2. The new delivery address\n\nI'll help you update it right away.";
        } else if (lowerMessage === "support") {
            response = "How can we help you today? You can:\n\n1. Email Support\n2. Call Support\n3. Fill out a support form\n4. View FAQs\n\nOr type 'escalate' to speak with a senior representative.";
        } 
        // Handle general queries
        else if (lowerMessage.includes('order id')) {
            response = "Your Order ID is a 5-digit number found in your order confirmation email. For example: 12345, 67890, etc.";
        } else if (lowerMessage.includes('track') || lowerMessage.includes('where is my order')) {
            response = "Please enter your 5-digit Order ID to track your package.";
        } else if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
            response = "I can help you with cancellation or refund requests. Please provide your order ID and reason for cancellation.";
        } else if (lowerMessage.includes('delivery time') || lowerMessage.includes('when will it arrive')) {
            response = "Based on your location, standard delivery takes 3-5 business days. Express delivery (if selected) takes 1-2 business days.";
        } else if (lowerMessage.includes('thank')) {
            response = "You're welcome! Is there anything else I can help you with?";
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = "Hello! I'm your order assistant. How can I help you today?";
        } else if (lowerMessage.includes('try another') || lowerMessage.includes('track another')) {
            response = "Please enter your 5-digit Order ID to track your package.";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
            response = "How can we help you today? You can:\n\n1. Email Support\n2. Call Support\n3. Fill out a support form\n4. View FAQs\n\nOr type 'escalate' to speak with a senior representative.";
        } else {
            response = "I'm here to help you track your orders. Please enter your 5-digit Order ID or use the quick action buttons below.";
        }
        
        addMessage(response);
    }, 1000);
}

// Handle user input
function handleUserInput() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        userInput.style.height = 'auto';
        simulateBotResponse(message);
    }
}

// Voice input handling
function setupVoiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            voiceInput.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        };

        recognition.onend = () => {
            voiceInput.innerHTML = '<i class="fas fa-microphone"></i>';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            handleUserInput();
        };

        voiceInput.onclick = () => {
            recognition.start();
        };
    } else {
        voiceInput.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    document.body.setAttribute('data-theme', 'light');
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Input handling
    userInput.addEventListener('input', autoResizeTextarea);
    sendBtn.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });
    
    // Voice input setup
    setupVoiceInput();
    
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.querySelector('span').textContent;
            addMessage(action, true);
            simulateBotResponse(action);
        });
    });
}); 