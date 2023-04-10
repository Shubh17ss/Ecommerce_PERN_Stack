import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './adminPanel.css'
import { MdSpaceDashboard, MdEmail } from 'react-icons/md';
import { IoIosWallet } from 'react-icons/io';
import { FaUsers } from 'react-icons/fa';
import {RiLuggageCartLine} from 'react-icons/ri';
import { GiSettingsKnobs } from 'react-icons/gi';
import Lottie from 'lottie-react';
import UnAuthorizedAnimation from '../../assets/animations/Unauthorized_access.json';

import { Orders } from './orders';
import { Users } from './users';
import { Products } from './products';

export const AdminPanel = () => {

  const [access, setAccess] = useState(false);
  const [active, setActive] = useState('Orders');

  const isUserAdmin = async () => {
    axios.get('/api/v2/profile').then((response) => {
      if (response.data[0].role === "admin") {
        setAccess(true);
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    isUserAdmin();
  }, [])

  return (
    <>
      {
        access ?
          <div className='admin_panel_page'>

            <div className='navigation_area'>
              <h1 style={{ marginTop: '1rem', fontSize: '1.5rem', color: ' rgba(202, 43, 75, 0.683)' }}>Itra</h1>
              <div className='profile_section'>
                <img src='https://avatars.githubusercontent.com/u/74175165?v=4' alt='/' />
                <h3 style={{ fontSize: '0.9rem' }}>Shubh Sharma</h3>
                <button>Edit</button>
              </div>

              <div className='options_container'>
                <div className='option' style={{color:active==="Orders"?'#f9f6ee':'',backgroundColor:active==="Orders"?' rgba(202, 43, 75, 0.783)':''}} onClick={()=>{setActive('Orders')}}>
                  <MdSpaceDashboard style={{ fontSize: '1.3rem' }} />
                  <h3>Orders</h3>
                </div>
                <div className='option'  style={{color:active==="Products"?'#f9f6ee':'',backgroundColor:active==="Products"?' rgba(202, 43, 75, 0.783)':''}} onClick={()=>{setActive("Products");}}>
                  <RiLuggageCartLine style={{ fontSize: '1.2rem' }} />
                  <h3>Products</h3>
                </div>
                <div className='option' style={{color:active==="Users"?'#f9f6ee':'',backgroundColor:active==="Users"?' rgba(202, 43, 75, 0.783)':''}} onClick={()=>{setActive('Users')}}>
                  <FaUsers style={{ fontSize: '1.2rem' }} />
                  <h3>Users</h3>
                </div>
                <div className='option'>
                  <MdEmail style={{ fontSize: '1.2rem' }} />
                  <h3>Requests</h3>
                </div>
                <div className='option'>
                  <GiSettingsKnobs style={{ fontSize: '1.2rem' }} />
                  <h3>Settings</h3>
                </div>
              </div>
            </div>

            <div className='information_area'>
                {active==="Orders"?<Orders/>:active==="Users"?<Users/>:active==="Products"?<Products/>:<></>}
            </div>

          </div>



          :



          <div className='unAuthorizedSection'>
            <h1>Unauthorized Access</h1>
            <Lottie animationData={UnAuthorizedAnimation} autoPlay={true} style={{ height: '40vh' }} />
          </div>
      }

    </>

  )
}

