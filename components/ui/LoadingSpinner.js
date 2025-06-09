// components/ui/LoadingSpinner.js

export default function LoadingSpinner() {
    return (
        <div
            className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"
            role="status"
            aria-label="Loading"
        />
    );
}
