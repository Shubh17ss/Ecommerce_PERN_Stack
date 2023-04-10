import React from 'react'
import ReactStars from 'react-rating-stars-component';
import './review.css'

export const Review = ({ review }) => {

    const options = {
        edit: false,
        color: '#fff',
        activeColor: 'crimson',
        size: 15,
        isHalf: true,
    }
    return (
        <div className='review_box'>
            <div className='profile_logo'>
                <p style={{ fontSize: '1.5rem' }}>{review.username.charAt(0)}</p>
            </div>
            <div className='comment_area'>
                <p>{review.comment}</p>
            </div>
            <div className='nameRatingContainer'>
                <ReactStars {...options} value={review.rating} />
                <p>{review.username}</p>
            </div>
        </div>
    )
}

