import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import successAlert from '../utils/SuccessAlert'
import useTelegramUser from '../hookscopy/useTelegramUser'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
const user =useTelegramUser();
  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response
      const orderId = responseData.data[0]?.orderId;
      const telegramResponse = await fetch(`https://api.telegram.org/bot6109494690:AAGHFhZ0U9v5tz2Ii0rVlE3xm2j4bg5OaVA/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: user?.id||"1213", // User's Telegram ID
            text: `Hello, ${user?.first_name||"first name"}! Your order has been placed successfully. Order ID: ${orderId||"1234"}`,
            reply_markup: {
              inline_keyboard: [
                  [
                      {
                          text: "View Order",
                          web_app: {
                              url: `https://a192r4rebja4.share.zrok.io/order/${orderId}`
                          }
                      }
                  ]
              ]
          }
        }),
    });
    console.log("telegramResponse",telegramResponse)
    if (telegramResponse.ok) {
      const result = await telegramResponse.json();
      successAlert('Message sent successfully:');
  } else {
    successAlert('Failed to send message:', telegramResponse.statusText);
  }
   
      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        // navigate('/success', {
        //   state: {
        //     text: "Order"
        //   }
        // })
        const successMessage = "Order placed successfully!";
        const encodedMessage = encodeURIComponent(successMessage);
        navigate(`/success?message=${encodedMessage}`);
       
      }
   
     
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // const handleOnlinePayment = async () => {
  //   try {
  //     toast.loading("Loading...")
  //     const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  //     const stripePromise = await loadStripe(stripePublicKey)

  //     const response = await Axios({
  //       ...SummaryApi.payment_url,
  //       data: {
  //         list_items: cartItemsList,
  //         addressId: addressList[selectAddress]?._id,
  //         subTotalAmt: totalPrice,
  //         totalAmt: totalPrice,
  //       }
  //     })

  //     const { data: responseData } = response

  //     stripePromise.redirectToCheckout({ sessionId: responseData.id })

  //     if (fetchCartItem) {
  //       fetchCartItem()
  //     }
  //     if (fetchOrder) {
  //       fetchOrder()
  //     }
  //   } catch (error) {
  //     AxiosToastError(error)
  //   }
  // }
  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...");
      const response = await Axios({
        ...SummaryApi.payment_url, // API endpoint to create a payment
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });
  
      const { data: responseData } = response;
      const successMessage = "online Payment successful!";
      const encodedMessage = encodeURIComponent(successMessage);
      window.location.href = `${responseData.payment_url}?message=${encodedMessage}`;
      // Redirect user to the Chapa payment URL
      // window.location.href = responseData.payment_url;

      if (fetchCartItem) {
        fetchCartItem();
      }
      if (fetchOrder) {
        fetchOrder();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className=''>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className=' p-2 grid gap-4'>
            {
              addressList.map((address, index) => {
                return (
                  <label htmlFor={"address" + index} className={!address.status && "hidden"}>
                    <div className='border rounded p-3 flex gap-3 '>
                      <div>
                        <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectAddress(e.target.value)} name='address' />
                      </div>
                      <div>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div onClick={() => setOpenAddress(true)} className='h-16  border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>



        </div>

        <div className='w-full max-w-md  py-4 px-2'>
          {/**summary**/}
          <h3 className='text-lg font-semibold'>Summary</h3>
          <h3 className='font-semibold'>Bill details</h3>
          <div className='grid  sm:grid-cols-2 gap-4'>

            <div className='flex  justify-between   text-sm' >
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
            </div>
            <div className='flex  justify-between   text-sm'>
              <p>Quntity total</p>
              <p className='flex items-center gap-2  text-sm'>{totalQty} item</p>
            </div>
            <div className='flex  justify-between   text-sm'>
              <p>Delivery Charge</p>
              <p className='flex items-center gap-2  text-sm'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4  text-sm'>
              <p >Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <button className='py-2 px-4 bg-[var(--tg-theme-button-color)]  rounded text-white font-semibold' onClick={handleOnlinePayment}>Online Payment</button>

            <button className='py-2 px-4 border-2 border-[var(--tg-theme-button-color)] font-semibold text-[var(--tg-theme-button-color)] ' onClick={handleCashOnDelivery}>Cash on Delivery</button>
          </div>
        </div>
      </div>


      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
