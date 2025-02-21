import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import { FaTruck } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import useTelegramUser from "../hookscopy/useTelegramUser";
import { useNavigate } from 'react-router-dom';
const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const user=useTelegramUser()
  const navigate = useNavigate();
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
  const cancelOrder = async () => {
    if (canceling) return; // Prevent duplicate requests

    try {
      setCanceling(true);

      // Cancel the order via API
      const cancelResponse = await Axios.put(`/api/order/${orderId}/status`,{order_status:"Cancelled"},);
      if (cancelResponse.status === 200) {
        // Notify via Telegram bot
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${import.meta.env.VITE_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: user.id || "1213", // User's Telegram ID
              text: `Hello, ${user?.first_name || "Customer"}! Your order with ID ${order?.orderId} has been successfully canceled.`,
              // reply_markup: {
              //   inline_keyboard: [
              //     [
              //       {
              //         text: "View Orders",
              //         web_app: {
              //           url: `https://w7s48yrdhj06.share.zrok.io`,
              //         },
              //       },
              //     ],
              //   ],
              // },
            }),
          }
        );

        if (telegramResponse.ok) {
          alert("Order canceled and user notified successfully.");
        } else {
          alert("Order canceled, but failed to notify the user via Telegram.");
        }

        // Update UI
        setOrder((prev) => ({ ...prev, order_status: "Canceled" }));
      } else {
        alert("Failed to cancel the order. Please try again.");
      }
    } catch (err) {
      console.error("Error canceling the order:", err);
      alert("Something went wrong while canceling the order.");
    } finally {
      setCanceling(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen text-[var(--tg-theme-text-color)] ">
      {/* Header */}
      <button onClick={() => navigate('/')}  className="p-2 text-[var(--tg-theme-button-color)]">
        Home
      </button>
      <header className="bg-[var(--tg-theme-secondary-bg-color)] p-4 flex items-center justify-between">
        <div>
          <h1  className={order.order_status=="Complete"?"text-green-500": "text-red-500 font-medium"}>
            {order.order_status || "Processing"}
          </h1>
          <p className="text-sm">Your order is on the way!</p>
        </div>
        <div className="text-3xl">
          <FaTruck />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Shipping Information */}
        <div className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Shipping Information</h2>
            <div className="text-2xl">
              <IoLocationSharp />
            </div>
          </div>
          <p className="mt-2">{order.delivery_address?.address_line}</p>
          <p>
            {order.delivery_address?.city}, {order.delivery_address?.state}
          </p>
          <p>{order.delivery_address?.country}</p>
          <p>Mobile: {order.delivery_address?.mobile}</p>
        </div>

        {/* Product List */}
        <div className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-lg shadow space-y-4">
          <h3 className="font-semibold">Your Orderd Items</h3>
          {order.products.map((product) => (
            <div
              key={product.productId}
              className="flex items-center border-b py-2 last:border-b-0"
            >
              <img
                src={product.product_details.image[0] || "/default-image.png"}
                alt={product.product_details.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="ml-4 flex-1">
                <p className="font-medium">{product.product_details.name}</p>
                <p className="text-sm">Qty: {product.quantity}</p>
              </div>
              <p className="font-semibold">{product.price} ETB</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-lg shadow">
          <h2 className="font-semibold">Order Total</h2>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({order.products.length} Items)</span>
              <span>{order.subTotalAmt} ETB</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>free</span> {/* Replace with dynamic value if available */}
            </div>
            <div className="flex justify-between font-semibold">
              <span>Grand Total</span>
              <span> {order.totalAmt} ETB</span>
            </div>
          </div>

          <div className="mt-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Order no.</span>
              <span>{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Status</span>
              <span className={order.order_status=="Complete"?"text-green-500": "text-red-500 font-medium"}>
                {order.order_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Placed on</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid on</span>
              <span>{new Date(order.updatedAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid by</span>
             
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-red-500 p-2 flex justify-center items-center shadow-inner">
        <button
          onClick={cancelOrder}
          className={`text-white py-1 px-4 rounded-md font-medium ${
            canceling ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={canceling}
        >
          {canceling ? "Canceling..." : "Cancel The Order"}
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
