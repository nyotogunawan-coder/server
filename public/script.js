
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.className = sender === "User" ? "text-right mb-2" : "text-left mb-2";
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("User", message);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    appendMessage("Bot", data.reply || "No response");
  } catch (err) {
    appendMessage("Bot", "❌ Error connecting to API");
    console.error(err);
  }
});
