import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    product_details: {
      name: String,
      image: [String], // Ensuring an array of strings for product images
    },
    quantity: {
      type: Number,
      default: 1, // Quantity of the product in the order
    },
    price: {
      type: Number, // Price per unit of the product
      required: [true, "Provide product price"],
    },
  });
const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    orderId : {
        type : String,
        required : [true, "Provide orderId"],
        unique : true
    },
    // productId : {
    //     type : mongoose.Schema.ObjectId,
    //     ref : "product"
    // },
    products: [itemSchema],
    product_details : {
        name : String,
        image : Array,
    },
    paymentId : {
        type : String,
        default : ""
    },
    payment_status : {
        type : String,
        default : ""
    },
    order_status: {
        type: String,
        enum: ["Complete", "Pending", "Cancelled", "Shipped", "Delivered"],
        default: "Complete", // Default value
    },
    delivery_address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    subTotalAmt : {
        type : Number,
        default : 0
    },
    totalAmt : {
        type : Number,
        default : 0
    },
    invoice_receipt : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

const OrderModel = mongoose.model('order',orderSchema)

export default OrderModel