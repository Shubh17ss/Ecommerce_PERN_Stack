import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { FaShoppingCart } from 'react-icons/fa';
import { AiFillTags, AiOutlinePlusCircle } from 'react-icons/ai'
import { Loader } from '../Loader/loader';
import { SmallLoader } from '../Loader/loader';
import { Review } from '../Review/review';
import { Context } from '../../Context/context';

import Carousel from 'react-material-ui-carousel';
import './productInfo.css'

//Firebase imports
import { storage } from '../../firebaseConfig';
import { ref, listAll, getDownloadURL, list } from 'firebase/storage';
//Firebaes imports

export const ProductInfo = () => {

    const navigate = useNavigate();
    const [getting, setGetting] = useState(true);
    const { cart, setCart } = useContext(Context);
    const [itemAdded, setItemAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [price, setPrice] = useState('');
    const [reviews, setReviews] = useState([]);
    const [productImages, setProductImages] = useState([]);
    let product_id = useLocation().pathname.split('/');




    const options = {
        edit: false,
        color: '#fff',
        activeColor: 'crimson',
        size: 25,
        isHalf: true,
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        product_id = Number(product_id[3]);

        const getProductImages = async () => {
            const storageRef = ref(storage, `products/${product_id}`);
            const res = await listAll(storageRef);
            console.log(res);
            await Promise.all(res.items.map(async (item) => {
                const url = await getDownloadURL(item);
                console.log(url);
                setProductImages(productImages => [...productImages, url]);
            }))
            setGetting(false);
            
        }

        const getProductDetails = async () => {
            await axios.get(`/api/v1/products/${product_id}`).then((response) => {
                let pp = response.data[0].price;
                setPrice(pp.toLocaleString());
                setProduct(response.data);
                console.log(response.data);
            }).catch((error) => {
                alert('Error occured');
            })
        }

        const getReviews = async () => {
            await axios.get(`/api/v1/products/reviews/getallreviews/${product_id}`).then((response) => {
                console.log('Reviews received ', response.data);
                setReviews(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }

        getProductImages();
        getProductDetails();
        getReviews();

    }, [])

    const addToCart = () => {
        setLoading(true);
        setTimeout(() => {
            let flag = 0;
            setItemAdded(true);
            cart.forEach(cartProduct => {
                if (cartProduct.id === product[0].id) {
                    cartProduct.quantity = cartProduct.quantity + 1;
                    flag = 1;
                }
            })

            if (flag == 0) {
                const cart_product = { ...product[0] };
                cart_product['quantity'] = 1;
                setCart(cart => [...cart, cart_product]);
            }
            setLoading(false);
        }, 2000)

    }

    const goToCart = () => {
        navigate('/cart');
    }

    return (
        <>
            {getting === true ?
                <div style={{ width: '100%', height: '100vh',display:'flex',justifyContent:'center',alignItems:'center' }}>
                    <Loader/>
                </div>
                :
                <div className='product_page'>
                    {
                        product.length > 0 ?
                            <>
                                <div className='product_page_container'>
                                    <div className='carousel_container'>
                                        <Carousel sx={{ width: '75%', height: '60%', color: '#fff', marginTop: '15%' }} animation={"slide"}>
                                            {productImages.length > 0 &&
                                                productImages.map((item, index) => (
                                                    <img key={index} src={item} alt='/productimage'/>
                                                ))
                                            }

                                        </Carousel>
                                    </div>
                                    <div className='information_container'>
                                        <div style={{ display: 'flex', alignItems: 'center', width: '90%', justifyContent: 'space-between', marginTop: '10%' }}>
                                            <p style={{ fontSize: '2rem' }}>{product[0].name}</p>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <ReactStars {...options} value={product[0].reviews != 0 ? product[0].rating / product[0].reviews : 0} /><label style={{ color: '#fff', fontSize: '1.5rem', marginLeft: '0.8rem' }}>({product[0].reviews})</label>
                                            </div>
                                        </div>
                                        <p>Price : ₹ {price}</p>
                                        <p>Category : {product[0].category}</p>
                                        <p>Description : {product[0].description}</p>
                                        <p>Seller : {product[0].userid === null ? 'Unknown' : product[0].userid}</p>
                                        <p>Units left : {product[0].stock}</p>
                                        <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', marginTop: '5%' }}>
                                            <button className='add_to_cart_button'
                                                onClick={itemAdded ? goToCart : addToCart}
                                                style={{ color: itemAdded ? '#AAFF00' : '', width: '45%', height: '3rem', alignItems: 'center', display: 'flex', justifyContent: loading ? 'center' : 'space-between', padding: '0 1rem' }}>
                                                {
                                                    loading ? <SmallLoader /> :
                                                        <>
                                                            {itemAdded ? 'Item added to cart' : 'Add to Cart'}
                                                            <FaShoppingCart style={{ fontSize: '1.5rem' }} />
                                                        </>
                                                }

                                            </button>
                                            <a className='add_to_cart_button'
                                                href='#review_area'
                                                style={{ textDecoration: 'none', width: '45%', height: '3rem', alignItems: 'center', display: 'flex', justifyContent: 'space-between', padding: '0 1rem' }}>
                                                Buyer's Reviews
                                                <AiFillTags style={{ fontSize: '1.5rem' }} />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className='reviews_container' id='review_area'>
                                    {reviews.length > 0 ?
                                        reviews.map((item, index) => (
                                            <Review review={item} key={index} />
                                        ))
                                        :
                                        <p style={{ color: '#fff', width: '70%', fontSize: '1.3rem' }}>No user reviews </p>
                                    }
                                    <div className='add_review_section'>
                                        <AiOutlinePlusCircle style={{ fontSize: '3rem', cursor: 'pointer' }} />
                                        <p>Add your review</p>
                                    </div>
                                </div>
                            </>

                            :
                            <Loader />
                    }
                </div>
            }
        </>
    )
}

