import { Search } from 'lucide-react'

export const SearchBar = () => {
  return (
    <div className="w-full flex items-center border border-gray-300 rounded-md py-2 px-2">
        <button className="mr-2 text-gray-400">
        <Search size={16} />
      </button>
      <input
        type="text"
        placeholder="Search Vendors..."
        className="w-full outline-0 text-gray-600 text-[14px] "
      />
    </div>
  )
}
