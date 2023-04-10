import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from '../Loader/loader';
import './myOrders.css';
import { BiSad } from 'react-icons/bi';

export const MyOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMyOrders = async () => {
    setLoading(true);
    console.log('loading set to true');
    axios.get('/api/v3/orders/myorders').then((response) => {
      setOrders(response.data.orders.orders);
      console.log(orders);
      setLoading(false);
      console.log('loading set to false');
    }).catch(error => {
      console.log(error);
      setLoading(false);
      console.log('loading set to false');
    })
  }

  useEffect(() => {
    getMyOrders();
  }, [])

  return (
    <div className='myOrdersSection'>
      <div className='order_header'>
        <p style={{ fontSize: '2.2rem' }}>Order history</p>
        <p style={{ fontSize: '1.2rem', fontWeight: '100', color: 'rgba(255,255,255,0.7)' }}>Here you can manage your orders</p>
      </div>
      {
        orders.length > 0 ?
          <div className='orders_container'>
            {orders.map((item, index) => (
              <div className='order_card' key={item}>
                <div className='id_date'>
                  <h3>Order Id : #{item[0].order_id} </h3>
                  <h3>Date : {item[0].order_date}</h3>
                </div>

                <div className='info'>
                  <div>
                    <h3>Total : ₹ {item[0].total}</h3>
                    <h3 style={{ marginLeft: '4rem' }}>Items : {item.length - 1}</h3>
                  </div>

                  <button style={{ marginLeft: '3rem', backgroundColor:item[0].status==='Shipped'?'rgba(0, 128, 254,0.7)':item[0].status==='Delivered'?'rgb(80, 200, 120,0.7)':'rgb(255, 191, 0,0.7)' }}>{item[0].status}</button>
                  <button>Details</button>
                </div>

              </div>
            ))}
          </div>
          :
          loading ?
          <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}>
            <Loader />
          </div>
            :
            <div style={{ alignSelf: 'center', marginTop: '4rem' }}>
              <BiSad style={{ fontSize: '5rem', opacity: 0.7, color: 'crimson' }} />
              <h3 style={{ alignSelf: "center", color: 'rgba(255,255,255,0.8)' }}>You have no past orders....</h3>
            </div>
      }
    </div>
  )
}

