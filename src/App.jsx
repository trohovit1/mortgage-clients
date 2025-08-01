// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// Example in App.jsx or Clients.jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    async function fetchClients() {
      let { data, error } = await supabase.from('master_clients').select('*')
      if (error) console.error(error)
      else setClients(data)
    }

    fetchClients()
  }, [])

  return (
    <div>
      <h2>Client List</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
