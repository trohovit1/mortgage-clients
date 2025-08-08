import { useUser } from "@clerk/clerk-react"
import { supabase } from "./supabase"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usStates } from "./states"
import { formatDate, DatePickerInput, InputWithLabel, SelectWithLabel } from "./CustomComponents"
import { Button } from "./components/ui/button"

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // For date pickers
  const [dateOfContract, setDateOfContract] = useState<Date | null>(null)
  const [lastContact, setLastContact] = useState<Date | null>(null)

  // Notes textarea state
  const [notesText, setNotesText] = useState("")

  useEffect(() => {
    if (!id || !user?.primaryEmailAddress?.emailAddress) return

    const fetchClient = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("owner", user.primaryEmailAddress.emailAddress)
        .eq("id", id)

      if (error) {
        setError("Failed to load client data.")
        console.error(error)
      } else if (data && data.length > 0) {
        const clientData = data[0]
        setClient(clientData)

        // Initialize date states from client data if exists
        setDateOfContract(clientData.date_of_contract ? new Date(clientData.date_of_contract) : null)
        setLastContact(clientData.last_contact ? new Date(clientData.last_contact) : null)

        // Initialize notes (array to string)
        setNotesText(Array.isArray(clientData.notes) ? clientData.notes.join("\n") : "")
      }
      setLoading(false)
    }

    fetchClient()
    // console.log(client.state)
  }, [id, user])

  const handleChange = (field: keyof typeof client, value: any) => {
    setClient(prev => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSave = async () => {
    if (!client) return
    setSaving(true)

    const updatedClient = {
      ...client,
      date_of_contract: dateOfContract ? dateOfContract.toISOString() : null,
      last_contact: lastContact ? lastContact.toISOString() : null,
      notes: notesText ? notesText.split("\n").filter(n => n.trim() !== "") : []
    }

    const { error } = await supabase
      .from("clients")
      .update(updatedClient)
      .eq("id", client.id)

    if (error) {
      alert("Failed to save changes.")
      console.error(error)
    } else {
      alert("Changes saved.")
      navigate("/mortgage-clients")
    }
    setSaving(false)
  }

  if (loading) return <div>Loading client data...</div>
  if (error) return <div>{error}</div>
  if (!client) return <div>No client found with ID: {id}</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow">
      <h1 className="text-center text-3xl font-bold mb-6">Edit Client Details</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSave()
        }}
        className="space-y-6"
      >
        {/* First row */}
        <div className="grid grid-cols-3 gap-4">
          <InputWithLabel
            id="first_name"
            label="First Name"
            value={client.first_name ?? ""}
            onChange={(v) => handleChange("first_name", v)}
          />
          <InputWithLabel
            id="last_name"
            label="Last Name"
            value={client.last_name ?? ""}
            onChange={(v) => handleChange("last_name", v)}
          />
          <SelectWithLabel
            id="state"
            label="State"
            value={client.state ?? ""}
            onChange={v => handleChange("state", v)}
            options={usStates}
          />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-3 gap-4">
          <InputWithLabel
            id="home_phone"
            label="Home Phone"
            value={client.home_phone ?? ""}
            onChange={(v) => handleChange("home_phone", v)}
          />
          <InputWithLabel
            id="mobile_phone"
            label="Mobile Phone"
            value={client.mobile_phone ?? ""}
            onChange={(v) => handleChange("mobile_phone", v)}
          />
          <InputWithLabel
            id="email"
            label="Email"
            value={client.email ?? ""}
            onChange={(v) => handleChange("email", v)}
            type="email"
          />
        </div>

        {/* Address row */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="address"
            label="Address"
            value={client.address ?? ""}
            onChange={(v) => handleChange("address", v)}
          />
          <InputWithLabel
            id="city"
            label="City"
            value={client.city ?? ""}
            onChange={(v) => handleChange("city", v)}
          />
        </div>

        {/* State and zip */}
        <div className="grid grid-cols-2 gap-4">
          <SelectWithLabel
            id="state"
            label="State"
            value={client.state ?? ""}
            onChange={(v) => handleChange("state", v)}
            options={usStates.map(s => s.label)}
          />
          <InputWithLabel
            id="zipcode"
            label="Zipcode"
            value={client.zipcode ?? ""}
            onChange={(v) => handleChange("zipcode", v)}
          />
        </div>

        {/* Spouse, children, co-borrower */}
        <div className="grid grid-cols-3 gap-4">
          <InputWithLabel
            id="spouse"
            label="Spouse"
            value={client.spouse ?? ""}
            onChange={(v) => handleChange("spouse", v)}
          />
          <InputWithLabel
            id="children"
            label="Children"
            value={client.children ?? ""}
            onChange={(v) => handleChange("children", v)}
          />
          <InputWithLabel
            id="co_borrower"
            label="Co-Borrower"
            value={client.co_borrower ?? ""}
            onChange={(v) => handleChange("co_borrower", v)}
          />
        </div>

        {/* Amounts, contract date, rate */}
        <div className="grid grid-cols-4 gap-4">
          <InputWithLabel
            id="current_amount"
            label="Current Amount"
            value={client.current_amount ?? ""}
            onChange={(v) => handleChange("current_amount", v)}
          />
          <InputWithLabel
            id="prospect_amount"
            label="Prospect Amount"
            value={client.prospect_amount ?? ""}
            onChange={(v) => handleChange("prospect_amount", v)}
          />
          <DatePickerInput
            id="date_of_contract"
            label="Date of Contract"
            date={dateOfContract}
            setDate={setDateOfContract}
            value={dateOfContract ? dateOfContract.toISOString().slice(0, 10) : ""}
            onChange={(v) => {}}
          />
          <InputWithLabel
            id="rate"
            label="Rate"
            value={client.rate ?? ""}
            onChange={(v) => handleChange("rate", v)}
          />
        </div>

        {/* Loan type row */}
        <div className="grid grid-cols-4 gap-4">
          <InputWithLabel
            id="loan_type"
            label="Loan Type"
            value={client.loan_type ?? ""}
            onChange={(v) => handleChange("loan_type", v)}
          />
          <InputWithLabel
            id="sale_price"
            label="Sale Price"
            value={client.sale_price ?? ""}
            onChange={(v) => handleChange("sale_price", v)}
          />
          <InputWithLabel
            id="subject_price"
            label="Subject Price"
            value={client.subject_price ?? ""}
            onChange={(v) => handleChange("subject_price", v)}
          />
          <InputWithLabel
            id="subject_loan"
            label="Subject Loan"
            value={client.subject_loan ?? ""}
            onChange={(v) => handleChange("subject_loan", v)}
          />
        </div>

        {/* Property info row */}
        <div className="grid grid-cols-4 gap-4">
          <SelectWithLabel
            id="property_order"
            label="Property Order"
            value={client.property_order ?? ""}
            onChange={(v) => handleChange("property_order", v)}
            options={["1", "2", "3", "4", "5"]}
          />
          <SelectWithLabel
            id="old_contact"
            label="Old Contact?"
            value={client.old_contact ?? ""}
            onChange={(v) => handleChange("old_contact", v)}
            options={["Yes", "No"]}
          />
          <DatePickerInput
            id="last_contact"
            label="Last Contact"
            date={lastContact}
            setDate={setLastContact}
            value={lastContact ? lastContact.toISOString().slice(0, 10) : ""}
            onChange={(v) => {}}
          />
          <InputWithLabel
            id="client_source"
            label="Client Source"
            value={client.client_source ?? ""}
            onChange={(v) => handleChange("client_source", v)}
          />
        </div>

        {/* Company and job */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="company"
            label="Company"
            value={client.company ?? ""}
            onChange={(v) => handleChange("company", v)}
          />
          <InputWithLabel
            id="job_title"
            label="Job Title"
            value={client.job_title ?? ""}
            onChange={(v) => handleChange("job_title", v)}
          />
        </div>

        {/* Business email and phone */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="business_email"
            label="Business Email"
            value={client.business_email ?? ""}
            onChange={(v) => handleChange("business_email", v)}
          />
          <InputWithLabel
            id="business_phone"
            label="Business Phone"
            value={client.business_phone ?? ""}
            onChange={(v) => handleChange("business_phone", v)}
          />
        </div>

        {/* Business address and city */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="business_address"
            label="Business Address"
            value={client.business_address ?? ""}
            onChange={(v) => handleChange("business_address", v)}
          />
          <InputWithLabel
            id="business_city"
            label="Business City"
            value={client.business_city ?? ""}
            onChange={(v) => handleChange("business_city", v)}
          />
        </div>

        {/* Business state/zip/po */}
        <div className="grid grid-cols-3 gap-4">
          <InputWithLabel
            id="business_state"
            label="Business State"
            value={client.business_state ?? ""}
            onChange={(v) => handleChange("business_state", v)}
          />
          <InputWithLabel
            id="business_zip"
            label="Business Zipcode"
            value={client.business_zip ?? ""}
            onChange={(v) => handleChange("business_zip", v)}
          />
          <InputWithLabel
            id="business_address_po"
            label="Business PO Box"
            value={client.business_address_po ?? ""}
            onChange={(v) => handleChange("business_address_po", v)}
          />
        </div>
        <div className="mt-4">
          <InputWithLabel
              id="sm_link"
              label="SM Link"
              value={client.sm_link ?? ""}
              onChange={(v) => handleChange("sm_link", v)}
            />
        </div>

        {/* Notes textarea */}
        <div className="mt-4">
          <label htmlFor="notes" className="block font-semibold mb-1">Notes</label>
          <textarea
            id="notes"
            rows={6}
            className="w-full p-2 border rounded resize-y"
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Enter notes, each note on a new line"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Button
            type="button"
            onClick={() => navigate("/mortgage-clients")}
            className="hover:bg-gray-400"
            variant="secondary"
          >
            ← Back
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="hover:bg-blue-900"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
