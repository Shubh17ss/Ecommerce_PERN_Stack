import './App.css';
import React, { useEffect} from 'react';
import { Header } from './components/Header/header';
import { Footer } from './components/Footer/footer';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import WebFont from 'webfontloader';
import { Provider } from './Context/context';
import { Home } from './components/Home/home';
import { Products } from './components/Products/products';
import { ProductInfo } from './components/ProductInfo/productInfo';
import { Cart } from './components/Cart/cart';
import { Checkout } from './components/Checkout/checkout';
import { Profile } from './components/Profile/profile';
import { SignIn } from './components/SignIn/signIn';
import { AdminPanel } from './components/Admin/adminPanel';
import { NotFound } from './components/NotFound/notFound';


function App() {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Lato"]
      }
    })
  }, [])

  console.log('IN app js component',window.location.href);

  return (
    <div className="App">
      <Router>
        <Provider>
        {window.location.href!=="http://localhost:3000/admin_panel"?<Header />:<></>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/page/:value" element={<Products />} />
            <Route path="/products/productdetails/:id" element={<ProductInfo/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/signIn" element={<SignIn/>}/>
            <Route path="*" element={<NotFound/>}/>

            <Route path="/admin_panel" element={<AdminPanel/>}/>
          </Routes>
        </Provider>
        {window.location.href!=="http://localhost:3000/admin_panel"?<Footer />:<></>}
      </Router>
    </div>
  );
}

export default App;
