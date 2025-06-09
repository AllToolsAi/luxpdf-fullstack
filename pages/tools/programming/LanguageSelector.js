import { useId, memo } from 'react';

function LanguageSelector({ value, onChange, languages, label }) {
    const id = useId(); // generates a unique id for label and select

    return (
        <div className="flex items-center space-x-2">
            <label
                htmlFor={id}
                className="font-medium text-gray-900 dark:text-gray-100 select-none"
            >
                {label}:
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                title={`Select ${label} language`}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            >
                {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default memo(LanguageSelector);
