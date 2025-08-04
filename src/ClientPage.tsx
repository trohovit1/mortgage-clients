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
  const { user } = useUser()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id || !user?.primaryEmailAddress?.emailAddress) return

    const fetchClient = async () => {
      const email = user.primaryEmailAddress.emailAddress
      setLoading(true)
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq('owner', email)
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

  const handleChange = (field: keyof Client, value: string | number | null) => {
    setClient(prev => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSave = async () => {
    if (!id || !client) return
    setSaving(true)
    const { error } = await supabase
      .from("clients")
      .update(client)
      .eq("id", id)

    if (error) {
      alert("Failed to save changes.")
      console.error(error)
    } else {
      alert("Changes saved.")
    }
    setSaving(false)
  }

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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Client Details</h1>
      {Object.entries(client).map(([key, value]) => (
        <div key={key} className="mb-3">
          <label className="block font-semibold capitalize">
            {key.replaceAll("_", " ")}:
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={(value ?? "") as string | number}
            onChange={(e) =>
              handleChange(key as keyof Client, e.target.value)
            }
          />
        </div>
      ))}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => navigate("/mortgage-clients")}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
