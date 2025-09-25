import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')
  const [message, setMessage] = useState<string>('')
  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's an error in the URL params
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        
        if (error) {
          setStatus('error')
          setMessage(`OAuth error: ${error}`)
          return
        }

        // Wait a moment for the backend to process the callback
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check authentication status
        await checkAuth()
        setStatus('success')
        setMessage('Authentication successful! Redirecting...')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/')
        }, 2000)
        
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message || 'Authentication failed')
      }
    }

    handleCallback()
  }, [checkAuth, navigate])

  return (
    <div className="container-narrow">
      <div className="text-center py-5">
        {status === 'loading' && (
          <>
            <div className="spinner-border mb-3" role="status">
              <span className="visually-hidden">Processing authentication...</span>
            </div>
            <h2>Processing Authentication</h2>
            <p className="text-muted">Please wait while we complete your login...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-success mb-3">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            </div>
            <h2 className="text-success">Authentication Successful!</h2>
            <p className="text-muted">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-danger mb-3">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg>
            </div>
            <h2 className="text-danger">Authentication Failed</h2>
            <div className="alert alert-danger">{message}</div>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
