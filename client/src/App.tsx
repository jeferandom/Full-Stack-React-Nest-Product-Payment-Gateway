import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import SingleProductPage from './pages/SingleProductPage.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/product/:productId" element={<SingleProductPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
