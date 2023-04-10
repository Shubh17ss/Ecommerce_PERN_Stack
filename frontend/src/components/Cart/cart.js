import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../Context/context';
import { Product_cart } from '../Product/product_cart';
import { useNavigate} from 'react-router-dom';
import './cart.css';
import { BsArrowRightShort } from 'react-icons/bs';
import Lottie from "lottie-react";
import emptyCartAnimation from '../../assets/animations/empty_cart_animation.json';
import {SmallLoader} from '../Loader/loader';


export const Cart = () => {

    const { cart, setCart, cartTotal, setCartTotal } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    const goToCheckout=()=>{
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
            navigate('/checkout');
        },1500)
    }

    useEffect(() => {
        let sum = 0;
        cart.forEach(product => {
            sum = sum + (product.price * product.quantity);
        })
        setCartTotal(sum);
    }, [cart]);

    return (
        <div className='cart_page_container'>
            {cart.length > 0 ?
                <>
                    <div className='cart_products_container'>
                        <div className='header_info'>
                            <h4>You have {cart.length} {cart.length > 1 ? 'items' : 'item'} in your cart.</h4>
                        </div>
                        {cart.map((item, index) => {
                            return <Product_cart product={item} key={index} />
                        })}
                    </div>
                    <div className='order_total_container'>
                        <div>
                            <h3>Cart Value :</h3>
                            <h4> ₹ {cartTotal.toLocaleString()}</h4>
                        </div>
                        <div>
                            <h3>GST : </h3>
                            <h4>Products are inclusive of GST</h4>
                        </div>
                        <div>
                            <h3>Shipping Charges :</h3>
                            <h4>Calculated at checkout</h4>
                        </div>
                        <button onClick={goToCheckout}>{loading?<div className='button_loading'/>:'Checkout'}{loading?'':<BsArrowRightShort style={{ fontSize: '1.6rem', marginLeft: '1rem' }} />}</button>
                    </div>
                </>
                :
                <div className='empty_cart_container'>
                    <h3>Seems like your cart is empty...</h3>
                    <Lottie animationData={emptyCartAnimation} loop={true} style={{height:'50vh'}}/>
                </div>
            }
        </div>
    )
}

