import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import ProductModel from './models/product.model.js'

const app = express()
app.use(cors({
    credentials: true,
    origin: [
        "https://web.telegram.org",
        "https://ecommerce-tg-mini-app-bot.vercel.app",
        "https://ecommerce-tg-mini-app-bot-1.onrender.com",
        "http://localhost:5173",
        "https://0qe24dta6aes.share.zrok.io",
        "https://hggc617d2d8f.share.zrok.io"
    ],
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.options("*", (req, res) => {
    res.sendStatus(200);
});
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
//   });
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
// app.use(helmet({
//     crossOriginResourcePolicy : false
// }))

const PORT = 8080 || process.env.PORT 

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})

  app.get("/test", (req, res) => {
    res.send("Hello from Vercel22!");
  });
app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})

