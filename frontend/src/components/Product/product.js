import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../Context/context';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { SmallLoader } from '../Loader/loader'
import './product.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Firebase imports
import { storage } from '../../firebaseConfig';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
//Firebase imports

export const Product = ({ product }) => {
    const { cart, setCart } = useContext(Context);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    localStorage.setItem('Cart', JSON.stringify(cart));
    const productDetailsPathName = `/products/productdetails/${product.id}`;
    const value = product.reviews != 0 ? product.rating / product.reviews : 0;
    const options = {
        edit: false,
        color: '#fff',
        activeColor: 'crimson',
        size: 25,
        value: value,
        isHalf: true,
    }

    const successToast = () => {
        toast.success('Item added to cart', {
            position: toast.POSITION.TOP_RIGHT
        })
    }

    const addToCart = () => {
        setLoading(true);
        const prom = new Promise((resolve, reject) => {
            setTimeout(() => {
                const cart_product = { ...product };
                cart_product['quantity'] = 1;
                setCart(cart => [...cart, cart_product]);
                setLoading(false);
                resolve();
            }, 2000);
        })

        prom.then((resolve) => {
            successToast();
        })
    }

    const isAlreadyAdded = (id) => {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === id) return true;
        }
        return false;
    }

    return (
        <>
            <ToastContainer autoClose={2000} />
            <div
                className='product_card' style={{ textDecoration: 'none', color: '#fff' }}>
                <Link to={productDetailsPathName} style={{ textDecoration: 'none', color: '#fff' }}>
                    <img src={product.image_url!=null?product.image_url:'https://removal.ai/wp-content/uploads/2022/02/YOGESH-JANGID-PEXELS.jpg'} alt={product.name} />
                    <div className='product_info_container'>
                        <p>{product.name}</p>
                        <p>₹ {product.price}/-</p>
                        <p style={{ fontSize: '0.8rem', fontWeight: '400' }}>{product.category}</p>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <ReactStars {...options} /><span style={{ filter: 'contrast(3px)', marginLeft: '0.7rem' }}>({product.reviews} reviews)</span>
                        </div>

                    </div>
                </Link>
                {isAlreadyAdded(product.id) === false ?
                    <button className='add_to_cart_button' onClick={addToCart}>{loading ? <SmallLoader /> : 'Add to cart'}</button>
                    :
                    <button className='add_to_cart_button'>Added to Cart</button>
                }
            </div>
        </>
    )
}

