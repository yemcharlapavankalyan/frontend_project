import { useState } from 'react'

export default function FeedbackForm({ onSubmit }) {
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.({ rating, comments })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Rating (1-5)</label>
        <input type="number" min={1} max={5} value={rating} onChange={(e)=>setRating(Number(e.target.value))}
               className="w-24 rounded-md border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Comments</label>
        <textarea value={comments} onChange={(e)=>setComments(e.target.value)} className="w-full rounded-md border px-3 py-2" />
      </div>
      <button className="rounded-md bg-indigo-600 text-white px-3 py-2">Submit</button>
    </form>
  )
}


