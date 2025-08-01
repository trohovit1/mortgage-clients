// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// Example in App.jsx or Clients.jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Unauthorized from './unauthorized'
import { useAuth } from '@clerk/clerk-react'

function Dashboard() {
  const [clients, setClients] = useState([])
  const [error, setError] = useState(null)
  const { signOut } = useAuth()

  useEffect(() => {
    async function fetchClients() {
      let { data, error } = await supabase.from('master_clients').select('*')
      if (error) {
        console.error('Supabase Error:', error)
        setError(error)
        return
      }
      else setClients(data)
    }

    fetchClients()
  }, [])

  if (error) {
    return <Unauthorized />
  }

  return (
    <div>
      <button onClick={() => signOut({redirectUrl: '/mortgage-clients'})} style={{ float: 'right' }}>
        Sign Out
      </button>
      <h2>Client List</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
