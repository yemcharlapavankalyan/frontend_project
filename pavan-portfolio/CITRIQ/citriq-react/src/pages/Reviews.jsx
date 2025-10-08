import { useState } from 'react'
import FeedbackForm from '../components/FeedbackForm.jsx'
import { useReviews } from '../context/ReviewsContext.jsx'

function ReviewCard({ review, onSubmitFeedback }) {
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <h3 className="font-semibold">{review.title}</h3>
      <p className="text-sm text-gray-600">{review.description}</p>
      <FeedbackForm onSubmit={(data)=>onSubmitFeedback(review.id, data)} />
    </div>
  )
}

export default function Reviews() {
  const { state, dispatch } = useReviews()
  const items = state.reviews

  function handleSubmitFeedback(id, feedback) {
    dispatch({ type: 'submitFeedback', payload: { reviewId: id, feedback } })
    alert('Feedback submitted!')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Peer Reviews</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it)=> (
          <ReviewCard key={it.id} review={it} onSubmitFeedback={handleSubmitFeedback} />
        ))}
      </div>
    </div>
  )
}


