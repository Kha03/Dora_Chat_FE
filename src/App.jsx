import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import LoginPage from "./page/LoginPage"
import SignUpPage from "./page/SignUpStep1Page"
import HomePage from "./page/HomePage"
import SignUpStep2Page from "./page/SignUpStep2Page"
import { ToastContainer } from "react-toastify"
import SignUpStep3Page from "./page/SignUpStep3Page"
import SignUpStep4Page from "./page/SignUpStep4Page"

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/otp" element={<SignUpStep2Page />} />
        <Route path="/signup/info" element={<SignUpStep3Page />} />
        <Route path="/signup/complete" element={<SignUpStep4Page />} />
        <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App