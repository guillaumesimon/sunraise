'use client'

// Import necessary hooks and components
import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'

export default function Chat() {
  // useChat hook manages the chat state and provides necessary functions
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  
  // Create a ref to the last message element for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Use useEffect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages]) // This effect runs every time the messages array changes

  return (
    // Main container for the chat interface
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Map through messages and render each one */}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* Message bubble */}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
              m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {/* Empty div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form for sending messages */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-4 items-center">
          {/* Text input field */}
          <input
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Type a message..."
            onChange={handleInputChange}
          />
          {/* Send button */}
          <button 
            type="submit" 
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* SVG icon for send button */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
