import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
// import Axios from 'axios';
import { FaTruck } from 'react-icons/fa';
import { IoLocationSharp } from "react-icons/io5";
const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await Axios.get(`/api/order/${orderId}`);
                setOrder(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen text-[var(--tg-theme-text-color)] ">
        {/* Header */}
        <header className="bg-[var(--tg-theme-secondary-bg-color)]   p-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Shipped!</h1>
            <p className="text-sm">Your order is on the way!</p>
          </div>
          <div className="text-3xl ">
                <FaTruck /> {/* Replaced with react-icons FaTruck */}
            </div>
        </header>
  
        <div className="p-4 space-y-4">
          {/* Shipping Information */}
          <div className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h2 className="font-semiboldbg-[var(--tg-theme-text-color)]">Shipping Information</h2>
              <div className="text-2xl ">
                <IoLocationSharp /> {/* Replaced with react-icons FaTruck */}
            </div>
            </div>
            <p className=" mt-2">{order.delivery_address.address_line}l</p>
            <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
            <p>{order.delivery_address.country}</p>
            <p>Mobile: {order.delivery_address.mobile}</p>
          </div>
  
 
          {/* Product List */}
          <div className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-lg shadow space-y-4">
            <div>
              <h3 className="font-semibold ">ABC Shop</h3>
              <div className="flex items-center border-b py-2 last:border-b-0">
                <img
                  src="/path-to-image1.png"
                  alt="Lorem Ipsum"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium">Lorem Ipsum</p>
                  <p className="text-sm ">Qty: 1</p>
                </div>
                <p className="font-semibold ">¥ 800.00</p>
              </div>
              <div className="flex items-center border-b py-2 last:border-b-0">
                <img
                  src="/path-to-image2.png"
                  alt="Lorem Ipsum"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium ">Lorem Ipsum</p>
                  <p className="text-sm ">Qty: 1</p>
                  <p className="text-sm ">Import tax (Lorem ipsum dolor)</p>
                </div>
                <p className="font-semibold ">¥ 500.00</p>
              </div>
            </div>
          </div>
  
          {/* Order Summary */}
          <div className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-lg shadow">
            <h2 className="font-semibold ">Order Total</h2>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal (2 Items)</span>
                <span>¥ 1,300.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>¥ 200.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span>¥ 1,500.00</span>
              </div>
            </div>
  
            <div className="mt-4 text-sm  space-y-1">
              <div className="flex justify-between">
                <span>Order no.</span>
                <span>0012232431</span>
              </div>
              <div className="flex justify-between">
                <span>Order Status</span>
                <span className="text-green-500 font-medium">Shipped</span>
              </div>
              <div className="flex justify-between">
                <span>Placed on</span>
                <span>April 25, 2023 11:20 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Paid on</span>
                <span>April 25, 2023 11:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Paid by</span>
                <span>e Wallet</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 w-full bg-red-500 p-4 flex justify-center items-center shadow-inner">

          <button className=" text-white py-1 px-4 rounded-md font-medium">
            Cancel The Order
          </button>
        </div>
      </div>
    );
};

export default OrderDetails;