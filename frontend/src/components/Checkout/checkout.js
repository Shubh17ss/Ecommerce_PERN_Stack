import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { Context } from '../../Context/context';
import { useNavigate } from 'react-router-dom';
import { MdLocalShipping } from 'react-icons/md';
import { FaRupeeSign } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Lottie from 'lottie-react';
import 'react-toastify/dist/ReactToastify.css';
import { SmallLoader } from '../Loader/loader';
import PlacingOrderAnimation from '../../assets/animations/Placing_order_animation.json';

import './checkout.css'

export const Checkout = () => {


  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectAddress, setSelectAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { cart } = useContext(Context);


  const getAddress = async () => {
    await axios.get('/api/v2/profile/getallshippingaddress').then((response) => {
      setAddress(response.data);
      console.log(response.data);
      setLoading(false);

    }).catch((error) => {
      console.log(error);
      setLoading(false);
    })
  }

  const getCartTotal = () => {
    let sum = 0;
    cart.forEach(product => {
      sum += product.quantity * product.price;
      console.log(sum);
    })

    return sum;
  }

  const errorNotification = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.TOP_CENTER
    })
  }

  const sendMail=async ()=>{
    await axios.get('/api/v2/profile').then(async (response)=>{
        const email=response.data[0].email;
        const carttotal=getCartTotal();
        let items="";
        for(let i=0;i<cart.length;i++){
          if(i==cart.length-1)
          items=items+cart[i].name+".";
          else
          items=items+cart[i].name+", ";
        }
        
        const config={
          headers:{
            'Content-Type':'Application/json'
          }
        }
        const body={
          email:email,
          subject:'Order Placed Successfully',
          text:`Your order of ₹${carttotal} was placed and is being processed.
          Your package contains ${items}`
        }
        await axios.post('/api/v4/sendMail/OrderConfirmed',body,config).then((response)=>{
          console.log(response);
        }).catch((error)=>{
          console.log(error);
        })

    }).catch((error)=>{
      console.log(error);
    })
  }

  const successNotification = ()=>{
    toast.success('Order placed successfully',{
      position:toast.POSITION.TOP_CENTER,
      onClose:()=>{sendMail();navigate('/profile',{state:{comp:'Orders'}})}
    });
  }

  const handlePlaceOrder = async () => {
    if (selectAddress === null) {
      errorNotification('Please select an address');
      return;
    }
    else if (paymentMethod === null) {
      errorNotification('Please select a payment method');
      return;
    }
    else {
      setProcessing(true);
      setTimeout(() => {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        const body = {
          orderedItems: cart,
          shipping_id: selectAddress,
          payment_method: paymentMethod,
        }
        axios.post('/api/v3/orders/create', body, config).then((response) => {
          console.log(response);
          setProcessing(false);
          successNotification();
        }).catch((error) => {
          console.log(error);
          setProcessing(false);
          errorNotification('Something went wrong...please try again');
          
        })
      }, 4000)
    }
  }


  useEffect(() => {
    getAddress();
  }, [])

  return (
    <>
      <ToastContainer autoClose={1400} />
      <div className='checkout_page'>
        <div className='shipping_area_input'>
          <h1 style={{ fontSize: '1.4rem',margin:'1rem' }}>Shipping address</h1>
          {loading ?
            <div style={{ display: 'flex', alignItems: 'center', width: '40%', justifyContent: 'space-between' }}>
              <SmallLoader />
              <h5>Getting your shipping details</h5>
            </div>
            :
            <>
              {
                address.length > 0 ?
                  address.map((item, index) => (
                    <div className='shipping_card' key={index} onClick={() => { setSelectAddress(item.id); setIndex(index) }} style={{ backgroundColor: selectAddress === item.id ? '#3f3f3fae' : '#0f0f0f', color: selectAddress === item.id ? '#f9f6ee' : '' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingRight: '2rem' }}>
                        <p style={{ fontSize: '1.2rem', margin: 0, marginTop: '1rem', marginLeft: '2rem' }}>{item.name}</p>
                        {selectAddress === item.id ? <MdLocalShipping style={{ fontSize: '1.4rem', color: '#f9f6ee' }} /> : ''}
                      </div>
                      <div>
                        <p>{item.street}</p>
                        <p>{item.city}</p>
                        <p>{item.state}</p>
                        <p>{item.country}</p>
                      </div>
                    </div>
                  ))
                  :
                  <h3>You have no address, add a new one now.</h3>
              }

              <button onClick={() => { navigate('/profile', { state: { comp: 'Shipping' } }) }}>Add new address</button>
            </>
          }

          <div className='payment_method_area'>
            <h1 style={{ fontSize: '1.4rem' ,margin:'1rem'}}>How do you want to pay...?</h1>
            <div>
              <h3 style={{ backgroundColor: paymentMethod === "COD" ? '#3f3f3fae' : '',margin:'1rem' }} onClick={() => { setPaymentMethod('COD') }}>Cash on delivery {paymentMethod === "COD" ? <FaRupeeSign /> : <></>}</h3>
              <h3 style={{ backgroundColor: paymentMethod === "ONLINE" ? '#3f3f3fae' : '',margin:'1rem' }} onClick={() => { setPaymentMethod('ONLINE') }}>Online {paymentMethod === "ONLINE" ? <FaRupeeSign /> : <></>}</h3>
            </div>
          </div>
        </div>

        <div className='order_summary_area'>
          <h1 style={{ fontSize: '1.4rem',margin:'1rem' }}>Order Summary</h1>
          <div className='ordered_products_container'>
            <p style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>Products Info</p>
            {cart.map((item, index) => (
              <div>
                <p style={{ width: '50%', textAlign: 'left' }}>{item.name} </p> <p>Qty:{item.quantity} </p> <p style={{ width: '20%' }}>₹ {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className='shipping_info'>
            <p style={{ fontSize: '1.2rem', color: '#f9f6eed6' }}>Shipping Details</p>
            {
              address.length > 0 && index !== -1 ?
                <p style={{ lineHeight: '1.5rem' }}>{address[index].name}<br />{address[index].street}<br />{address[index].city}<br />{address[index].state}<br />{address[index].country}</p>
                :
                <p style={{ color: 'rgba(202, 43, 75, 0.774)' }}>Please select an address</p>
            }
          </div>

          <div className='price_summary_container'>
            <p style={{ fontSize: '1.2rem' }}>Price Summary</p>
            <div><p>Order Total</p><p>₹ {getCartTotal().toLocaleString()}</p></div>
            <div><p>Shipping</p> <p>₹ 79/-</p></div>
            <div><p>Taxes & Charges</p> <p>Inclusive</p></div>
          </div>

          <button onClick={handlePlaceOrder}>Place order for   &nbsp;&nbsp; ₹ {(getCartTotal() + 79).toLocaleString()}</button>

        </div>

        {processing ?
          <div className='processing_payment_loader'>
            <Lottie animationData={PlacingOrderAnimation} autoPlay={true} style={{ height: '13rem', opacity: 0.6 }} />
            <h3>Please wait while we place your order...</h3>
          </div>
          :
          <></>}
      </div>
    </>

  )
}

