import { useState } from "react";
import { format } from "date-fns";

const sampleMessages = [
    { id: 1, sender: "employer", text: "Hello, how are you today?", time: "2025-02-13T10:00:00" },
    { id: 2, sender: "employee", text: "I'm good, thank you! How can I help?", time: "2025-02-13T10:05:00" },
    { id: 3, sender: "employer", text: "I need an update on the project status.", time: "2025-02-13T10:10:00" },
    { id: 4, sender: "employee", text: "Sure! We are on track to complete by Friday.", time: "2025-02-13T10:15:00" }
];

export default function ChatScreen() {
    const [messages, setMessages] = useState(sampleMessages);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const message = {
            id: messages.length + 1,
            sender: "employee",
            text: newMessage,
            time: new Date().toISOString()
        };
        setMessages([...messages, message]);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white p-4 max-w-2xl mx-auto">
            <div className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "employee" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${msg.sender === "employee" ? "bg-blue-600" : "bg-gray-700"}`}>
                            <p>{msg.text}</p>
                            <span className="text-xs text-gray-300 block mt-1">{format(new Date(msg.time), "hh:mm a")}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-gray-800 flex items-center rounded-lg">
                <input
                    type="text"
                    className="flex-1 p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    className="ml-3 bg-blue-600 px-4 py-2 rounded-lg"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
