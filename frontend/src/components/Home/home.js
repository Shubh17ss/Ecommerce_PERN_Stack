import React, { useEffect, useState } from 'react'
import './home.css'
import perfumeImage from '../../assets/images/perfume_image_1.jpg';
import { Product } from '../Product/product';
import {motion, useScroll} from 'framer-motion';


export const Home = () => {
  const [loading, setLoading] = useState(true);
  let {scrollYProgress}=useScroll();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className='home_main'>
      <div className='home_page_container'>
        <div className='image_container'>
          <motion.img src={perfumeImage} alt="/" onLoad={() => { setLoading(false) }} 
                      initial={{opacity:0,rotate:240}}
                      animate={{rotate:360,opacity:1}}
                      transition={{duration:1,ease:"easeIn"}}
                      
                  />
        </div>
        {
          loading === false ?
            <motion.div className='text_container' initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1,ease:"easeIn"}}>
              <h1>Shop from the finest of scents...</h1>
            </motion.div>
            :
            <></>
        }
      </div>
    </div>
  )
}

