import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../../Context/context';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { MdDelete } from 'react-icons/md'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import './product.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Firebase imports
import { storage } from '../../firebaseConfig';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
//Firebase imports

export const Product_cart = ({ product }) => {

    const { cart, setCart, cartTotal, setCartTotal } = useContext(Context);
    const [quantity, setQuantity] = useState(product.quantity);
    const value = product.reviews != 0 ? product.rating / product.reviews : 0;
    const productDetailsPathName = `/products/productdetails/${product.id}`;
    

    const options = {
        edit: false,
        color: '#fff',
        activeColor: 'crimson',
        value: value,
        isHalf: true,
    }
    const removeFromCart = () => {
        const newCart = cart.filter(removeProduct);
        function removeProduct(object) {
            return object.id != product.id;
        }
        console.log('remaining items are', newCart);
        setCart(newCart);
        if (newCart.length === 0) localStorage.removeItem('Cart');
        else
            localStorage.setItem('Cart', JSON.stringify(cart));
    }

    const removeQuantity = () => {
        if (product.quantity === 1)
            errorToast('Quantity cannot be 0');
        else {
            product.quantity = product.quantity - 1;
            setQuantity(product.quantity);
            let newCartTotal = cartTotal - product.price;
            setCartTotal(newCartTotal);
        }
    }

    const addQuantity = () => {
        product.quantity = product.quantity + 1;
        setQuantity(product.quantity);
        let newCartTotal = cartTotal + product.price;
        setCartTotal(newCartTotal);
    }

    const errorToast = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
        })
    }

    return (
        <>
            <ToastContainer />
            <Link className='product_card card2' style={{ textDecoration: 'none', color: '#fff' }}
            >

                <img src={product.image_url!==null?product.image_url:''} alt={product.name} />
                <div className='product_info_container'>
                    <p>{product.name}</p>
                    <p>₹ {product.price}/-</p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '0.5rem' }}>
                        <ReactStars {...options} size={15} /><span style={{ filter: 'contrast(3px)', marginLeft: '0.7rem', fontSize: '0.9rem' }}>({product.reviews} reviews)</span>
                    </div>

                </div>

                <div className='buttons_container'>

                    <button className='delete_button' onClick={removeFromCart}><MdDelete style={{ fontSize: '1.5rem', color: 'crimson' }} /></button>
                    <div style={{ display: 'flex', width: '40%', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1rem' }}>
                        <button className='delete_button minus' onClick={removeQuantity}><AiOutlineMinus style={{ fontSize: '1.2rem' }} /></button>
                        <h4 style={{ marginLeft: '0.7rem' }}>{quantity}</h4>
                        <button className='delete_button plus' onClick={addQuantity}><AiOutlinePlus style={{ fontSize: '1.2rem' }} /></button>
                    </div>

                </div>
            </Link>
        </>
    )
}

