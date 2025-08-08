import React, { useState } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import './App.css'

export function InputWithLabel({ id, label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <input id={id} name={id} value={value} onChange={onChange} type={type}
       className="w-full rounded-md border border-gray-300 p-2"/>
    </div>
  )
}

export function SelectWithLabel({ id, label, value, onChange, options }) {
  return (
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}


export function DatePickerInput({ id, label, value, onChange, date, setDate }) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState(date || new Date())

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex">
            <Input
              id={id}
              value={value}
              placeholder="MM/DD/YYYY"
              onChange={(e) => {
                const newDate = new Date(e.target.value)
                onChange(e.target.value)
                if (isValidDate(newDate)) {
                  setDate(newDate)
                  setMonth(newDate)
                }
              }}
              onFocus={() => setOpen(true)}  // open on focus
              className="pr-10"
              type={undefined}
            />
            <Button type="button" variant="ghost" className="absolute top-1/2 right-2 transform -translate-y-1/2 size-6" aria-label="Toggle calendar">
              <CalendarIcon className="size-4" />
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              onChange(formatDate(selectedDate))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function formatDate(date: Date | undefined) {
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