'use client'

import { useEffect, useMemo, useState } from 'react'
import FilterSection from '@/components/FilterSection'
import SortDropdown from '@/components/SortDropdown'
import { allProducts } from '@/constants'
import { ProductCard } from '@/components/product-card'

export default function SearchPage({queryParams}:{queryParams: string}) {
    const [category, setCategory] = useState('All')
    const [minPrice, setMinPrice] = useState<number | ''>('')
    const [maxPrice, setMaxPrice] = useState<number | ''>('')
    const [sort, setSort] = useState('price-asc')
    const [loading, setLoading] = useState(false)

    const query = queryParams || ''
    // debounce loading state to show skeleton for quick queries
    useEffect(() => {
        setLoading(true)
        const id = setTimeout(() => setLoading(false), 220)
        return () => clearTimeout(id)
    }, [query, category, minPrice, maxPrice, sort])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()

        let list = allProducts.filter((p) => {
            // category filter
            if (category && category !== 'All' && p.category !== category) return false

            // price filter
            if (minPrice !== '' && p.price < Number(minPrice)) return false
            if (maxPrice !== '' && p.price > Number(maxPrice)) return false

            // search across title, description, category
            if (!q) return true
            if (p.title.toLowerCase().includes(q)) return true
            if (p.description.toLowerCase().includes(q)) return true
            if (p.category.toLowerCase() === q) return true
            // const flag = `${p.title} ${p.description} ${p.category}`.toLowerCase()
            // return flag.includes(q)
            return false
        })

        // sorting
        switch (sort) {
            case 'price-asc':
                list = list.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                list = list.sort((a, b) => b.price - a.price)
                break
            case 'newest':
                list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case 'popularity':
                list = list.sort((a, b) => b.popularity - a.popularity)
                break
            default:
                break
        }

        return list
    }, [query, category, minPrice, maxPrice, sort])

    return (
        <div className="min-h-screen w-full bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="w-full md:w-64 sticky top-24">
                        <FilterSection
                            category={category}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onCategoryChange={setCategory}
                            onMinChange={setMinPrice}
                            onMaxChange={setMaxPrice}
                        />
                    </div>

                    <div className="flex-1 w-full">
                        {/* <div className="mb-4">
                            <SearchBar value={query} onChange={setQuery} />
                        </div> */}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="text-sm text-muted-foreground">{filtered.length} results</div>
                            <SortDropdown value={sort} onChange={setSort} />
                        </div>

                        <div className="w-full">
                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="animate-pulse bg-muted rounded-md h-52" />
                                    ))}
                                </div>
                            ) : (
                                // <ProductGrid items={filtered} />
                                filtered?.length === 0 ? (
                                    <div className="w-full py-16 flex flex-col items-center justify-center">
                                        <p className="text-muted-foreground">No results found. Try adjusting filters or search.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
                                        {filtered.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
