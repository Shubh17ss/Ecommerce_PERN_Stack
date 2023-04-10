import React, { useState } from 'react'
import './sellWithUs.css';
import SellWithUsImage from '../../assets/images/ecommerce_sellWithUs.svg';
import { BsArrowRightShort } from 'react-icons/bs';

export const SellWithUs = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className='sellWithUs_page'>
      <img src={SellWithUsImage} alt='/' onLoad={() => { setLoading(false) }} />
      {loading === false ?
        <div className='banner_area'>
          <h3>Take your business online in no time</h3>
          <button>Apply <BsArrowRightShort style={{ fontSize: '1.8rem', marginLeft: '0.8rem', marginTop: '0.3rem' }} /></button>
        </div>
        :
        <>
        </>}
    </div>
  )
}

