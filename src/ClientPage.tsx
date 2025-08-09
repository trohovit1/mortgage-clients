import { useUser } from "@clerk/clerk-react"
import { supabase } from "./supabase"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usStates, oldContactOptions, propertyOrderOptions, statusOptions } from "./selectOptions"
import { DatePickerInput, InputWithLabel, SelectWithLabel } from "./CustomComponents"
import { Button } from "./components/ui/button"
import { Client } from "./clients"
import { set } from "date-fns"
import { Input } from "./components/ui/input"

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dateOfContract, setDateOfContract] = useState<Date | null>(null)
  const [lastContact, setLastContact] = useState<Date | null>(null)
  const [notesText, setNotesText] = useState("")

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipcode, setZipcode] = useState("")
  const [homePhone, setHomePhone] = useState("")
  const [businessPhone, setBusinessPhone] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [businessAddressPO, setBusinessAddressPO] = useState("")
  const [businessCity, setBusinessCity] = useState("")
  const [businessState, setBusinessState] = useState("")
  const [businessZip, setBusinessZip] = useState("")
  const [smLink, setSmLink] = useState("")
  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [status, setStatus] = useState<Client['status']>("")
  const [children, setChildren] = useState("")
  const [coBorrower, setCoBorrower] = useState("")
  const [oldContact, setOldContact] = useState("")
  const [email, setEmail] = useState("")
  const [mobilePhone, setMobilePhone] = useState("")
  const [propertyOrder, setPropertyOrder] = useState("")
  const [salePrice, setSalePrice] = useState("")
  const [subjectPrice, setSubjectPrice] = useState("")
  const [subjectLoan, setSubjectLoan] = useState("")
  const [loanType, setLoanType] = useState("")
  const [rate, setRate] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [spouse, setSpouse] = useState("")
  const [clientSource, setClientSource] = useState("")
  const [currentAmount, setCurrentAmount] = useState("")
  const [prospectAmount, setProspectAmount] = useState("")


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
        
        setFirstName(clientData.first_name)
        setLastName(clientData.last_name)
        setSpouse(clientData.spouse)
        setStatus(clientData.status)
        setCurrentAmount(clientData.current_amount || 0)
        setProspectAmount(clientData.prospect_amount || 0)
        setRate(clientData.rate || 0)
        setLoanType(clientData.loan_type)
        setSalePrice(clientData.sale_price || 0)
        setSubjectPrice(clientData.subject_price || 0)
        setSubjectLoan(clientData.subject_loan || 0)
        setPropertyOrder(clientData.property_order || 1)
        setOldContact(clientData.old_contact)
        setClientSource(clientData.client_source)
        setAddress(clientData.address)
        setCity(clientData.city)
        setState(clientData.state)
        setZipcode(clientData.zipcode)
        setHomePhone(clientData.home_phone)
        setMobilePhone(clientData.mobile_phone)
        setEmail(clientData.email)
        setBusinessPhone(clientData.business_phone)
        setBusinessEmail(clientData.business_email)
        setCompany(clientData.company)
        setJobTitle(clientData.job_title)
        setBusinessAddress(clientData.business_address)
        setBusinessAddressPO(clientData.business_address_po)
        setBusinessCity(clientData.business_city)
        setBusinessState(clientData.business_state)
        setBusinessZip(clientData.business_zip)
        setSmLink(clientData.sm_link)

        setDateOfContract(clientData.date_of_contract ? new Date(clientData.date_of_contract) : null)
        setLastContact(clientData.last_contact ? new Date(clientData.last_contact) : null)

        setNotesText(Array.isArray(clientData.notes) ? clientData.notes.join("\n") : "")
      }
      setLoading(false)
    }

    fetchClient();

  }, [id, user])

  const handleChange = (field: keyof Client, value: any) => {
    setClient(prev => prev ? { ...prev, [field]: value } : prev)
  }


  const handleSave = async () => {
    if (!client) return
    setSaving(true)

    const updatedClient = {
      address: address || null,
      city: city || null,
      state: state || null,
      zipcode: zipcode || null,
      home_phone: homePhone || null,
      mobile_phone: mobilePhone || null,
      email: email || null,
      business_phone: businessPhone || null,
      business_email: businessEmail || null,
      business_address: businessAddress || null,
      business_address_po: businessAddressPO || null,
      business_city: businessCity || null,
      business_state: businessState || null,
      business_zip: businessZip || null,
      sm_link: smLink || null,
      company: company || null,
      job_title: jobTitle || null,
      first_name: firstName || null,
      last_name: lastName || null,
      spouse: spouse || null,
      status: status || null,
      children: children || null,
      co_borrower: coBorrower || null,
      current_amount: currentAmount ? parseInt(currentAmount) : null,
      prospect_amount: prospectAmount ? parseInt(prospectAmount) : null,
      rate: rate ? parseFloat(rate) : null,
      loan_type: loanType || null,
      sale_price: salePrice ? parseInt(salePrice) : null,
      subject_price: subjectPrice ? parseInt(subjectPrice) : null,
      subject_loan: subjectLoan ? parseInt(subjectLoan) : null,
      property_order: propertyOrder ? parseInt(propertyOrder): null,
      old_contact: oldContact || null,
      client_source: clientSource || null,
      last_contact: lastContact,
      owner: user.primaryEmailAddress.emailAddress,
      date_of_contract: dateOfContract,
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

  if (loading) return <div>
    <h1 className="text-center text-2xl font-bold text-gray-200">Loading client details...
      <Button
            onClick={() => navigate("/mortgage-clients")}
            className="hover:bg-gray-400"
            variant="secondary"
          >
            ← Back
          </Button>
    </h1>
  </div>
  if (error) return <div>
    <h1 className="text-center text-2xl font-bold text-gray-200">{error}
      <Button
            onClick={() => navigate("/mortgage-clients")}
            className="hover:bg-gray-400"
            variant="secondary"
          >
            ← Back
          </Button>
    </h1>
  </div>
  if (!client) return <div>
    <h1 className="text-center text-2xl font-bold text-gray-200">No client found with ID: {id}
      <Button
          type="button"
            onClick={() => navigate("/mortgage-clients")}
            className="hover:bg-gray-400"
            variant="secondary"
          >
            ← Back
          </Button>
    </h1>
  </div>

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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} />
          <InputWithLabel
            id="last_name"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} />
          <SelectWithLabel id="status" label="Status" value={client.status ?? ""} onChange={handleChange} options={statusOptions} />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-3 gap-4">
          <InputWithLabel
            id="home_phone"
            label="Home Phone"
            value={homePhone}
            onChange={(e) => setHomePhone(e.target.value)}
          />
          <InputWithLabel
            id="mobile_phone"
            label="Mobile Phone"
            value={mobilePhone}
            onChange={(e) => setMobilePhone(e.target.value)}
          />
          <InputWithLabel
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Address row */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="address"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <InputWithLabel
            id="city"
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* State and zip */}
        <div className="grid grid-cols-2 gap-4">
          <SelectWithLabel
            id="state"
            label="State"
            value={client.state ?? ""}
            onChange={(v) => handleChange("state", v)}
            options={usStates}
          />
          <InputWithLabel
            id="zipcode"
            label="Zipcode"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
        </div>

        {/* Spouse, children, co-borrower */}
        <div className="grid grid-cols-3 gap-4">
          <InputWithLabel
          type="text"
            id="spouse"
            label="Spouse"
            value={spouse}
            onChange={(e) => setSpouse(e.target.value)}
          />
          <InputWithLabel
            id="children"
            label="Children"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
          />
          <InputWithLabel
            id="co_borrower"
            label="Co-Borrower"
            value={coBorrower}
            onChange={(e) => setCoBorrower(e.target.value)}
          />
        </div>

        {/* Amounts, contract date, rate */}
        <div className="grid grid-cols-4 gap-4">
          <InputWithLabel
            id="current_amount"
            label="Current Amount"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
          <InputWithLabel
            id="prospect_amount"
            label="Prospect Amount"
            value={prospectAmount}
            onChange={(e) => setProspectAmount(e.target.value)}
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
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        {/* Loan type row */}
        <div className="grid grid-cols-4 gap-4">
          <InputWithLabel
            id="loan_type"
            label="Loan Type"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
          />
          <InputWithLabel
            id="sale_price"
            label="Sale Price"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
          <InputWithLabel
            id="subject_price"
            label="Subject Price"
            value={subjectPrice}
            onChange={(e) => setSubjectPrice(e.target.value)}
          />
          <InputWithLabel
            id="subject_loan"
            label="Subject Loan"
            value={subjectLoan}
            onChange={(e) => setSubjectLoan(e.target.value)}
          />
        </div>

        {/* Property info row */}
        <div className="grid grid-cols-4 gap-4">
          <SelectWithLabel
            id="property_order"
            label="Property Order"
            value={client.property_order ?? ""}
            onChange={(v) => handleChange("property_order", v)}
            options={propertyOrderOptions}
          />
          <SelectWithLabel
            id="old_contact"
            label="Old Contact?"
            value={client.old_contact ?? ""}
            onChange={(v) => handleChange("old_contact", v)}
            options={oldContactOptions}
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
            value={clientSource}
            onChange={(e) => setClientSource(e.target.value)}
          />
        </div>

        {/* Company and job */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="company"
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <InputWithLabel
            id="job_title"
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* Business email and phone */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="business_email"
            label="Business Email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
          />
          <InputWithLabel
            id="business_phone"
            label="Business Phone"
            value={businessPhone}
            onChange={(e) => setBusinessEmail(e.target.value)}
          />
        </div>

        {/* Business address and city */}
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            id="business_address"
            label="Business Address"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
          />
          <InputWithLabel
            id="business_city"
            label="Business City"
            value={businessCity}
            onChange={(e) => setBusinessCity(e.target.value)}
          />
        </div>

        {/* Business state/zip/po */}
        <div className="grid grid-cols-3 gap-4">
          <SelectWithLabel
            id="business_state"
            label="Business State"
            value={client.business_state ?? ""}
            onChange={(v) => handleChange("business_state", v)}
            options={usStates}
          />
          <InputWithLabel
            id="business_zip"
            label="Business Zipcode"
            value={businessZip}
            onChange={(e) => setBusinessZip(e.target.value)}
          />
          <InputWithLabel
            id="business_address_po"
            label="Business PO Box"
            value={businessAddressPO}
            onChange={(e) => setBusinessAddressPO(e.target.value)}

          />
        </div>
        <div className="mt-4">
          <InputWithLabel
              id="sm_link"
              label="SM Link"
              value={smLink}
              onChange={(e) => setSmLink(e.target.value)}

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
            onClick={() => navigate("/mortgage-clients")}
            className="hover:bg-gray-400"
            variant="secondary"
            type="button"
          >
            ← Back
          </Button>
          <Button
            className="hover:bg-blue-900"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
