import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { BackButton } from '@vkruglikov/react-telegram-web-app'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const handleBackButtonClick = () => {
    console.log('Hello, I am back button!');
    // You can handle custom navigation logic here if needed
    window.history.back(); // Example: goes back in the browser history
  };
  console.log("order Items", orders)
  return (
    <div className=' md:bg-white lg:bg-white'>
      <BackButton onClick={handleBackButtonClick} />
      <div className='bg-[var(--tg-theme-secondary-bg-color)] shadow-md p-3 font-semibold'>
        <h1>Orders</h1>
      </div>
      {
        !orders[0] && (
          <NoData />
        )
      }
      {
        orders.map((order, index) => {
          return (
            <div key={order._id + index + "order"} className='order rounded p-4 text-sm'>
              <p>Order No : {order?.orderId}</p>
              <div className='flex gap-3'>
                <img
                  src={order?.products[0]?.product_details?.image[0]}
                  className='w-14 h-14'
                />
                <p className='font-medium'>{order?.products[0]?.product_details?.name}</p>
                <p className="font-medium">
                  {new Date(order?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default MyOrders
