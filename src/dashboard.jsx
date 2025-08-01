// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// Example in App.jsx or Clients.jsx
// import { useEffect, useState } from 'react'
// import { supabase } from './supabase'
// import Unauthorized from './unauthorized'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'


function Dashboard() {
//   const [clients, setClients] = useState([])
  const { signOut } = useAuth()

  const buttonStyle = {
    display: 'block',
    width: '200px',
    margin: '10px auto',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  }
  const navigate = useNavigate()

//   useEffect(() => {
//     async function fetchClients() {
//       let { data, error } = await supabase.from('master_clients').select('*')
//       if (error) {
//         console.error('Supabase Error:', error)
//         setError(error)
//         return
//       }
//       else setClients(data)
//     }

//     fetchClients()
//   }, [])


//   return (
//     <div>
//       <button onClick={() => signOut({redirectUrl: '/'})} style={{ float: 'right' }}>
//         Sign Out
//       </button>
//       <h2>Client List</h2>
//       <ul>
//         {clients.map(client => (
//           <li key={client.id}>{client.name}</li>
//         ))}
//       </ul>
//     </div>
//   )

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, Bill Rohovit.</h1>

      <button style={buttonStyle} onClick={() => navigate('/master-database')}>Master Client Database</button>
      <button style={buttonStyle} onClick={() => navigate('/current-clients')}>Current Client Data</button>
      <button style={buttonStyle} onClick={() => navigate('/prospect-database')}>Prospect Database</button>

      <button 
        onClick={() => signOut({ redirectUrl: '/' })} 
        style={{ ...buttonStyle, backgroundColor: '#0000FF', color: 'white', marginTop: '40px' }}
      >
        Sign Out
      </button>
    </div>
  )
}

export default Dashboard
