// components/Button.js
export default function Button({ children }) {
    return (
        <button className="bg-primary hover:bg-secondary text-white
      px-6 py-3 rounded-lg font-medium transition-colors
      shadow-md hover:shadow-lg">
            {children}
        </button>
    )
}