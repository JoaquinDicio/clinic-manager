import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Templates from "./pages/Templates";
import Schedules from "./pages/Schedules";
import AppLayout from "./layout/AppLayout";
import Doctors from "./pages/Doctors";
import Treatments from "./pages/Treatments";
import Whatsapp from "./pages/Whatsapp";
import RequireWhatsapp from "./components/RequireWhatsapp";
import { WhatsappStatusProvider } from "./components/WhatsappStatusProvider";

function App() {
  return (
    <BrowserRouter>
      <WhatsappStatusProvider>
        <Routes>
          <Route path="/whatsapp" element={<Whatsapp />} />
          <Route
            element={
              <RequireWhatsapp>
                <AppLayout />
              </RequireWhatsapp>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/treatments" element={<Treatments />} />
          </Route>
        </Routes>
      </WhatsappStatusProvider>
    </BrowserRouter>
  );
}

export default App;
