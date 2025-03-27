import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import Plots from "./pages/Plots";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/plots" element={<Plots />} />
            </Routes>
          </main>
        </div>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
