import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './products.css';
import { FaProductHunt } from 'react-icons/fa';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { SmallLoader } from '../Loader/loader';
import { ToastContainer, toast } from 'react-toastify';

//Firebase imports 
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
//Firebase imports

export const Products = () => {



    const [active, setActive] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(null);
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState(null);
    const [price, setPrice] = useState(null);
    const [stock, setStock] = useState(null);
    const [images, setImages] = useState([]);

    const successNotification = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.TOP_RIGHT
        })
    }

    const getAllProducts = async () => {
        await axios.get('/api/v1/products/admin/getAll').then((response) => {
            console.log(response);
            setProducts(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleImageUpload = (e) => {
        e.preventDefault();
        console.log(e.target.files);
        if (images.length === 4) {
            alert('You cannot upload more than 4 images');
            return;
        }
        console.log(URL.createObjectURL(e.target.files[0]));
        setImages(images => [...images, URL.createObjectURL(e.target.files[0])]);


    }

    const handleAddProduct = async () => {
        console.log('Products added are \n');
        const stock_number = Number(stock);
        if (name === null || price === null || description === null || category === null || stock === null || stock_number < 50) {
            alert('Empty Fields');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'Application/json'
            }
        }
        const body = {
            name: name,
            category: category,
            description: description,
            price: price,
            stock: stock_number
        }
        setLoading(true);
        axios.post('/api/v1/products/add', body, config).then(async (response) => {
            const product_id = response.data.results.rows[0].id;
            let index = 1;
            const prom = new Promise((resolve, reject) => {
                images.forEach(async image => {
                    let blob = await fetch(image).then(r => r.blob());
                    const storageRef = ref(storage, `products/${product_id}/${index}.jpg`);
                    uploadBytes(storageRef, blob).then((snapshot) => {
                        console.log('Image uploaded');
                        resolve();
                    })
                    index++;
                })
            })

            prom.then(async () => {
                await getDownloadURL(ref(storage, `products/${product_id}/1.jpg`)).then(async (url) => {
                    console.log('Download url for image is inside promise .then');
                    const body = {
                        url: url,
                        id: product_id,
                    }
                    const config = {
                        headers: {
                            'Content-type': 'Application/json'
                        }
                    }
                    await axios.put('/api/v1/products/update/addImage', body, config).then((response) => {
                        setLoading(false);
                        successNotification('Product added successfully');
                        setName("");
                        setCategory("");
                        setDescription("");
                        setPrice("");
                        setStock("");
                        setImages([]);
                    }).catch((error) => {
                        console.log(error);
                    })
                })

            })



        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
       getAllProducts();
    }, [])

    return (
        <div className='products_page_admin'>
            <ToastContainer autoClose={2200} />
            {active === "Add" ? <p className='rupee_symbol'>₹</p> : <></>}
            <div className='navigation_header'>
                <div style={{ backgroundColor: active === "All" ? '  rgba(202, 43, 75, 0.783)' : '' }} className='header_tag' onClick={() => { setActive("All") }}>
                    <FaProductHunt style={{ marginRight: '1rem' }} />
                    All products
                </div>
                <div className='header_tag' style={{ backgroundColor: active === "Add" ? '  rgba(202, 43, 75, 0.783)' : '' }} onClick={() => { setActive('Add') }}>
                    <AiFillPlusCircle style={{ marginRight: '1rem' }} />
                    Add product
                </div>
                <div className='header_tag' style={{ backgroundColor: active === "Search" ? '  rgba(202, 43, 75, 0.783)' : '' }} onClick={() => { setActive('Search') }}>
                    <BsSearch style={{ marginRight: '1rem' }} />
                    Search
                </div>
            </div>
            {
                active === "All" ?
                    <div className='all_products'>
                        {products.length > 0
                            ?
                            <>
                                <div className='product_info_card header_card'>
                                    <p style={{ width: '8%' }}>Id</p>
                                    <p style={{ width: '25%' }}>Name</p>
                                    <p style={{ width: '25%' }}>Category</p>
                                    <p style={{ width: '10%' }}>Price</p>
                                    <p style={{ width: '8%' }}>Stock</p>
                                    <p style={{ width: '8%' }}>Issuer</p>
                                    <p style={{ width: '6%', marginLeft: '1rem' }}>Rating</p>
                                </div>
                                <div className='list_container'>
                                    {products.map((item, index) => (
                                        <div className='product_info_card' key={index}>
                                            <p style={{ width: '8%' }}>#{item.id}</p>
                                            <p style={{ width: '25%' }}>{item.name}</p>
                                            <p style={{ width: '25%' }}>{item.category}</p>
                                            <p style={{ width: '10%' }}>₹ {item.price.toLocaleString()}</p>
                                            <p style={{ width: '8%', color: item.stock <= 0 ? 'red' : '' }}>{item.stock}</p>
                                            <p style={{ width: '8%' }}>{item.userid}</p>
                                            <p style={{ width: '6%', marginLeft: '1rem' }}>{item.rating}</p>
                                            <button>Edit</button>
                                        </div>
                                    ))}
                                </div>
                            </>
                            :
                            <div className='loading_card'>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                <div className='card_skeleton'></div>
                                
                            </div>
                        }
                    </div>
                    :
                    active === "Add" ?
                        <div className='add_product'>
                            <div className='section_1'>
                                <div>
                                    <p>Product Name</p>
                                    <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                                    <p style={{ fontWeight: 'lighter', fontSize: '0.8rem', marginLeft: '0.3rem', marginTop: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Do not exceed 20 characters when entering product name</p>
                                </div>

                                <div>
                                    <p>Category</p>
                                    <select name="cars" id="cars" value={category} onChange={(e) => { setCategory(e.target.value) }}>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Home and Decor">Home and Decor</option>
                                        <option value="Mobiles">Mobiles</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Skins and care">Skins and care</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>

                                <div>
                                    <p>Description</p>
                                    <textarea type="text" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                                </div>

                            </div>


                            <div className='section_2'>
                                <div className='priceStockInput'>
                                    <div>
                                        <p>Product Price</p>
                                        <input type="text" style={{ paddingLeft: '2rem' }} value={price} onChange={(e) => { setPrice(e.target.value) }} />
                                    </div>
                                    <div>
                                        <p>Stock Units</p>
                                        <input type="text" value={stock} onChange={(e) => { setStock(e.target.value) }} />
                                    </div>
                                </div>

                                <div className='product_upload_image'>
                                    <p>Product Images <input type='file' onChange={(e) => { handleImageUpload(e) }} /></p>
                                    <div className='chosen_images'>
                                        {images.length > 0 ?
                                            images.map((item, index) => (
                                                <img src={item} style={{ width: '8rem', height: '90%', margin: '0.6rem', borderRadius: '0.4rem' }} />
                                            ))
                                            :
                                            <></>}
                                    </div>
                                </div>
                                <p className='note_para'>Pay attention to the quality of pictures you add, comply
                                    with the background color standards. Pictures must of a certain dimensions.
                                </p>

                                <button onClick={handleAddProduct}>{loading ? <><SmallLoader />&nbsp;&nbsp; Adding product</> : 'Add product'}</button>
                            </div>
                        </div>
                        :
                        <></>
            }
        </div>
    )
}

