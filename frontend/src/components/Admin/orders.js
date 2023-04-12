import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai';
import { Loader } from '../Loader/loader';
import axios from 'axios'
import './orders.css'
import { ToastContainer, toast } from 'react-toastify';

export const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);


  const successNotification = (msg) => {
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  const errorNotification = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  const getAllOrders = async () => {
    await axios.get('/api/v3/orders/admin/allorders').then((response) => {
      console.log(response.data);
      setOrders(response.data.orders);
      setTotal(response.data.total_orders_value);
    }).catch((error) => {
      console.log(error);
    })
  }

  const getSingleOrderDetails = async (order_id) => {
    setLoading(true);
    await axios.get(`/api/v3/orders/getorder/${order_id}`).then(async (response) => {
      setOrder(response.data);
      setStatus(response.data.order_data.status);
      let temp = [];
      response.data.ordered_products.forEach(item => {
        temp.push(item.product_id);
      })

      const body = {
        values: temp
      }
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      }

      await axios.post('/api/v1/products/specificproducts', body, config).then((response) => {
        console.log(response.data);
        setProducts(response.data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
      })

    }).catch((error) => {
      console.log(error);
    })
  }

  const updateOrderStatus = async (order_id) => {

    const body = {
      status: status
    }
    const config = {
      headers: {
        'Content-Type': 'Application/json'
      }
    }
    await axios.put(`/api/v3/orders/admin/updateorder/${order_id}`, body, config).then(async (response) => {
      successNotification(`Satus updated to ${status}`);
      let text = "";
      for (let i = 0; i < products.length; i++) {
        if (i === products.length - 1)
          text = text + products[i].name + ".";
        else
          text = text + products[i].name + ", ";
      }
      const body = {
        subject: `Your order was ${status}`,
        email: order.ordered_by.email,
        text: `Your order containing ${text} has been shipped. We will let you know once your package is out for delivery.`
      }
      await axios.post('/api/v4/sendMail/OrderConfirmed', body, config).then((response) => {
        console.log('Mail Sent');
      }).catch((error) => { console.log(error); })

      getSingleOrderDetails(order_id);
    }).catch((error) => {
      errorNotification(error.response.data);
    })
  }

  const handleCancelOrder = () => {

    errorNotification("You cannot cancel order without customer's request");
    return;
  }


  useEffect(() => {

    getAllOrders();
    if (details !== null) {
      getSingleOrderDetails(details.order_id);
    }
  }, [details]);


  return (
    <div className='orders_container'>
      <ToastContainer autoClose={2000} />
      <h3>Orders</h3>
      {
        orders.length > 0 ?
          <div className='orders_list_container'>
            {orders.map((item, index) => (
              <div className='order_card' key={index}>
                <p style={{ color: '#f9f6ee' }}>#{item.order_id}</p>
                <p>User id: {item.user_id}</p>
                <p>Ordered on: {item.created_at.substring(0, 10)}</p>
                <p style={{ marginLeft: '5rem', minWidth: '15%' }}>Payment: {item.payment_mode}</p>
                <p style={{ width: '15%' }}>Order total: ₹ {item.order_total.toLocaleString()}</p>
                <p style={{ minWidth: '5rem', borderRadius: '0.3rem', backgroundColor: item.status === "Shipped" ? 'rgba(0, 128, 254,0.7)' : item.status === "Delivered" ? 'rgb(80, 200, 120,0.7)' : 'rgb(255, 191, 0,0.7)', textAlign: 'center', color: '#fff', height: '1.35rem', fontWeight: 'bold', justifyContent: 'center', display: 'flex', alignItems: 'center', opacity: 0.8 }}>{item.status}</p>

                <button onClick={() => setDetails(item)}>Details</button>
              </div>

            ))}
          </div>
          :
          <></>
      }
      {
        details !== null ?
          <div className='order_details_container'>
            <AiFillCloseCircle style={{ fontSize: '1.2rem', position: 'absolute', top: 10, right: 10, cursor: 'pointer', color: 'rgba(202, 43, 75, 0.784)' }} onClick={() => { setDetails(null) }} />
            {
              loading ?
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Loader />
                  <p>Getting order details</p>
                </div>
                :
                order !== null ?
                  <>
                    <h3 style={{ alignSelf: 'flex-start' }}>Order Id: {details.order_id}</h3>
                    <div className='section'>
                      <div style={{ width: '35%', height: '90%' }}>
                        <div >
                          <h3>Customer Details</h3>
                          <p>User id: #{order.order_data.user_id}</p>
                          <p>Name: {order.ordered_by.name}</p>
                          <p>Email: {order.ordered_by.email}</p>
                        </div>
                        <div >
                          <h3>Shipping Details</h3>
                          <p>Address id: #{order.address_data.id}</p>
                          <p>Name: {order.address_data.name}</p>
                          <p>Street: {order.address_data.street}</p>
                          <p>Pincode: {order.address_data.postal_code}</p>
                          <p>City: {order.address_data.city}</p>
                          <p>State: {order.address_data.state}</p>
                          <p>Country: {order.address_data.country}</p>
                        </div>
                        <div>
                          <h3>Payment Details</h3>
                          <p>Payment id: #{order.payment_data.payment_id}</p>
                          <p>Status: {order.payment_data.payment_status}</p>
                          <p>Mode: COD</p>
                          <p>Cart Value: ₹{order.payment_data.cart_value.toLocaleString()}/-</p>
                          <p>Tax: ₹0/-</p>
                          <p>Shipping price: ₹{order.payment_data.shipping_price.toLocaleString()}</p>
                          <p>Order Total: ₹{order.payment_data.order_total.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className='products_list'>
                        <div className='list'>
                          <h3 style={{ marginBottom: '2rem' }}>Ordered products ({order.ordered_products.length})</h3>
                          {products.length > 0 ?
                            products.map((item, index) => (
                              <div key={index} style={{ display: 'flex', height: '3rem', justifyContent: 'flexStart', alignItems: 'center', border: 'none' }} >
                                <img src={item.image_url !== null ? item.image_url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcSH43jNYq-ql_yfxy0KkB6ezhrSd1cki57cmCFDC_45dA5EluAt4gyFZBgNMQRDgKp8&usqp=CAU'} alt='/' style={{ width: '3rem', height: '3rem' }} />
                                <p>Product id: #{item.id}</p>
                                <p style={{ minWidth: '35%', marginLeft: '2rem' }}>Name: {item.name}</p>
                                <p style={{ marginLeft: '2rem', minWidth: '10%' }}>Qty: {order.ordered_products[index].quantity}</p>
                                <p>Price: ₹{item.price.toLocaleString()}</p>
                              </div>
                            ))
                            :
                            <></>}
                        </div>
                        <div className='update_order_status'>
                          <h3>Order status</h3>
                          <p>Placed on: {order.order_data.created_at}</p>
                          <p>Delivered on: {order.order_data.delivered_at}</p>
                          <div style={{ border: 'none', display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <p style={{ backgroundColor: status === "Processing" ? 'rgb(255, 191, 0,0.5)' : '' }} onClick={() => { setStatus('Processing') }}>Processing</p>
                            <p style={{ backgroundColor: status === "Shipped" ? 'rgba(0, 128, 254,0.5)' : '' }} onClick={() => { setStatus('Shipped') }}>Shipped</p>
                            <p style={{ backgroundColor: status === "Delivered" ? 'rgb(80, 200, 120,0.5)' : '' }} onClick={() => { setStatus('Delivered') }}>Delivered</p>
                          </div>
                        </div>
                        <div className='button_container'>
                          <button className='cancel' onClick={() => handleCancelOrder()}>Cancel Order</button>
                          <button className='update' onClick={() => { updateOrderStatus(details.order_id) }}>Update Order</button>
                        </div>
                      </div>

                    </div>
                  </>
                  :
                  <></>

            }
          </div>
          :
          <></>
      }
    </div>
  )
}

