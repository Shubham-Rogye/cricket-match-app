import React, { useEffect, useState } from 'react'
import bannerImg from '../cricket-match-with-player.jpg'

const Banner = () => {
    const [navHeight, setNavHeight] = useState()
    useEffect(()=>{
        setNavHeight(document.querySelector('.navbar_comp').clientHeight)
    })
  return (
    <section style={{ 'height': `calc(100vh - ${navHeight}px)` }} className='banner_img_div'>
      <img src={bannerImg}/>
      <div className=''></div>
    </section>
  )
}

export default Banner
