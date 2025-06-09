import { FiSearch } from 'react-icons/fi';

export default function SearchTools() {
    return (
        <div className="relative max-w-md mx-auto mb-12">
            <input
                type="text"
                placeholder="Search 50+ tools..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute right-3 top-3.5 text-gray-400" />
        </div>
    );
}
