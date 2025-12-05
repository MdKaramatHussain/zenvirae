import SearchPage from "@/components/search"

interface PageProps {
  searchParams: Promise<{ query?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { query } = await searchParams  
  const queryString = query ?? ""
  return <SearchPage queryParams={queryString} />
}