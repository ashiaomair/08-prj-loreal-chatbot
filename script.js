/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message with proper styling
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! How can I help you with L'Oréal products today?</div>`;

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user message
  const message = userInput.value.trim();
  if (!message) return;

  // Display user message with proper styling
  chatWindow.innerHTML += `<div class="msg user">${message}</div>`;

  // Clear input and auto-scroll
  userInput.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch(
      "https://project8chatbot.axo265.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o", // Updated to use gpt-4o as per instructions
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant who only answers questions about L'Oréal products and beauty routines.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // Display bot reply with proper styling
    chatWindow.innerHTML += `<div class="msg ai">${botReply}</div>`;

    // Auto-scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    // Display error message with proper styling
    chatWindow.innerHTML += `<div class="msg ai">❌ Sorry, there was an error connecting to the chatbot. Please try again.</div>`;
    console.error("Chatbot error:", error);

    // Auto-scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
