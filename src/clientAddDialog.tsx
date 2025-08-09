import React, { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./components/ui/dialog"
import { Button } from "./components/ui/button"
import { useUser } from "@clerk/clerk-react"
import { supabase } from './supabase'
import './App.css'
import { usStates, oldContactOptions, propertyOrderOptions, statusOptions } from "./selectOptions"
import { formatDate, DatePickerInput, InputWithLabel, SelectWithLabel } from "./CustomComponents"


type ClientFormData = {
  address: string
  business_address: string
  business_address_po: string
  business_city: string
  business_email: string
  business_phone: string
  business_state: string
  business_zip: string
  city: string
  client_source: string
  co_borrower: string
  children: string
  company: string
  current_amount: number
  date_of_contract: Date
  email: string
  first_name: string
  home_phone: string
  job_title: string
  last_contact: Date
  last_name: string
  loan_type: string
  mobile_phone: string
  notes: string[]
  old_contact: string
  property_order: number
  prospect_amount: number
  rate: number
  sale_price: number
  sm_link: string
  spouse: string
  state: string
  status: string
  subject_loan: number
  subject_price: number
  zipcode: string
}

const initialFormData: ClientFormData = {
  address: "",
  business_address: "",
  business_address_po: "",
  business_city: "",
  business_email: "",
  business_phone: "",
  business_state: "",
  business_zip: "",
  city: "",
  client_source: "",
  co_borrower: "",
  company: "",
  children: "",
  current_amount: 0,
  date_of_contract: new Date(),
  email: "",
  first_name: "",
  home_phone: "",
  job_title: "",
  last_contact: new Date(),
  last_name: "",
  loan_type: "",
  mobile_phone: "",
  notes: [""],
  old_contact: "",
  property_order: 1,
  prospect_amount: 0,
  rate: 0,
  sale_price: 0,
  sm_link: "",
  spouse: "",
  state: "",
  status: "",
  subject_loan: 0,
  subject_price: 0,
  zipcode: "",
}


export function ClientFormDialog() {
  const { user } = useUser()
  const [formData, setFormData] = useState<ClientFormData>(initialFormData)
  const [date1, setDate1] = React.useState<Date | undefined>()
  const [value1, setValue1] = React.useState(formatDate(date1))
  const [date2, setDate2] = React.useState<Date | undefined>()
  const [value2, setValue2] = React.useState(formatDate(date1))

  const [notesText, setNotesText] = React.useState("")


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.primaryEmailAddress?.emailAddress) return

    const email = user.primaryEmailAddress.emailAddress

    const { data: existingClients, error: fetchError } = await supabase
        .from("clients")
        .select("id")
        .eq("first_name", formData.first_name)
        .eq("last_name", formData.last_name)
        .is('deleted', null)
        .limit(1);

    if (existingClients && existingClients.length > 0) {
        alert("A client with this first and last name already exists. Please edit the existing client.");
        setOpenDialog(false);
        setFormData(initialFormData);
        return;
    }

    const { error } = await supabase.from("clients").insert([
        {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        status: formData.status,
        address: formData.address,
        business_address: formData.business_address,
        business_address_po: formData.business_address_po,
        business_city: formData.business_city,
        business_email: formData.business_email,
        business_phone: formData.business_phone,
        business_state: formData.business_state,
        business_zip: formData.business_zip,
        city: formData.city,
        client_source: formData.client_source,
        co_borrower: formData.co_borrower,
        company: formData.company,
        current_amount: formData.current_amount,
        date_of_contract: date1,
        home_phone: formData.home_phone,
        job_title: formData.job_title,
        last_contact: date2,
        loan_type: formData.loan_type,
        mobile_phone: formData.mobile_phone,
        notes: notesText ? [notesText] : [],
        old_contact: formData.old_contact,
        property_order: formData.property_order,
        prospect_amount: formData.prospect_amount,
        rate: formData.rate,
        sale_price: formData.sale_price,
        sm_link: formData.sm_link,
        spouse: formData.spouse,
        state: formData.state,
        children: formData.children,
        subject_loan: formData.subject_loan,
        subject_price: formData.subject_price,
        zipcode: formData.zipcode,
        owner: email,
        },
    ])

    if (error) {
        console.error("Error inserting data:", error)
        alert("Failed to save client.")
        setOpenDialog(false);
        setFormData(initialFormData);
    } else {
        alert("Client saved successfully!")
        setFormData(initialFormData)
        setOpenDialog(false)
    }

    }

