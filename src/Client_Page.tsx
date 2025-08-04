import { useUser } from "@clerk/clerk-react"
import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "./supabase"
import { Client } from "./clients" // Adjust the import based on your project structure


export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchClient = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)

      if (error) {
        setError("Failed to load client data.")
        console.error(error)
      } else {
        setClient(data[0])
      }
      setLoading(false)
    }

    fetchClient()
  }, [id])

  if (!id) {
    return <div>Error: No client ID provided.</div>
  }

  if (loading) {
    return <div>Loading client data...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!client) {
    return <div>No client found with ID: {id}</div>
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
        <p><strong>Current Amount:</strong> ${client.current_amount}</p>
        <p><strong>Prospect Amount:</strong> ${client.prospect_amount}</p>
        <p><strong>Rate:</strong> {client.rate}%</p>
        <p><strong>Date of Contract:</strong> {new Date(client.date_of_contract).toLocaleDateString()}</p>
        <p><strong>Client Source:</strong> {client.client_source}</p>
        <p><strong>Notes:</strong> {client.notes}</p>
      </div>
    </div>
  )
}
