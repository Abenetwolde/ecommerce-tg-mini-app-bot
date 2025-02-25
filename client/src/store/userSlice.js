import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem('user');
const parsedUser = storedUser ;

const initialValue = {
    _id: parsedUser?._id || "",
    name: parsedUser?.name || "",
    email: parsedUser?.email || "",
    avatar: parsedUser?.avatar || "",
    mobile: parsedUser?.mobile || "",
    verify_email: parsedUser?.verify_email || "",
    last_login_date: parsedUser?.last_login_date || "",
    status: parsedUser?.status || "",
    address_details: parsedUser?.address_details || [],
    shopping_cart: parsedUser?.shopping_cart || [],
    orderHistory: parsedUser?.orderHistory || [],
    role: parsedUser?.role || "",
    accesstoken: localStorage.getItem('accesstoken') || ""
};


const userSlice  = createSlice({
    name : 'user',
    initialState : initialValue,
    reducers : {
        setUserDetails : (state,action) =>{
            state._id = action.payload?._id
            state.name  = action.payload?.name
            state.email = action.payload?.email
            state.avatar = action.payload?.avatar
            state.mobile = action.payload?.mobile
            state.verify_email = action.payload?.verify_email
            state.last_login_date = action.payload?.last_login_date
            state.status = action.payload?.status
            state.address_details = action.payload?.address_details
            state.shopping_cart = action.payload?.shopping_cart
            state.orderHistory = action.payload?.orderHistory
            state.role = action.payload?.role
        },
        updatedAvatar : (state,action)=>{
            state.avatar = action.payload
        },
        setAccessToken : (state,action)=>{
            state.accesstoken = action.payload
        },
        logout : (state,action)=>{
            state._id = ""
            state.name  = ""
            state.email = ""
            state.avatar = ""
            state.mobile = ""
            state.verify_email = ""
            state.last_login_date = ""
            state.status = ""
            state.address_details = []
            state.shopping_cart = []
            state.orderHistory = []
            state.role = ""
        },
    }
})

export const { setUserDetails,setAccessToken, logout ,updatedAvatar} = userSlice.actions

export default userSlice.reducer