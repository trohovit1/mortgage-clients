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
import { Dialog } from '@radix-ui/react-dialog'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Label } from './components/ui/label'
import { Input } from './components/ui/input'


function Dashboard() {
  const { signOut } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const navigate = useNavigate()
  const { user } = useUser()
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);


useEffect(() => {
  if (!user?.primaryEmailAddress?.emailAddress) return;

  const fetchClients = async () => {
    const email = user.primaryEmailAddress.emailAddress;

    let query = supabase
      .from('clients')
      .select('*')
      .eq('owner', email)
      .is('deleted', null) 
      .limit(100);

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

const handleDelete = async () => {
  if (!clientToDelete || !user?.primaryEmailAddress?.emailAddress) return;

  const email = user.primaryEmailAddress.emailAddress;

  const { error } = await supabase
    .from('clients')
    .update({ deleted: new Date().toISOString() })
    .eq('id', clientToDelete.id)
    .eq('owner', email);

  if (error) {
    console.error('Error deleting client:', error);
    alert('Failed to delete client.');
  } else {
    alert('Client deleted successfully.');
  }

  setClientToDelete(null);
  setDeleteOpen(false);
  setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
}


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
              <th></th>
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
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr
                key={client.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setClientToDelete(client)
                      setDeleteOpen(true)
                    }}
                  >
                    <FaTrash size={20} color="red" />
                  </Button>
                </td>
                {/* <td onClick={(e) => e.stopPropagation()}>
                  <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setClientToDelete(client);
                        }}
                      >
                        <FaTrash size={20} color="red" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md dialog-bg-lightblue">
                      <DialogHeader className={undefined}>
                        <DialogTitle className={undefined}>Are you sure you want to delete this client?</DialogTitle>
                        <DialogDescription className={undefined}>This action cannot be undone.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="destructive" onClick={handleDelete}>
                            Delete
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog> */}
                {/* </td> */}
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
              </tr>
            ))}
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
      {clientToDelete && (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent
            className="w-[500px] bg-gray-200 rounded-lg p-6 space-y-4 text-center flex flex-col items-center justify-center"
          >
            <DialogTitle className="text-lg font-semibold">
              Are you sure you want to delete this client?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This action cannot be undone.
            </DialogDescription>
            <div className="flex gap-4 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="hover:bg-gray-300">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" variant="destructive" onClick={handleDelete} className="hover:bg-red-700">
                  Delete
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
    
  )
}

export default Dashboard
