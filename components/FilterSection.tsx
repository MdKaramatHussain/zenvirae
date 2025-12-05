'use client'

import { CATEGORIES as categories  } from '@/constants'
import React from 'react'

interface Props {
  category: string
  minPrice?: number | ''
  maxPrice?: number | ''
  onCategoryChange: (c: string) => void
  onMinChange: (v: number | '') => void
  onMaxChange: (v: number | '') => void
}

export default function FilterSection({ category, minPrice, maxPrice, onCategoryChange, onMinChange, onMaxChange }: Props) {
  return (
    <div className="w-full md:w-64 space-y-3">
      <div>
        <label className="text-xs font-medium mb-1 block">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium mb-1 block">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ?? ''}
            onChange={(e) => onMinChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-1/2 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ''}
            onChange={(e) => onMaxChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-1/2 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
