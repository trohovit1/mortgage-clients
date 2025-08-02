// import React from 'react'
import { useNavigate } from 'react-router-dom'
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "./components/ui/table"
import {DataTableDemo} from "./DataTable"

function MasterDatabase() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <h1 className="text-3xl font-semibold mb-8 text-foreground">
        Master Client Database
      </h1>

      <div className="w-full max-w-5xl bg-card rounded-xl shadow-md p-6 mb-10 text-card-foreground">
        <DataTableDemo />
      </div>

      <button
        onClick={() => navigate("/mortgage-clients")}
        className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition"
      >
        Back
      </button>
    </div>
  )
}

export default MasterDatabase
