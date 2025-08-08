import { StringifyOptions } from "node:querystring"

export type Client = {
  id: number
  status: 'Customer' | 'Active Prospect' | 'Prospect' | 'New Contact' | ''
  first_name: string
  last_name: string
  co_borrower: string
  address: string
  city: string
  state: string
  zipcode: string
  old_contact: string
  email: string
  home_phone: string
  mobile_phone: string
  property_order: number
  spouse: string
  children: string
  current_amount: number
  prospect_amount: number
  rate: number
  date_of_contract: string
  loan_type: string 
  last_contact: string 
  sale_price: number
  subject_price: number
  subject_loan: number 
  client_source: string
  business_phone: string 
  business_email: string
  company: string 
  job_title: string 
  business_address: string
  business_address_po: string
  business_city: string
  business_state: string
  business_zip: string 
  sm_link: string
  notes: string[]
}

// export const mockClients: Client[] = [
//   {
//     id: '1',
//     name: 'John Doe',
//     address: '123 Main St, Springfield, IL',
//     phone: '555-1234',
//     contact_type: 'email',
//     status: 'current',
//     email: 'john@example.com',
//     contact_history: ['2024-01-15', '2024-05-02'],
//     current_amount: 150000,
//     prospect_amount: 0,
//     rate: 3.75,
//     date_of_contract: '2024-06-01',
//     client_source: 'real estate agent',
//     notes: ['Great credit score', 'Prefers email communication'],
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     address: '456 Oak Ave, Denver, CO',
//     phone: '555-9876',
//     contact_type: 'phone',
//     status: 'prospect',
//     email: 'jane@example.com',
//     contact_history: ['2024-07-10'],
//     current_amount: 0,
//     prospect_amount: 250000,
//     rate: 4.25,
//     date_of_contract: '2024-08-15',
//     client_source: 'digital media',
//     notes: ['Needs follow-up call next week'],
//   },
//   {
//     id: '3',
//     name: 'Robert Johnson',
//     address: '789 Pine Ln, Austin, TX',
//     phone: '555-3210',
//     contact_type: 'in person',
//     status: 'inactive',
//     email: 'rob.j@example.com',
//     contact_history: ['2023-12-01'],
//     current_amount: 0,
//     prospect_amount: 0,
//     rate: 0,
//     date_of_contract: '2023-01-10',
//     client_source: 'mass marketing',
//     notes: ['Moved to another state'],
//   },
//   {
//     id: '4',
//     name: 'Emily Nguyen',
//     address: '102 Cherry Dr, Portland, OR',
//     phone: '555-4567',
//     contact_type: 'real estate listing',
//     status: 'actively pursuing',
//     email: 'emily.nguyen@example.com',
//     contact_history: ['2024-07-01', '2024-07-20'],
//     current_amount: 0,
//     prospect_amount: 300000,
//     rate: 3.95,
//     date_of_contract: '2024-07-22',
//     client_source: 'real estate listing',
//     notes: ['Interested in quick close'],
//   },
//   {
//     id: '5',
//     name: 'Carlos Ramirez',
//     address: '555 Sunset Blvd, Los Angeles, CA',
//     phone: '555-0000',
//     contact_type: 'digital media',
//     status: 'current',
//     email: 'carlos.r@example.com',
//     contact_history: ['2024-02-10'],
//     current_amount: 400000,
//     prospect_amount: 0,
//     rate: 4.0,
//     date_of_contract: '2024-03-01',
//     client_source: 'digital media',
//     notes: ['Wants refi next year'],
//   },
//   {
//     id: '6',
//     name: 'Angela Brooks',
//     address: '88 Hilltop Rd, Seattle, WA',
//     phone: '555-7890',
//     contact_type: 'phone',
//     status: 'current',
//     email: 'angela.brooks@example.com',
//     contact_history: ['2024-06-05', '2024-06-20'],
//     current_amount: 220000,
//     prospect_amount: 0,
//     rate: 3.9,
//     date_of_contract: '2024-06-25',
//     client_source: 'real estate agent',
//     notes: ['Prefers late afternoon calls'],
//   },
//   {
//     id: '7',
//     name: 'David Kim',
//     address: '302 Green St, Boston, MA',
//     phone: '555-2233',
//     contact_type: 'email',
//     status: 'prospect',
//     email: 'david.kim@example.com',
//     contact_history: ['2024-07-01'],
//     current_amount: 0,
//     prospect_amount: 275000,
//     rate: 4.1,
//     date_of_contract: '2024-08-01',
//     client_source: 'mass marketing',
//     notes: ['Requested additional loan options'],
//   },
//   {
//     id: '8',
//     name: 'Lisa Chen',
//     address: '900 Market St, San Francisco, CA',
//     phone: '555-6677',
//     contact_type: 'in person',
//     status: 'actively pursuing',
//     email: 'lisa.chen@example.com',
//     contact_history: ['2024-07-18', '2024-07-25'],
//     current_amount: 0,
//     prospect_amount: 325000,
//     rate: 4.3,
//     date_of_contract: '2024-07-30',
//     client_source: 'digital media',
//     notes: ['Walk-in client', 'Very interested'],
//   },
//   {
//     id: '9',
//     name: 'Mark Lee',
//     address: '10 Bayview Dr, Miami, FL',
//     phone: '555-4444',
//     contact_type: 'real estate agent',
//     status: 'current',
//     email: 'mark.lee@example.com',
//     contact_history: ['2024-03-01', '2024-06-10'],
//     current_amount: 375000,
//     prospect_amount: 0,
//     rate: 3.85,
//     date_of_contract: '2024-06-12',
//     client_source: 'real estate agent',
//     notes: ['Smooth approval process'],
//   },
//   {
//     id: '10',
//     name: 'Sophia Patel',
//     address: '741 Forest Ln, Phoenix, AZ',
//     phone: '555-8822',
//     contact_type: 'email',
//     status: 'inactive',
//     email: 'sophia.patel@example.com',
//     contact_history: ['2023-11-15'],
//     current_amount: 0,
//     prospect_amount: 0,
//     rate: 0,
//     date_of_contract: '2023-11-20',
//     client_source: 'mass marketing',
//     notes: ['No response after initial contact'],
//   }
// ]
