import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Outlet } from "react-router-dom"


export default function AppLayout() {
    return (
        <div className="flex h-screen bg-gray-100">

            <Sidebar />

            <div className="flex flex-col flex-1">

                <Header />

                <main className="p-6 overflow-y-auto">
                    {<Outlet />}
                </main>

            </div>
        </div>
    )
}