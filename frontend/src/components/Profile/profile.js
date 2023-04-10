import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate ,useLocation} from 'react-router-dom'
import { Loader } from '../Loader/loader'
import { GrMail } from 'react-icons/gr';
import {TbTruckDelivery} from 'react-icons/tb';
import { FaUserAlt,FaShoppingCart } from 'react-icons/fa';
import {AiFillSetting} from 'react-icons/ai';
import {SiSellfy} from 'react-icons/si'

import { MyOrders } from '../MyOrders/myOrders';
import { ShippingInfo } from '../ShippingInfo/shippingInfo';
import { Settings } from '../Settings/settings';
import { SellWithUs } from '../SellWithUs/sellWithUs';
import { ToastContainer, toast } from 'react-toastify';

import './profile.css'

export const Profile = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [active, setActive]=useState(useLocation().state.comp);

  const getUserData = async () => {
    await axios.get('/api/v2/profile').then((response) => {
      setUser(response.data[0]);
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem('Auth Token');
      localStorage.removeItem('UserId');
    })
  }

  const handleLogOut = async () => {
    localStorage.removeItem('UserId');
    localStorage.removeItem('Auth Token');
    await axios.get('/api/v2/logoutUser').then((response) => {
      console.log(response);
      navigate('/signIn');
    }).then((error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    const userId = localStorage.getItem('UserId');
    if (userId === null)
      navigate('/signIn');
    else {
      getUserData();
    }

  }, [])

  return (

    <div className='profile_page'>
     
      {
        user !== null ?
          <>
            <div className='navigation_area'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-Start', width: '85%' }}>
                <FaUserAlt style={{ fontSize: '1.4rem',width:'10%'}} />
                <h3 style={{marginLeft:'15%'}}>{user.name}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-Start', width: '85%'}}>
                <GrMail style={{ fontSize: '1.4rem',width:'10%' }} />
                <h3 style={{marginLeft:'3rem'}}>{user.email}</h3>
              </div>

              <div className='user_options_area'>
                <div onClick={()=>setActive('Orders')} style={{color:active==='Orders'?'#f9f6ee':'',borderColor:active==='Orders'?'#f9f6ee':''}}>
                  <FaShoppingCart style={{color:active==='Orders'?'#f9f6ee':'rgba(255,255,255,0.6)',fontSize:'1.8rem'}}/>
                  <p>My orders</p>
                </div>
                <div onClick={()=>setActive('Shipping')} style={{color:active==='Shipping'?'#f9f6ee':'',borderColor:active==='Shipping'?'#f9f6ee':''}}>
                <TbTruckDelivery style={{color:active==='Shipping'?'#f9f6ee':'rgba(255,255,255,0.6)',fontSize:'2rem',marginLeft:'1rem'}}/>
                <p>Shipping details</p>
                </div>
                <div onClick={()=>setActive("Settings")} style={{color:active==='Settings'?'#f9f6ee':'',borderColor:active==='Settings'?'#f9f6ee':''}}>
                <AiFillSetting style={{color:active==='Settings'?'#f9f6ee':'rgba(255,255,255,0.6)',fontSize:'1.8rem',marginRight:'0.8rem'}}/>
                <p>Settings</p>
                </div>
                <div onClick={()=>setActive("SellWithUs")} style={{color:active==='SellWithUs'?'#f9f6ee':'',borderColor:active==='SellWithUs'?'#f9f6ee':''}}>
                <SiSellfy style={{color:active==='SellWithUs'?'#f9f6ee':'rgba(255,255,255,0.6)',fontSize:'1.8rem',marginLeft:'0.3rem'}}/>
                <p>Sell with us</p>
                </div>
              </div>
              <button className='logoutButton' onClick={handleLogOut}>Logout</button>
            </div>
            <div className='main_area'>
              {active==='Orders'?<MyOrders/>:active==="Shipping"?<ShippingInfo/>:active==="Settings"?<Settings user={user}/>:active==="SellWithUs"?<SellWithUs/>:<></>}
            </div>
          </>
          :
          <>
            <Loader />
          </>
      }

    </div>
  )
}

