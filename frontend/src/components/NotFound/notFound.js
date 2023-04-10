import React from 'react'
import './notFound.css'
import Lottie from 'lottie-react';
import NotFoundAnimation from '../../assets/animations/animation_404.json';

export const NotFound = () => {
  return (
    <div className='notFoundPage'>
        <Lottie animationData={NotFoundAnimation} loop={true} style={{height:'12rem'}}/>
    </div>
  )
}

