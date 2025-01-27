import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import axios from "axios";
export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId // auth middleware 
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body

    const payload = list_items?.map(el => {
      return ({
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      })
    })

    const generatedOrder = await OrderModel.insertMany(payload)

    ///remove from the cart
    const removeCartItems = await CartProductModel.deleteMany({ userId: userId })
    const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

    return response.json({
      message: "Order successfully",
      error: false,
      success: true,
      data: generatedOrder
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
  const actualPrice = Number(price) - Number(discountAmout)
  return actualPrice
}

export async function paymentController(request, response) {
  try {
    const userId = request.userId; // Retrieved from auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;
    const user = await UserModel.findById(userId);

    // Map line items for Chapa reference or records
    const line_items = list_items.map(item => ({
      name: item?.productId.name,
      quantity: item?.quantity,
      price: pricewithDiscount(item.productId.price, item.productId.discount),
    }));

    const TEXT_REF = "tx-" + Date.now();

    // Chapa payment payload
    const paymentData = {
      tx_ref: TEXT_REF, // Unique transaction reference
      amount: totalAmt,
      currency: "ETB",
      customer: {
        email: user.email || "test-email",
        name: `${user?.first_name || "test first name"} ${user?.last_name || "test last name"}`,
        phone_number: user?.mobile || "0947081190",
      },
      customizations: {
        title: "Telegram Mini App",
        description: "Payment for items in your cart",
      },
      callback_url: `http://localhost:8080/api/order/verify-payment/${TEXT_REF}`,
      return_url: `${process.env.FRONTEND_URL}/success`,
    };

    // Send request to Chapa API
    const chapaResponse = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`, // Chapa secret key
        },
      }
    );

    const { data } = chapaResponse;

    if (data.status !== "success") {
      throw new Error("Failed to create Chapa payment session");
    }

    // Create order(s) in the database
    const orderId = `ORD-${new mongoose.Types.ObjectId()}`;
    const payload = {
      userId: userId,
      orderId: orderId,
      products: list_items.map(item => ({
        productId: item.productId._id,
        product_details: {
          name: item.productId.name,
          image: item.productId.image,
        },
        quantity: item.quantity,
        price: pricewithDiscount(item.productId.price, item.productId.discount),
      })),
      paymentId: TEXT_REF, // Use Chapa transaction reference
      payment_status: "PAID",
      delivery_address: addressId,
      subTotalAmt: subTotalAmt,
      totalAmt: totalAmt,
    };

    const generatedOrder = await OrderModel.create(payload);

    // Remove items from the cart
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    console.log(`Generated Order:`, generatedOrder);

    return response.status(200).json({
      message: "Payment and order creation successful",
      error: false,
      success: true,
      payment_url: data.data.checkout_url, // Redirect URL to the Chapa payment page
      orders: generatedOrder,
    });
  } catch (error) {
    console.error("Payment Controller Error:", error.message);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function verifyPayment(request, response) {
  console.log("reach verifyPayment ", request.params.tx_ref)
  try {
    const { tx_ref } = request.params;

    // Send verification request to Chapa API
    const chapaResponse = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`, // Chapa secret key
        },
      }
    );

    const { status, data } = chapaResponse.data;

    if (status === "success") {
      // Update the payment status in the database to "VERIFIED"
      await OrderModel.updateMany(
        { paymentId: tx_ref },
        { payment_status: "VERIFIED", payment_details: data }
      );

      console.log("Payment successfully verified.");
      return response.status(200).json({
        message: "Payment successfully verified.",
        error: false,
        success: true,
      });
    } else {
      console.log("Payment verification failed.");
      return response.status(400).json({
        message: "Payment verification failed.",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return response.status(500).json({
      message: "Payment verification error.",
      error: true,
      success: false,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = []

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product)

      const paylod = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      }

      productList.push(paylod)
    }
  }

  return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

  console.log("event", event)

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
          lineItems: lineItems,
          userId: userId,
          addressId: session.metadata.addressId,
          paymentId: session.payment_intent,
          payment_status: session.payment_status,
        })

      const order = await OrderModel.insertMany(orderProduct)

      console.log(order)
      if (Boolean(order[0])) {
        const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
          shopping_cart: []
        })
        const removeCartProductDB = await CartProductModel.deleteMany({ userId: userId })
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}


export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId // order id

    const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address')

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}
export const getOrderById = async (req, res) => {
  try {
    console.log("req.params............", req.params)
    const { orderId } = req.params;
    const neworderId = `ORD-${orderId}`.toString()
  
    const order = await OrderModel.findById(orderId)
      .populate('userId')
      // .populate('productId')
      .populate('delivery_address');
console.log("order.................",order)
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        error: true,
        success: false
      });
    }

    return res.status(200).json({
      message: 'Order details',
      error: false,
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Internal Server Error',
      error: true,
      success: false
    });
  }
};
export async function updateOrderStatusController(req, res) {
  try {
      const { orderId } = req.params;
      const { order_status } = req.body;
console.log(`orderId........`,orderId)
console.log(`order_status..........`,order_status)

// Validate order_status
      const validStatuses = ["Complete", "Pending", "Cancelled", "Shipped", "Delivered"];
      if (!validStatuses.includes(order_status)) {
          return res.status(400).json({
              message: "Invalid order status",
              error: true,
              success: false,
          });
      }

      // Find the order and update its status
      const order = await OrderModel.findByIdAndUpdate(
          orderId , // Find by orderId
          { order_status }, // Update the order_status
          { new: true } // Return the updated document
      );

      if (!order) {
          return res.status(404).json({
              message: "Order not found",
              error: true,
              success: false,
          });
      }

      return res.status(200).json({
          message: "Order status updated successfully",
          error: false,
          success: true,
          data: order,
      });
  } catch (error) {
      console.error("Error updating order status:", error.message);
      return res.status(500).json({
          message: "Internal server error",
          error: true,
          success: false,
      });
  }
}