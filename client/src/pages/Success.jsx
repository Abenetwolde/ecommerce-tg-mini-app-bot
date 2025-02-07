import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import successAlert from '../utils/SuccessAlert'
const Success = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  console.log("queryParams",queryParams)
  const message = queryParams.get('message');
  console.log("message",message)
  console.log("after decode",decodeURIComponent(message))
  useEffect(() => {
    if (message) {
      successAlert(decodeURIComponent(message));
      setTimeout(() => {
        window.Telegram.WebApp.close();
      }, 2000);
    }else{
      successAlert("Payment Successfully")
      setTimeout(() => {
        window.Telegram.WebApp.close();
      }, 2000);
    }
  }, [message]);
    console.log("location",)  
  return (
    <div className='m-2 w-full max-w-md p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      {/* <p className='text-green-800 font-bold text-lg text-center'>
        {message ? decodeURIComponent(message) : "Payment"} Successfully
      </p>
      <Link to="/" className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">
        Go To Home
      </Link> */}
    </div>
  )
}

export default Success
