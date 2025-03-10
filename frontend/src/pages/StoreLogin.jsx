import React, { useEffect, useState } from 'react'

const StoreLogin = () => {
    const [width, setwidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setwidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);
  return (
    <h1>width is: ${width}</h1>
  )
}

export default StoreLogin