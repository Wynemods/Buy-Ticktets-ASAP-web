import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import components
import HomePage from './components/HomePage'
import PaymentPage from './components/PaymentPage'
import FlightConfigGenerator from './components/FlightConfig'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main>
          <Routes>
            <Route path="/" element={<FlightConfigGenerator />} />
            <Route path="/bookings" element={<HomePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

