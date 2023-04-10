import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './shippingInfo.css';
import { BsFillHouseFill } from 'react-icons/bs';
import { FaCity } from 'react-icons/fa';
import { GoGlobe } from 'react-icons/go';
import { MdDelete } from 'react-icons/md';
import { AiOutlinePlusCircle, AiOutlineClose } from 'react-icons/ai';
import { Loader, SmallLoader } from '../Loader/loader';


import { ToastContainer, toast } from 'react-toastify';

export const ShippingInfo = () => {

  const [address, setAddress] = useState([]);

  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [street, setStreet] = useState();
  const [city, setCity] = useState();
  const [pincode, setPincode] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();

  const handleAddAddress = async () => {
    setLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = {
      name: name,
      street: street,
      city: city,
      state: state,
      country: country,
      pincode: pincode
    }
    await axios.post('/api/v2/profile/addshippingaddress', body, config).then((response) => {
      console.log(response);
      setLoading(false);
      setAdding(false);
      successToast('New address added');
      getAddresses();
    }).catch((error) => { console.log(error) })
  }

  const handleDelete = async (id) => {
    setLoading(true);
    axios.delete(`/api/v2/profile/deleteaddress/${id}`).then((response) => {
      getAddresses();
      setLoading(false);
      successToast('Address deleted');
    }).catch((error) => {
      alert(error);
    })
  }

  const getAddresses = async () => {
    setLoading(true);
    await axios.get('/api/v2/profile/getallshippingaddress').then((response) => {
      setAddress(response.data);
      setLoading(false);
      
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    })
  }

  const successToast=(msg)=>{
      toast.success(msg,{
        position:toast.POSITION.TOP_RIGHT
      })
  }

  useEffect(() => {
    getAddresses();
  }, [])

  return (
    <div className='ShippingInfoPage'>
      <ToastContainer/>
      <div className='header'>
        <p>Shipping details</p>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Here you can manage your shipping address</p>
      </div>
      <div className='details_container'>
        {
          address.length > 0 && loading === false ?
            address.map((item, index) => (
              <div className='shipping_details' key={item.id}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <p>{item.name}</p>
                  <button className='delete_button'><MdDelete style={{ fontSize: '1.5rem' }} onClick={() => handleDelete(item.id)} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '2rem' }}>
                  <div className='address_container'>
                    <BsFillHouseFill style={{ fontSize: '1.2rem' }} />
                    <p>{item.street}</p>
                  </div>
                  <div className='address_container'>
                    <FaCity style={{ fontSize: '1.2rem' }} />
                    <p>{item.city} - {item.postal_code}, {item.state}</p>
                  </div>
                  <div className='address_container'>
                    <GoGlobe style={{ fontSize: '1.2rem' }} />
                    <p>{item.country}</p>
                  </div>
                </div>
              </div>
            ))
            :
            loading?
            <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',height:'40vh'}}>
            <Loader />
            </div>
            :
            <h3 style={{color:'rgba(255,255,255,0.8)'}}>You have no shipping address</h3>
        }
        <button className="add_new_address_button" onClick={() => setAdding(true)}>Add new address  <AiOutlinePlusCircle style={{ marginLeft: '1rem' }} /></button>
      </div>

      {adding ?
        <div className='add_new_address'>
          <AiOutlineClose style={{ color: 'rgba(202, 43, 75, 0.783)', fontSize: '1.2rem', alignSelf: 'flex-end' }} onClick={() => { setAdding(false) }} />
          <input type='text' placeholder='Your name' value={name} onChange={(e) => { setName(e.target.value) }} />
          <input type='text' placeholder='Street address' value={street} onChange={(e) => { setStreet(e.target.value) }} />
          <input type='text' placeholder='City' value={city} onChange={(e) => { setCity(e.target.value) }} />
          <input type='text' placeholder='Postal code' value={pincode} onChange={(e) => { setPincode(e.target.value) }} />
          <input type='text' placeholder='State' value={state} onChange={(e) => { setState(e.target.value) }} />
          <input type='text' placeholder='Country' value={country} onChange={(e) => { setCountry(e.target.value) }} />
          <button className='add_new_address_button' value={name} style={{ width: '20%' }} onClick={handleAddAddress}>{loading ? <SmallLoader /> : 'Add address'}</button>

        </div>
        :
        <></>}

    </div>
  )
}

