import { Link } from "react-router-dom"

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white p-6">
            <h1 className="text-xl font-semibold mb-8">Reminder App</h1>

            <nav className="flex flex-col gap-3">

                <Link
                    to="/"
                    className="px-3 py-2 rounded hover:bg-gray-800"
                >
                    Dashboard
                </Link>

                <Link
                    to="/clients"
                    className="px-3 py-2 rounded hover:bg-gray-800"
                >
                    Clients
                </Link>

                <Link
                    to="/appointments"
                    className="px-3 py-2 rounded hover:bg-gray-800"
                >
                    Appointments
                </Link>

                <Link
                    to="/templates"
                    className="px-3 py-2 rounded hover:bg-gray-800"
                >
                    Templates
                </Link>

            </nav>
        </aside>
    )
}