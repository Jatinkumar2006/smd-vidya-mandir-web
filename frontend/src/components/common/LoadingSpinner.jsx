import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', width: '100%' }}>
      <Loader2 
        size={40} 
        color="#f59e0b" 
        style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} 
      />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <p style={{ color: '#6b7280', fontSize: '15px', fontWeight: 500 }}>{text}</p>
    </div>
  )
}
