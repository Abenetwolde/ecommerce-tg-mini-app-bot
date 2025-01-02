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

    const payload = list_items.map(el => {
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
    const userId = request.userId; // auth middleware 
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;
    console.log("totalAmt", totalAmt)
    const user = await UserModel.findById(userId);

    // Map line items for reference or records (optional)
    const line_items = list_items.map(item => ({
      name: item?.productId.name,
      quantity: item?.quantity,
      price: pricewithDiscount(item.productId.price, item.productId.discount),
    }));
    const TEXT_REF = "tx-" + Date.now()
    // Chapa payment payload
    const paymentData = {
      tx_ref: TEXT_REF, // unique transaction reference
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
        // logo: `${process.env.FRONTEND_URL}/logo.png`, // Your logo URL
      },
      //   callback_url: `${process.env.FRONTEND_URL}/success`,
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
    console.log("data..........", data)
    if (data.status !== "success") {
      throw new Error("Failed to create Chapa payment session");
    }

    // Payment was successful; create orders in the database
    const payload = list_items.map(el => ({
      userId: userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: el.productId._id,
      product_details: {
        name: el.productId.name,
        image: el.productId.image,
      },
      paymentId: TEXT_REF, // Use the Chapa transaction reference
      payment_status: "PAID",
      delivery_address: addressId,
      subTotalAmt: subTotalAmt,
      totalAmt: totalAmt,
    }));

    const generatedOrder = await OrderModel.insertMany(payload);

    // Remove items from the cart
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return response.status(200).json({
      message: "Payment and order creation successful",
      error: false,
      success: true,
      payment_url: data.data.checkout_url, // Redirect URL to the Chapa payment page
      orders: generatedOrder,
    });

    // const userId = request.userId // auth middleware 
    // const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

    // const user = await UserModel.findById(userId)

    // const line_items  = list_items.map(item =>{
    //     return{
    //        price_data : {
    //             currency : 'inr',
    //             product_data : {
    //                 name : item.productId.name,
    //                 images : item.productId.image,
    //                 metadata : {
    //                     productId : item.productId._id
    //                 }
    //             },
    //             unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
    //        },
    //        adjustable_quantity : {
    //             enabled : true,
    //             minimum : 1
    //        },
    //        quantity : item.quantity 
    //     }
    // })

    // const params = {
    //     submit_type : 'pay',
    //     mode : 'payment',
    //     payment_method_types : ['card'],
    //     customer_email : user.email,
    //     metadata : {
    //         userId : userId,
    //         addressId : addressId
    //     },
    //     line_items : line_items,
    //     success_url : `${process.env.FRONTEND_URL}/success`,
    //     cancel_url : `${process.env.FRONTEND_URL}/cancel`

    // }

    // const session = await Stripe.checkout.sessions.create(params)

    // return response.status(200).json(session)

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
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
    const order = await OrderModel.findOne({ orderId })
      .populate('userId')
      .populate('productId')
      .populate('delivery_address');

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