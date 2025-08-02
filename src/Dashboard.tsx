// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// Example in App.jsx or Clients.jsx
// import { useEffect, useState } from 'react'
// import { supabase } from './supabase'
// import Unauthorized from './unauthorized'
import { useAuth } from '@clerk/clerk-react'
// import { useNavigate } from 'react-router-dom'
import {DataTableDemo} from "./DataTable"


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
//   const navigate = useNavigate()

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

      <div className="w-full max-w-5xl bg-card rounded-xl shadow-md p-6 mb-10 text-card-foreground">
        <DataTableDemo />
        </div>

      {/* <button style={buttonStyle} onClick={() => navigate('/mortgage-clients/master-database')}>Master Client Database</button> */}

      <button 
        onClick={() => signOut({ redirectUrl: '/mortgage-clients' })} 
        style={{ ...buttonStyle, backgroundColor: '#0000FF', color: 'white', marginTop: '40px' }}
      >
        Sign Out
      </button>
    </div>
  )
}

export default Dashboard
