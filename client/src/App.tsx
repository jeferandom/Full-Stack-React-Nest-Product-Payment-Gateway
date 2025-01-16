import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import SingleProductPage from './pages/SingleProductPage.tsx'
import PaymentFormPage from './pages/PaymentFormPage.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/product/:productId" element={<SingleProductPage />} />
          <Route path="/payment-form" element={<PaymentFormPage />} />          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
