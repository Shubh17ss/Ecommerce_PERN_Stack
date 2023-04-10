import React,{useContext, useEffect, useState} from 'react'
import { Context } from '../../Context/context';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaShoppingCart,FaSearch } from 'react-icons/fa';
import './header.css';

export const Header = () => {
  const {cart}=useContext(Context);
  const location=useLocation().pathname;
  const [activePage, setActivePage]=useState('/');

  useEffect(()=>{
    setActivePage(location);
  },[location])
  
  return (
    <div className='navbar_container'>
      <h1 style={{color:'crimson',fontSize:'3rem',margin:0,marginLeft:'3rem',filter:'contrast(3px)'}}>itra</h1>
      <div className='links_container'>
        <Link to="/" style={{ textDecoration: 'none'}}>
          <h3 style={{backgroundColor:activePage==='/'?'crimson':''}}>Home</h3>
        </Link>
        <Link to="/products/page/1" style={{ textDecoration: 'none', color: '#000' }}>
          <h3  style={{backgroundColor:activePage==='/products'?'crimson':''}}>Products</h3>
        </Link>
        <Link to="/about" style={{ textDecoration: 'none', color: '#000' }}>
          <h3>About</h3>
        </Link>
        <Link to="/contact" style={{ textDecoration: 'none', color: '#000' }}>
          <h3>Contact</h3>
        </Link>

        <div className='icons_container'>
          <Link to="/cart" style={{ backgroundColor:activePage==='/cart'?'crimson':'' }}  className='icon_links'>
            <p style={{color:'#fff ',position:'absolute',top:5,right:'6.4%',margin:'1rem'}}>{cart.length>0 ? cart.length:''}</p>
            <FaShoppingCart style={{width:'1.2rem',height:'1.2rem',paddingRight:'1rem'}} color='rgba(255,255,255,0.9)'/>
          </Link>
          <Link to="/profile" state={{comp:'Orders'}} style={{backgroundColor:activePage==='/profile'?'crimson':'' }}  className='icon_links'>
            <FaUserAlt style={{width:'1.2rem',height:'1.2rem'}} color='rgba(255,255,255,0.9)'/>
          </Link>
        </div>
      </div>
    </div>
  )
}

