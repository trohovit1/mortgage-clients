import React, { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./components/ui/dialog"  // Adjust path to your Dialog components
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { useUser } from "@clerk/clerk-react"
import { supabase } from './supabase'
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import './App.css'


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
  status: 'Customer' | 'Active Prospect' | 'Prospect' | 'New Contact'
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
  status: "New Contact",
  subject_loan: 0,
  subject_price: 0,
  zipcode: "",
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function ClientFormDialog() {
    const { user } = useUser()
  const [formData, setFormData] = useState<ClientFormData>(initialFormData)
  const [open1, setOpen1] = React.useState(false)
  const [date1, setDate1] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  )
  const [month1, setMonth1] = React.useState<Date | undefined>(date1)
  const [value1, setValue1] = React.useState(formatDate(date1))
  const [open2, setOpen2] = React.useState(false)
  const [date2, setDate2] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  )
  const [month2, setMonth2] = React.useState<Date | undefined>(date1)
  const [value2, setValue2] = React.useState(formatDate(date1))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: handle submit logic here, e.g., API call or state update
    if (!user?.primaryEmailAddress?.emailAddress) return

    const email = user.primaryEmailAddress.emailAddress

    const { data: existingClients, error: fetchError } = await supabase
        .from("clients")
        .select("id")  // Just need the id to check existence
        .eq("first_name", formData.first_name)
        .eq("last_name", formData.last_name)
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
        notes: formData.notes,
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
        setFormData(initialFormData) // reset form
    }

    }

