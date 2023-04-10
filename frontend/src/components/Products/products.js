import React, { useEffect, useContext, useState } from 'react'
import axios from 'axios';
import { Context } from '../../Context/context';
import { Product } from '../Product/product';
import { Loader } from '../Loader/loader';
import {VscSearch} from 'react-icons/vsc';
import { HiEmojiSad } from 'react-icons/hi';
import './products.css'
import { Link, useLocation } from 'react-router-dom';

export const Products = () => {

  const [loading, setLoading] = useState(false);
  const { products, setProducts } = useContext(Context);
  const [showCatergories, setShowCategories] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchValue, setSearchValue]=useState('');

  let page = useLocation().pathname;
  page = page.split('/');
  const nextPage = Number(page[3]) + 1;
  const nextPageRoute = `/products/page/${nextPage}`;

  const getProducts = async () => {
    setLoading(true);
    console.log('Get Products is called');
    await axios.get(`/api/v1/products/page=${page[3]}`).then((response) => {
      const { data } = response;
      setProducts(data);
      setLoading(false);
    }).catch((error) => {
      setProducts([]);
      setLoading(false);
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts();
  }, [useLocation().pathname])

  const getSearchedProducts = async (event) => {
    if(event.key==="Enter"){
      console.log('Searched now');
      if (searchValue.length > 0) {
        await axios.get(`/api/v1/products/search/${searchValue}`).then((response) => {
           console.log(response);
           setProducts(response.data);
        }).catch((error) => {
          setProducts([]);
        })
      }
      else
        getProducts();
    }
  }

  const getSortedProducts = async (value) => {
    setLoading(true);
    await axios.get(`/api/v1/products/price/by=${value}`).then((response) => {
      setProducts(response.data);
      setLoading(false);
    }).catch((error) => {
      setProducts([]);
      setLoading(false);
    })
  }

  const getProductsByRating = async()=>{
    setLoading(true);
    axios.get('/api/v1/products/sort/rating').then((response)=>{
       setProducts(response.data);
       setLoading(false);
    }).catch((error)=>{setProducts([]); setLoading(false);})
  }


  return (
    <div className='products_page'>

      <div className='input_container'>
        <div className='search_container'>
          <input
            type='text' placeholder='Search for a product' className='search_field'
            onChange={(e) => {setSearchValue(e.target.value)}}
            onKeyDown={getSearchedProducts} />
            <VscSearch style={{position:'absolute',top:'15.7%',right:'34%'}}/>
        </div>
        <p onMouseOver={() => { setShowSort(false); setShowCategories(true); }} style={{ color: showCatergories ? 'white' : '' }}>Categories</p>
        <div className='categories_dropdown' style={{ opacity: showCatergories ? 1 : 0, visibility: showCatergories ? 'initial' : 'hidden' }}
          onMouseLeave={() => { setShowCategories(false) }}
        >
          <p>Electronics</p>
          <p>Mobiles and Tablets</p>
          <p>Board Games</p>
          <p>Body Wash</p>
        </div>

        <p onMouseOver={() => { setShowCategories(false); setShowSort(true) }} style={{ color: showSort ? '#fff' : '' }}>Sort</p>
        <div className='categories_dropdown sort_dropdown' style={{ opacity: showSort ? 1 : 0, visibility: showSort ? 'visible' : 'hidden' }}
          onMouseLeave={() => { setShowSort(false) }}>
          <p onClick={() => { getSortedProducts("ASC") }} >Price <label style={{color:'#AAFF00'}}>&uarr;</label></p>
          <p onClick={() => { getSortedProducts("DESC") }}>Price <label style={{color:'crimson'}}>&darr;</label></p>
          <p onClick={()=>{getProductsByRating()}}>By rating</p>
          <p onClick={()=>{getProducts()}}>By relevance</p>
        </div>
      </div>
      {
        loading ?

          <div style={{height:'80vh',display:'flex',alignItems:'center'}}>  <Loader /></div>
          :
          products.length > 0 ?
            <div className='products_container' onMouseOver={() => { setShowCategories(false); setShowSort(false) }}>
              {products.map((item, index) => {
                return (
                  <Product product={item} key={index} />
                )
              })}
            </div>
            :
            <div style={{ alignSelf: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '90vh', alignItems: 'center' }}>
              <HiEmojiSad style={{ fontSize: '6rem', color: 'crimson' }} />
              <h4 style={{ filter: 'contrast(3px)', textAlign: 'center' }}>Oops...! No product found.</h4>
            </div>
      }

      {
        products.length > 0 ?
          <Link
            to={nextPageRoute}
            style={{ color: 'crimson', width: '20%', alignSelf: 'flex-end', marginRight: '15%', textDecoration: 'none' }}>
            <h4>More Products... </h4>
          </Link>
          :
          <></>
      }

    </div>
  )
}

