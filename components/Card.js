// components/Card.js
export default function Card({ title, description, icon }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg
      transition-shadow border border-gray-100">
            <div className="text-primary text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray">{description}</p>
        </div>
    )
}