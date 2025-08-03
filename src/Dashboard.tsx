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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Client } from './clients' // Adjust the import based on your project structure
import { mockClients } from './clients'


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

const [clients, setClients] = useState<Client[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const navigate = useNavigate()

useEffect(() => {
  setClients(mockClients) // Replace with actual data fetching logic
})

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

// Filter by status
  let filteredClients = clients.filter(client =>
    statusFilter === 'all' ? true : client.status === statusFilter
  )

  // Filter by search term in name (case insensitive)
  if (searchTerm.trim() !== '') {
    filteredClients = filteredClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Sort by date_of_contract
  filteredClients.sort((a, b) => {
    const dateA = new Date(a.date_of_contract).getTime()
    const dateB = new Date(b.date_of_contract).getTime()
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
  })

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Welcome, Bill Rohovit.</h1>

      <div style={{ marginBottom: 20, marginTop: 20 }}>

        <label>
          Search by Name:{' '}
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Enter name..."
          />
        </label>
      </div>

      <div
        className="table-container"
        style={{
          maxWidth: '100%',
          overflowX: 'auto',
          margin: '0 auto',
          maxHeight: 600,
          overflowY: 'auto'
        }}
      >
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: 900,
          }}
        >
          <thead>
            <tr>
              <label style={{ marginBottom: '30%' }}>
                Status
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  style={{marginTop: '13%'}}
                >
                  <option value="all">All</option>
                  <option value="current">Current</option>
                  <option value="prospect">Prospect</option>
                  <option value="inactive">Inactive</option>
                  <option value="actively pursuing">Actively Pursuing</option>
                </select>
              </label>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Contact Type</th>
              <th>Current Amount</th>
              <th>Prospect Amount</th>
              <th>Rate</th>
              <th>
                Date of Contract{' '}
                <button
                  style={{
                    marginLeft: 5,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                  aria-label="Sort by Date"
                >
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </button>
              </th>
              <th>Client Source</th>
              <th>Contact History</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                style={{ cursor: 'pointer', backgroundColor: '#060505ff' }}
              >
                <td>{client.status}</td>
                <td>{client.name}</td>
                <td>{client.address}</td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
                <td>{client.contact_type}</td>
                <td>${client.current_amount.toLocaleString()}</td>
                <td>${client.prospect_amount.toLocaleString()}</td>
                <td>{client.rate}%</td>
                <td>{new Date(client.date_of_contract).toLocaleDateString()}</td>
                <td>{client.client_source}</td>
                <td>{client.contact_history.join(', ')}</td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: 20 }}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
  onClick={() => signOut({ redirectUrl: '/mortgageClients' })}
  style={{
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '10px 16px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  }}
>
  Sign Out
</button>

    </div>
    
  )
}

export default Dashboard