const [openDialog, setOpenDialog] = React.useState(false)

  

  return (
    <Dialog className="max-h-[90vh] overflow-y-auto bg-blue-50" style={{ maxHeight: '90vh', overflowY: 'auto', backgroundColor: "#f5faff" }}
        open={openDialog}
        onOpenChange={(isOpen) => {
            setOpenDialog(isOpen)
            if (!isOpen) {
                setFormData(initialFormData) // 👈 Reset form
                // setValue1("") // optional: reset date text input
                // setValue2("")
                // setDate1(undefined)
                // setDate2(undefined)
            }
        }}>
      <DialogTrigger asChild>
        <Button variant={"default"} style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '10px 16px',
          backgroundColor: 'darkblue',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}>Add New Client</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Add New Client</DialogTitle>
          <DialogDescription className={undefined}>Fill in the client information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name" className={undefined}>First Name</Label>
              <Input
                              id="first_name"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name" className={undefined}>Last Name</Label>
              <Input
                              id="last_name"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="co_borrower" className={undefined}>Co Borrower Name</Label>
              <Input
                              id="co_borrower"
                              name="co_borrower"
                              value={formData.co_borrower}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className={undefined}>Email</Label>
              <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange} className={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status" className={undefined}>Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-md border px-3 py-2"
              >
                <option value="Active Prospect">Active Prospect</option>
                <option value="Customer">Customer</option>
                <option value="New Contact">New Contact</option>
                <option value="Prospect">Prospect</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className={undefined}>Address</Label>
              <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city" className={undefined}>City</Label>
              <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state" className={undefined}>State</Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="rounded-md border px-3 py-2"
              >
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DC">DC</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="IA">IA</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="ME">ME</option>
                <option value="MD">MD</option>
                <option value="MA">MA</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MS">MS</option>
                <option value="MO">MO</option>
                <option value="MT">MT</option>
                <option value="NE">NE</option>
                <option value="NV">NV</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NY">NY</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WV">WV</option>
                <option value="WI">WI</option>
                <option value="WY">WY</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zipcode" className={undefined}>Zipcode</Label>
              <Input
                              id="zipcode"
                              name="zipcode"
                              value={formData.zipcode}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="old_contact" className={undefined}>Old Contact?</Label>
              <select
                id="old_contact"
                name="old_contact"
                value={formData.old_contact}
                onChange={handleChange}
                className="rounded-md border px-3 py-2"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="home_phone" className={undefined}>Home Phone</Label>
              <Input
                              id="home_phone"
                              name="home_phone"
                              value={formData.home_phone}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile_phone" className={undefined}>Mobile Phone</Label>
              <Input
                              id="mobile_phone"
                              name="mobile_phone"
                              value={formData.mobile_phone}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="property_order" className={undefined}>Property Order</Label>
              <select
                id="property_order"
                name="property_order"
                value={formData.property_order}
                onChange={handleChange}
                className="rounded-md border px-3 py-2"
              >
                <option value='1'>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="spouse" className={undefined}>Spouse</Label>
              <Input
                              id="spouse"
                              name="spouse"
                              value={formData.spouse}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="children" className={undefined}>Children</Label>
              <Input
                              id="children"
                              name="children"
                              value={formData.children}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current_amount" className={undefined}>Current Amount</Label>
              <Input
                              id="current_amount"
                              name="current_amount"
                              value={formData.current_amount}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prospect_amount" className={undefined}>Prospect Amount</Label>
              <Input
                              id="prospect_amount"
                              name="prospect_amount"
                              value={formData.prospect_amount}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rate" className={undefined}>Rate</Label>
              <Input
                              id="rate"
                              name="rate"
                              value={formData.rate}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date_of_contract" className={undefined}>Date Of Contract</Label>
              <div className="flex flex-col gap-3">
                    <Input
                                  id="date_of_contract"
                                  value={value1}
                                  placeholder="June 01, 2025"
                                  className="bg-background pr-10"
                                  onChange={(e) => {
                                      const date = new Date(e.target.value)
                                      setValue1(e.target.value)
                                      if (isValidDate(date)) {
                                          setDate1(date)
                                          setMonth1(date)
                                      }
                                  } }
                                  onKeyDown={(e) => {
                                      if (e.key === "ArrowDown") {
                                          e.preventDefault()
                                          setOpen1(true)
                                      }
                                  } } type={undefined}                    />
                    <Popover open={open1} onOpenChange={setOpen1}>
                    <PopoverTrigger asChild>
                        <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                        mode="single"
                        selected={date1}
                        captionLayout="dropdown"
                        month={month1}
                        onMonthChange={setMonth1}
                        onSelect={(date) => {
                            setDate1(date)
                            setValue1(formatDate(date))
                            setOpen1(false)
                        }}
                        />
                    </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_contact" className={undefined}>Last Contact</Label>
              <div className="flex flex-col gap-3">
                    <Input
                                  id="last_contact"
                                  value={value2}
                                  placeholder="June 01, 2025"
                                  className="bg-background pr-10"
                                  onChange={(e) => {
                                      const date = new Date(e.target.value)
                                      setValue2(e.target.value)
                                      if (isValidDate(date)) {
                                          setDate2(date)
                                          setMonth2(date)
                                      }
                                  } }
                                  onKeyDown={(e) => {
                                      if (e.key === "ArrowDown") {
                                          e.preventDefault()
                                          setOpen2(true)
                                      }
                                  } } type={undefined}                    />
                    <Popover open={open2} onOpenChange={setOpen2}>
                    <PopoverTrigger asChild>
                        <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                        mode="single"
                        selected={date2}
                        captionLayout="dropdown"
                        month={month2}
                        onMonthChange={setMonth2}
                        onSelect={(date) => {
                            setDate2(date)
                            setValue2(formatDate(date))
                            setOpen2(false)
                        }}
                        />
                    </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loan_type" className={undefined}>Loan Type</Label>
              <Input
                              id="loan_type"
                              name="loan_type"
                              value={formData.loan_type}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sale_price" className={undefined}>Sale Price</Label>
              <Input
                              id="sale_price"
                              name="sale_price"
                              value={formData.sale_price}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject_price" className={undefined}>Subject Price</Label>
              <Input
                              id="subject_price"
                              name="subject_price"
                              value={formData.subject_price}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject_loan" className={undefined}>Subject Loan</Label>
              <Input
                              id="subject_loan"
                              name="subject_Loan"
                              value={formData.subject_loan}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_source" className={undefined}>Client Source</Label>
              <Input
                              id="client_source"
                              name="client_source"
                              value={formData.client_source}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business_phone" className={undefined}>Business Phone</Label>
              <Input
                              id="business_phone"
                              name="business_phone"
                              value={formData.business_phone}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business_email" className={undefined}>Business Email</Label>
              <Input
                              id="business_email"
                              name="business_email"
                              value={formData.business_email}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company" className={undefined}>Company</Label>
              <Input
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job_title" className={undefined}>Job Title</Label>
              <Input
                              id="job_title"
                              name="job_title"
                              value={formData.job_title}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business_address" className={undefined}>Business Address</Label>
              <Input
                              id="business_address"
                              name="business_address"
                              value={formData.business_address}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business_address_po" className={undefined}>Business Address PO</Label>
              <Input
                              id="business_address_po"
                              name="business_address_po"
                              value={formData.business_address_po}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business_city" className={undefined}>Business City</Label>
              <Input
                              id="business_city"
                              name="business_city"
                              value={formData.business_city}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business_state" className={undefined}>Business State</Label>
              <select
                id="business_state"
                name="business_state"
                value={formData.business_state}
                onChange={handleChange}
                className="rounded-md border px-3 py-2"
              >
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DC">DC</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="IA">IA</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="ME">ME</option>
                <option value="MD">MD</option>
                <option value="MA">MA</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MS">MS</option>
                <option value="MO">MO</option>
                <option value="MT">MT</option>
                <option value="NE">NE</option>
                <option value="NV">NV</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NY">NY</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WV">WV</option>
                <option value="WI">WI</option>
                <option value="WY">WY</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business_zip" className={undefined}>Business Zipcode</Label>
              <Input
                              id="business_zip"
                              name="business_zip"
                              value={formData.business_zip}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sm_link" className={undefined}>SM Link</Label>
              <Input
                              id="sm_link"
                              name="sm_link"
                              value={formData.sm_link}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="notes" className={undefined}>Notes</Label>
              <Input
                              id="notes"
                              name="notes"
                              value={formData.notes}
                              onChange={handleChange} className={undefined} type={undefined}              />
            </div> */}
          </div>
          <DialogFooter className={undefined}>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
