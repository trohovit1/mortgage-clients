import { useParams, useNavigate } from "react-router-dom"


export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <div>Error: No client ID provided.</div>
  }

  // Mock client data for now
  const client = {
    id,
    name: "John Doe",
    address: "123 Main St",
    email: "john@example.com",
    phone: "555-555-5555",
    status: "current",
    contact_type: "email",
    contact_history: [],
    current_amount: 1000,
    prospect_amount: 0,
    rate: 3.5,
    date_of_contract: new Date(),
    client_source: "Referral",
    notes: ["First meeting was successful"],
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate("/mortgage-clients")}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back to Home
      </button>
      <h1 className="text-2xl font-bold mb-4">Client: {client.name}</h1>
      <div className="space-y-2">
        <p><strong>Address:</strong> {client.address}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone}</p>
        <p><strong>Status:</strong> {client.status}</p>
        <p><strong>Contact Type:</strong> {client.contact_type}</p>
        <p><strong>Current Amount:</strong> {client.current_amount}</p>
        <p><strong>Prospect Amount:</strong> {client.prospect_amount}</p>
        <p><strong>Rate:</strong> {client.rate}</p>
        <p><strong>Date of Contract:</strong> {client.date_of_contract.toString()}</p>
        <p><strong>Client Source:</strong> {client.client_source}</p>
        <p><strong>Notes:</strong> {client.notes.join(", ")}</p>
      </div>
    </div>
  )
}
