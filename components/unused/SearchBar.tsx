'use client'

import React from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
}

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  return (
    <div className="w-full">
      <label className="relative block w-full">
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit && onSubmit() } }}
          placeholder="Search products, categories, titles..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
    </div>
  )
}
