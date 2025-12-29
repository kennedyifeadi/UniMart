import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const SearchBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initial = location.pathname.startsWith('/vendors') ? (params.get('q') ?? '') : ''
  const [q, setQ] = useState(initial)

  useEffect(() => {
    // keep input in sync when user navigates to /vendors with a q param
    if (location.pathname.startsWith('/vendors')) {
      const p = new URLSearchParams(location.search)
      setQ(p.get('q') ?? '')
    }
  }, [location.pathname, location.search])

  const submit = (term?: string) => {
    const query = (term ?? q).trim()
    if (!query) {
      navigate('/vendors')
      return
    }
    navigate(`/vendors?q=${encodeURIComponent(query)}`)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="w-full"
    >
      <div className="w-full flex items-center border border-gray-300 rounded-md py-2 px-2">
        <button type="submit" aria-label="Search vendors" className="mr-2 text-gray-400">
          <Search size={16} />
        </button>
        <input
          type="text"
          placeholder="Search vendors..."
          className="w-full outline-0 text-gray-600 text-[14px]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setQ('')
          }}
        />
      </div>
    </form>
  )
}
