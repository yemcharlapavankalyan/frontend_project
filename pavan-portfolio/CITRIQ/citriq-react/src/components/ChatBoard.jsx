import { useState } from 'react'

export default function ChatBoard() {
  const [messages, setMessages] = useState([
    { id: 1, author: 'Alice', text: 'Please review my portfolio header.' },
    { id: 2, author: 'Bob', text: 'Added ARIA labels, thoughts?' },
  ])
  const [draft, setDraft] = useState('')

  function send() {
    if (!draft.trim()) return
    const next = { id: Date.now(), author: 'You', text: draft.trim() }
    setMessages((prev) => [...prev, next])
    setDraft('')
  }

  return (
    <div className="rounded-xl border bg-white p-4 flex flex-col h-96">
      <div className="font-semibold mb-2">Collaboration Board</div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="rounded-md bg-gray-50 p-2">
            <span className="font-medium">{m.author}:</span> {m.text}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={draft} onChange={(e)=>setDraft(e.target.value)} placeholder="Type a message"
               className="flex-1 rounded-md border px-3 py-2" />
        <button onClick={send} className="rounded-md bg-indigo-600 text-white px-3 py-2">Send</button>
      </div>
    </div>
  )
}


