import Product from './components/product/Product'
import './App.css'

function App() {

  return (
    <>
      <Product product={{
        "productId": "2",
        "name": "Product 2",
        "price": 20000,
        "description": "Product 2 description",
        "image": "https://via.placeholder.com/150",
        "unitsInStock": 20
      }} />
    </>
  )
}

export default App
