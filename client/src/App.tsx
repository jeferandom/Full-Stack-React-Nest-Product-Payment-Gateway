import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import SingleProductPage from './pages/SingleProductPage.tsx'
import PaymentFormPage from './pages/PaymentFormPage.tsx'
import OrderSummaryPage from './pages/OrderSummaryPage.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/product/:productId" element={<SingleProductPage />} />
          <Route path="/payment-form" element={<PaymentFormPage />} />          
          <Route path="/order-summary" element={<OrderSummaryPage />} />          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
