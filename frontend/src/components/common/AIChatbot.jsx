import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { askChatbot } from '@/services/ai'

export default function AIChatbot() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m the SMD School assistant. Ask me anything about admissions, fees, timings, or academics!' }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Trigger the greeting bubble on a loop if they haven't opened the chat
  useEffect(() => {
    if (open) {
      setShowGreeting(false)
      return
    }

    let hideTimer;
    let nextPulseTimer;

    const pulse = () => {
      setShowGreeting(true)
      
      // Hide after 3 seconds
      hideTimer = setTimeout(() => {
        setShowGreeting(false)
      }, 3000)

      // Schedule the next pulse to happen in 15 seconds
      nextPulseTimer = setTimeout(pulse, 15000)
    }

    // Initial delay of 5 seconds
    nextPulseTimer = setTimeout(pulse, 5000)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(nextPulseTimer)
    }
  }, [open])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const reply = await askChatbot(input, messages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble right now. Please call +91-9001995272.' }])
    } finally {
      setLoading(false)
    }
  }

  // Render the chat button based on selected style
  const renderChatButton = () => {
    if (open) {
      return (
        <div className="w-14 h-14 bg-smd-blue rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-900 transition-colors relative z-50">
          <X size={24} className="text-white" />
        </div>
      )
    }

    return (
      <div className="relative w-[64px] h-[64px] cursor-pointer group z-50">
        <div className="absolute inset-0 rounded-full bg-[linear-gradient(150deg,#ffd88a_0%,#ffb74d_45%,#e2932b_100%)] flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform group-hover:scale-105">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 6c-1.6-1-3.6-1.3-5.5-.7v11.4c1.9-.6 3.9-.3 5.5.7z" fill="#3a2410"/>
            <path d="M12 6c1.6-1 3.6-1.3 5.5-.7v11.4c-1.9-.6-3.9-.3-5.5.7z" fill="#1a0f00"/>
            <path d="M12 6v11.4" stroke="#ffe3af" strokeWidth="0.6"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <>
      <div 
        onClick={() => {
          setOpen(!open)
          setShowGreeting(false)
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
      >
        {/* Greeting Bubble */}
        {!open && showGreeting && (
          <div className="absolute bottom-[76px] right-0 bg-white px-3 py-2 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-2 animate-fade-in-up whitespace-nowrap">
            <span className="text-sm">👋</span>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-tight">Need help?</p>
              <p className="text-[10px] text-gray-500 leading-tight mt-[2px]">Ask me anything!</p>
            </div>
            {/* Tooltip Arrow pointing down */}
            <div className="absolute -bottom-[5px] right-[26px] w-2.5 h-2.5 bg-white border-b border-r border-gray-100 rotate-45"></div>
          </div>
        )}
        
        {renderChatButton()}
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-smd-blue text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-smd-gold" />
              <div>
                <p className="font-semibold text-sm">SMD AI Assistant</p>
                <p className="text-xs text-white/70">Ask anything about the school</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-80 text-sm bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-smd-blue text-white rounded-br-none'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-3 py-2 rounded-xl rounded-bl-none text-gray-500 text-xs shadow-sm">Typing...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-2 flex gap-2 bg-white">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-smd-blue"
            />
            <button onClick={send} disabled={loading} className="bg-smd-blue text-white p-2 rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors shadow-sm">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
