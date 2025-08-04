import './App.css'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Client } from './clients' // Adjust the import based on your project structure
import { createClient } from '@supabase/supabase-js'


function Dashboard() {
  const { signOut } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const navigate = useNavigate()
  const { user } = useUser()
  const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)


  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return

    const fetchClients = async () => {
      const email = user.primaryEmailAddress.emailAddress

      const { data, error } = await supabase
        .from('clients') // your Supabase table name
        .select('*')
        .eq('owner', email)

      if (error) {
        console.error('Error fetching clients:', error)
      } else {
        setClients(data || [])
      }

      setLoading(false)
    }

    fetchClients()
  }, [])
  // Filter by status
  let filteredClients = clients.filter(client =>
    statusFilter === 'all' ? true : client.status == statusFilter
  )

  // Filter by search term in name (case insensitive)
  if (searchTerm.trim() !== '') {
    const lowerSearch = searchTerm.toLowerCase()
    filteredClients = filteredClients.filter(client =>
      client.first_name?.toLowerCase().includes(lowerSearch) ||
      client.last_name?.toLowerCase().includes(lowerSearch)
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
              <th>
                <div style={{ marginBottom: 20 }}>
                  <label>
                    Status Filter:
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value as any)}
                    >
                      <option value="all">All</option>
                      <option value="Active Prospect">Active Prospect</option>
                      <option value="Customer">Customer</option>
                      <option value="New Contact">New Contact</option>
                      <option value="Prospect">Prospect</option>
                    </select>
                  </label>
                </div>
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zipcode</th>
              <th>Phone</th>
              <th>Email</th>
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
                <td>{client.first_name}</td>
                <td>{client.last_name}</td>
                <td>{client.address}</td>
                <td>{client.city}</td>
                <td>{client.state}</td>
                <td>{client.zipcode}</td>
                <td>{client.home_phone}</td>
                <td>{client.email}</td>
                <td>${client.current_amount}</td>
                <td>${client.prospect_amount}</td>
                <td>{client.rate}%</td>
                <td>{new Date(client.date_of_contract).toLocaleDateString()}</td>
                <td>{client.client_source}</td>
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
  onClick={() => signOut({ redirectUrl: '/mortgage-clients' })}
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
