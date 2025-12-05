'use client'

import { sortOptions } from '@/constants'
import React from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="w-full md:w-48">
      <label className="text-xs font-medium mb-1 block">Sort</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        {sortOptions.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
    </div>
  )
}
