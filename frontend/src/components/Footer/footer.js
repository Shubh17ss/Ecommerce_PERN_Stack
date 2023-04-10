import React from 'react'
import './footer.css';
import { FaFacebook, FaInstagram, FaTeamspeak, FaTwitter } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import playStoreImages from '../../assets/images/play_store.png';

export const Footer = () => {
    return (
        <div className='footer_container'>
            <div className='footer_left'>
                <h3>Download our app.</h3>
                <img src={playStoreImages} alt="/" />
            </div>
            <div className='footer_mid'>
               <h3>Copyright 2023 &copy; itra.com</h3>
            </div>
            <div className='footer_right'>
                <h3>Reach out via...</h3>
                <FaFacebook style={{ fontSize: '2rem', margin: '1rem', cursor: 'pointer' }}
                    onMouseOver={({ target }) => target.style.color = "#4267B2"}
                    onMouseOut={({ target }) => target.style.color = "#fff"}
                    color="#fff"
                />
                <FaInstagram style={{ fontSize: '2rem', margin: '1rem', cursor: 'pointer' }}
                    onMouseOver={({ target }) => target.style.color = "crimson"}
                    onMouseOut={({ target }) => target.style.color = "#fff"}
                    color="#fff" />
                <FaTwitter style={{ fontSize: '2rem', margin: '1rem', cursor: 'pointer' }}
                    onMouseOver={({ target }) => target.style.color = " #1DA1F2"}
                    onMouseOut={({ target }) => target.style.color = "#fff"}
                    color="#fff"
                />
                <SiGmail style={{ fontSize: '2rem', margin: '1rem', cursor: 'pointer' }} 
                   onMouseOver={({ target }) => target.style.color = "crimson"}
                   onMouseOut={({ target }) => target.style.color = "#fff"}
                   color="#fff"
                />
            </div>
        </div>
    )
}