const [openDialog, setOpenDialog] = React.useState(false)

  

  return (
    <Dialog className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        open={openDialog}
        onOpenChange={(isOpen) => {
            setOpenDialog(isOpen)
            if (!isOpen) {
                setFormData(initialFormData)
            }
        }}>
      <DialogTrigger asChild>
        <Button
            variant="default"
            className="absolute top-5 right-5 px-4 py-2 bg-[#192659] text-white rounded hover:bg-[#394473]"
            >
            Add New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[900px] bg-gray-200 rounded-lg p-6 space-y-4 text-center flex flex-col items-center max-h-[90vh] overflow-y-auto">
        <DialogHeader className="">
            <DialogTitle className="text-center text-2xl font-bold">Add New Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* First row */}
            <div className="grid grid-cols-3 gap-4">
            <InputWithLabel id="first_name" label="First Name" value={formData.first_name} onChange={handleChange} />
            <InputWithLabel id="last_name" label="Last Name" value={formData.last_name} onChange={handleChange} />
            <SelectWithLabel id="status" label="Status" value={formData.status} onChange={handleChange} options={statusOptions} />
            </div>

            {/* Second row */}
            <div className="grid grid-cols-3 gap-4">
            <InputWithLabel id="home_phone" label="Home Phone" value={formData.home_phone} onChange={handleChange} />
            <InputWithLabel id="mobile_phone" label="Mobile Phone" value={formData.mobile_phone} onChange={handleChange} />
            <InputWithLabel id="email" label="Email" value={formData.email} onChange={handleChange} type="email" />
            </div>

            {/* Address row */}
            <div className="grid grid-cols-2 gap-4">
            <InputWithLabel id="address" label="Address" value={formData.address} onChange={handleChange} />
            <InputWithLabel id="city" label="City" value={formData.city} onChange={handleChange} />
            </div>

            {/* State and zip */}
            <div className="grid grid-cols-2 gap-4">
            <SelectWithLabel id="state" label="State" value={formData.state} onChange={handleChange} options={usStates} />
            <InputWithLabel id="zipcode" label="Zipcode" value={formData.zipcode} onChange={handleChange} />
            </div>

            {/* Spouse, children, co-borrower */}
            <div className="grid grid-cols-3 gap-4">
            <InputWithLabel id="spouse" label="Spouse" value={formData.spouse} onChange={handleChange} />
            <InputWithLabel id="children" label="Children" value={formData.children} onChange={handleChange} />
            <InputWithLabel id="co_borrower" label="Co-Borrower" value={formData.co_borrower} onChange={handleChange} />
            </div>

            {/* Amounts, contract date, rate */}
            <div className="grid grid-cols-4 gap-4">
            <InputWithLabel id="current_amount" label="Current Amount" value={formData.current_amount} onChange={handleChange} />
            <InputWithLabel id="prospect_amount" label="Prospect Amount" value={formData.prospect_amount} onChange={handleChange} />
            <DatePickerInput id="date_of_contract" label="Date of Contract" value={value1} onChange={setValue1} date={date1} setDate={setDate1} />
            <InputWithLabel id="rate" label="Rate" value={formData.rate} onChange={handleChange} />
            </div>

            {/* Loan type row */}
            <div className="grid grid-cols-4 gap-4">
            <InputWithLabel id="loan_type" label="Loan Type" value={formData.loan_type} onChange={handleChange} />
            <InputWithLabel id="sale_price" label="Sale Price" value={formData.sale_price} onChange={handleChange} />
            <InputWithLabel id="subject_price" label="Subject Price" value={formData.subject_price} onChange={handleChange} />
            <InputWithLabel id="subject_loan" label="Subject Loan" value={formData.subject_loan} onChange={handleChange} />
            </div>

            {/* Property info row */}
            <div className="grid grid-cols-4 gap-4">
            <SelectWithLabel id="property_order" label="Property Order" value={formData.property_order} onChange={handleChange} options={propertyOrderOptions} />
            <SelectWithLabel id="old_contact" label="Old Contact?" value={formData.old_contact} onChange={handleChange} options={oldContactOptions} />
            <DatePickerInput id="last_contact" label="Last Contact" value={value2} onChange={setValue2} date={date2} setDate={setDate2} />
            <InputWithLabel id="client_source" label="Client Source" value={formData.client_source} onChange={handleChange} />
            </div>

            {/* Company and job */}
            <div className="grid grid-cols-2 gap-4">
            <InputWithLabel id="company" label="Company" value={formData.company} onChange={handleChange} />
            <InputWithLabel id="job_title" label="Job Title" value={formData.job_title} onChange={handleChange} />
            </div>

            {/* Email and phone */}
            <div className="grid grid-cols-2 gap-4">
            <InputWithLabel id="business_email" label="Business Email" value={formData.business_email} onChange={handleChange} />
            <InputWithLabel id="business_phone" label="Business Phone" value={formData.business_phone} onChange={handleChange} />
            </div>

            {/* Business address and city */}
            <div className="grid grid-cols-2 gap-4">
            <InputWithLabel id="business_address" label="Business Address" value={formData.business_address} onChange={handleChange} />
            <InputWithLabel id="business_city" label="Business City" value={formData.business_city} onChange={handleChange} />
            </div>

            {/* Business state/zip/po */}
            <div className="grid grid-cols-3 gap-4">
            <SelectWithLabel id="business_state" label="Business State" value={formData.state} onChange={handleChange} options={usStates} />
            <InputWithLabel id="business_zip" label="Business Zipcode" value={formData.business_zip} onChange={handleChange} />
            <InputWithLabel id="business_address_po" label="Business PO Box" value={formData.business_address_po} onChange={handleChange} />
            </div>

            {/* SM link */}
            <div className="grid grid-cols-1">
            <InputWithLabel id="sm_link" label="SM Link" value={formData.sm_link} onChange={handleChange} />
            </div>

            {/* Notes */}
            <div className="flex flex-col">
                <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="rounded-md border border-gray-400 p-2 resize-vertical"
                    placeholder="Enter notes here..."
                />
                </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-4">

            <DialogClose asChild>
                <Button type="button" variant="secondary" className="hover:bg-gray-400">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="hover:bg-blue-900">Save</Button>
            </div>
        </form>
        </DialogContent>
    </Dialog>
  )
}