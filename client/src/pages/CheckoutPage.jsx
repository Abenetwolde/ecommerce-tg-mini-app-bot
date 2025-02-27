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
import ethiopia from './ethiopia (1).png'
import { BackButton } from '@vkruglikov/react-telegram-web-app';
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
      const telegramResponse = await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TOKEN||"7933890817:AAHuRrmLm3zdypK1Z2jdKhlShgg0PlBALTE"}/sendPhoto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: user?.id||"1213", // User's Telegram ID
            photo: responseData?.data[0]?.product_details?.image[0], // URL of the image
            caption: `Hello, ${user?.first_name || "first name"}! Your order has been placed successfully. Order ID: ${orderId || "1234"}`,
            reply_markup: {
              inline_keyboard: [
                  [
                      {
                          text: "View your Order ↗️",
                          web_app: {
                              url: `${import.meta.env.VITE_DEV||"https://ecommerce-tg-mini-app-bot.vercel.app"}/order/${orderId}`
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
      setTimeout(() => {
        window.Telegram.WebApp.close();
      }, 2000);
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
          // console.log("product Image......",responseData.orders.products[0]?.product_details?.image[0])
      const successMessage = "online Payment successful!";
      const encodedMessage = encodeURIComponent(successMessage);
      window.location.href = `${responseData.payment_url}?message=${encodedMessage}`;
      // Redirect user to the Chapa payment URL
      // window.location.href = responseData.payment_url;
    
      const orderId = responseData?.orders?._id;
          
      const orderId4Digit = responseData?.orders?.orderId;
  //     const telegramResponse = await fetch(`https://api.telegram.org/bot6109494690:AAGHFhZ0U9v5tz2Ii0rVlE3xm2j4bg5OaVA/sendPhoto`, {
  //       method: 'POST',
  //       headers: {
  //           'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //           chat_id: user?.id||"1213", // User's Telegram ID
  //           photo: responseData?.orders?.products[0]?.product_details?.image[0], // URL of the image
  //           caption: `Hello, ${user?.first_name || "first name"}! Your order has been placed successfully. Order ID: ${orderId4Digit || "1234"}`,

  //           reply_markup: {
  //             inline_keyboard: [
  //                 [
  //                     {
  //                         text: "View your Order ↗️",
  //                         web_app: {
  //                             url: `${import.meta.env.VITE_DEV}/order/${orderId}`
  //                         }
  //                     }
  //                 ]
  //             ]
  //         }
  //       }),
  //   });
  //       if (telegramResponse.ok) {
  //     const result = await telegramResponse.json();
  //     successAlert('Message sent successfully:');

  // } else {
  //   successAlert('Failed to send message:', telegramResponse.statusText);
  // }
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
  const handleTelegramStarsPayment = async () => {
    try {
      // Create an order on your server
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
      const orderId = responseData?.orders?._id;
          
      const orderId4Digit = responseData?.orders?.orderId;

      // Create an invoice link using Telegram's Bot API
      const invoiceResponse = await fetch(
        `https://api.telegram.org/bot${import.meta.env.VITE_TOKEN||"7933890817:AAHuRrmLm3zdypK1Z2jdKhlShgg0PlBALTE"}/createInvoiceLink`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Purchase of Digital Goods',
            description: 'Thank you for your purchase!',
            payload: JSON.stringify({ orderId }), // Unique payload for the invoice
            provider_token: '', // Empty for Telegram Stars
            currency: 'XTR', // Telegram Stars currency code
            prices: [{ label: 'Total Amount', amount: 5 * 100 }], // Amount in smallest units
          }),
        }
      );

      const invoiceData = await invoiceResponse.json();
console.log("invoice data.......", invoiceData)
      if (invoiceData.ok) {
        const invoiceLink = invoiceData.result;

        // Open the invoice within the Telegram WebApp
        window.Telegram.WebApp.openInvoice(invoiceLink, async (status) => {
          if (status === 'paid') {
            toast.success('Payment successful!');
            if (fetchCartItem) fetchCartItem();
            if (fetchOrder) fetchOrder();
try {
  await fetch(
    `https://api.telegram.org/bot${import.meta.env.VITE_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: user?.id,
        text: `Hello, ${
          user?.first_name || 'Customer'
        }! Your order has been placed successfully. Order ID: ${
          orderId || 'N/A'
        }`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'View your Order ↗️',
                web_app: {
                  url: `${import.meta.env.VITE_DEV||"https://ecommerce-tg-mini-app-bot.vercel.app"}/order/${orderId}`,
                },
              },
            ],
          ],
        },
      }),
    }
  ); 
} catch (error) {
  toast.error('Payment failed or was cancelled.',error);
}
            // Send a confirmation message to the user via Telegram
         

            // Optionally, close the WebApp after a delay
            // setTimeout(() => {
            //   window.Telegram.WebApp.close();
            // }, 2000);
          } else {
            toast.error('Payment failed or was cancelled.');
          }
        });
      } else {
        toast.error('Failed to create invoice. Please try again.');
      }
    } catch (error) {
      console.error('Error during Telegram Stars payment:', error);
      toast.error('An error occurred.', error);
    }
  };
  const telegram=useTelegramUser()
  const handleBackButtonClick = () => {
    console.log('Hello, I am back button!');
    // You can handle custom navigation logic here if needed
    window.history.back(); // Example: goes back in the browser history
};
  return (
    <section className=''>
         <BackButton onClick={handleBackButtonClick} />
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className=' p-2 grid gap-4'>
            {
              addressList?.map((address, index) => {
                return (
                  <label htmlFor={"address" + index} className={!address.status && "hidden"}>
                    <div className='border rounded p-3 flex gap-3 '>
                      <div>
                        <input id={"address" + index} checked={selectAddress === index} type='radio' value={index} onChange={(e) => setSelectAddress(e.target.value)} name='address' />
                      </div>
                      <div>
                        <p>{address?.address_line}</p>
                        <p>{address?.city}</p>
                        <p>{address?.state}</p>
                        <p>{address?.country} - {address?.pincode}</p>
                        <p>{address?.mobile}</p>
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
              <p>Name </p>
              <p className='flex items-center gap-2'><span className=' text-neutral-400'>{telegram?.first_name||"first name"}</span></p>
            </div>
            <div className='flex  justify-between   text-sm' >
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className=' text-neutral-400'></span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
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
          <div className='w-full flex flex-col gap-4 mt-3'>
          <button
      className='py-2 px-4 bg-[var(--tg-theme-secondary-bg-color)] border-[var(--tg-theme-bg-color)] rounded text-white font-semibold flex items-center justify-center'
      onClick={handleOnlinePayment}
    >
   
      Pay with Chapa
      <img
        src={ethiopia}
        alt='Ethiopian Flag'
        className='w-6 h-6 ml-2'
      />
    </button>
    <button
    className='py-2 px-4 bg-[var(--tg-theme-bg-color)]  rounded text-white font-semibold  text-[var(--tg-theme-button-color)] bg-[var(--tg-theme-secondary-bg-color)]'
    onClick={handleTelegramStarsPayment}
  >
    Pay with Telegram Stars 🌟
  </button>
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
