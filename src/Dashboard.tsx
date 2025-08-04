import './index.css'
import './App.css'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Client } from './clients'
import { Button } from "./components/ui/button"
import { ClientFormDialog } from './clientAddDialog'
import { supabase } from './supabase'
import { FaTrash } from 'react-icons/fa';


function Dashboard() {
  const { signOut } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const navigate = useNavigate()
  const { user } = useUser()

useEffect(() => {
  if (!user?.primaryEmailAddress?.emailAddress) return;

  const fetchClients = async () => {
    const email = user.primaryEmailAddress.emailAddress;

    let query = supabase
      .from('clients')
      .select('*')
      .eq('owner', email);

    // Apply status filter if not 'all'
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    // Apply search filter if searchTerm is not empty
    if (searchTerm.trim() !== '') {
      const search = `%${searchTerm.trim()}%`;
      query = query.or(`first_name.ilike.${search},last_name.ilike.${search}`);
    }

    // Apply sorting
    query = query.order('date_of_contract', { ascending: sortDirection === 'asc' });

    // Optionally limit results if you want, or remove limit if you want all
    // query = query.limit(2000);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }

    setLoading(false);
  };

  fetchClients();
}, [statusFilter, searchTerm, sortDirection, user]);

  // // Filter by status
  // let filteredClients = clients.filter(client =>
  //   statusFilter === 'all' ? true : client.status == statusFilter
  // )

  // // Filter by search term in name (case insensitive)
  // if (searchTerm.trim() !== '') {
  //   const lowerSearch = searchTerm.toLowerCase()
  //   filteredClients = filteredClients.filter(client =>
  //     client.first_name?.toLowerCase().includes(lowerSearch) ||
  //     client.last_name?.toLowerCase().includes(lowerSearch)
  //   )
  // }


  // // Sort by date_of_contract
  // filteredClients.sort((a, b) => {
  //   const dateA = new Date(a.date_of_contract).getTime()
  //   const dateB = new Date(b.date_of_contract).getTime()
  //   return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
  // })

  return (
    <div style={{ textAlign: 'center', marginTop: 50}}>
      <h1 style={{color: 'lightblue', fontSize: '40px'}}>Welcome, Bill Rohovit.</h1>

      <div style={{ marginBottom: 20, marginTop: 20, color: 'lightgray' }}>

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
              <th><FaTrash size={24} color="red" /></th>
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
            {clients.map(client => (
              <tr
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                style={{ cursor: 'pointer' }}
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
            {clients.length === 0 && (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: 20 }}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Button
        onClick={() => signOut({ redirectUrl: '/mortgage-clients' })}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          padding: '10px 16px',
          backgroundColor: 'gray',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }} className={undefined} variant={"outline"} size={undefined}      >
        Sign Out
      </Button>
      <ClientFormDialog />
    </div>
    
  )
}

export default Dashboard
