import { createContext, useContext, useEffect, useReducer } from 'react'

const ReviewsContext = createContext(null)

const initialState = {
  reviews: [
    { id: 1, title: 'Portfolio Website', description: 'Review layout and accessibility' },
    { id: 2, title: 'Weather App', description: 'Check code structure and performance' },
  ],
  feedbackById: {},
}

function reducer(state, action) {
  switch (action.type) {
    case 'load':
      return action.payload
    case 'submitFeedback': {
      const { reviewId, feedback } = action.payload
      return {
        ...state,
        feedbackById: { ...state.feedbackById, [reviewId]: feedback },
      }
    }
    default:
      return state
  }
}

export function ReviewsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const stored = localStorage.getItem('critiq_state')
    if (stored) dispatch({ type: 'load', payload: JSON.parse(stored) })
  }, [])

  useEffect(() => {
    localStorage.setItem('critiq_state', JSON.stringify(state))
  }, [state])

  const value = { state, dispatch }
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}


