import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'
import useTelegramUser from '../hookscopy/useTelegramUser'
import { BackButton } from '@vkruglikov/react-telegram-web-app'
import { useTranslation } from 'react-i18next'
const parseJSON = (jsonString) => {
  try {
    return (new Function('return ' + jsonString))();
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    return null;
  }
};
const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
  // const userString = localStorage.getItem('user');
  // const user = parseJSON(userString);
  // Parse the JSON string into a JavaScript object
  // const user = userString ? JSON.parse(userString) : null;
  console.log("user...................",user)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            // localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
   }
   
   const tguser = useTelegramUser();
   const handleBackButtonClick = () => {

    window.history.back(); // Example: goes back in the browser history
  };
const {t}=useTranslation()
  return (
    <div className='md:bg-white'>
 <BackButton onClick={handleBackButtonClick}/>
        <div className='font-semibold'>{t('my_account')}</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{tguser?.first_name   || user.mobile||"user"} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
            <HiOutlineExternalLink size={15}/>
          </Link>
        </div>

        <Divider/>

        <div className=' text-sm grid gap-1'>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className='px-2  py-1'>Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2  py-1'>Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2  py-1'>Upload Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className='px-2  py-1'>Product</Link>
              )
            }

            <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2  py-1'>{t('my_orders')}</Link>

            <Link onClick={handleClose} to={"/dashboard/address"} className='px-2  py-1'>{t('saved_address')}</Link>

            {/* <button onClick={handleLogout} className='text-left px-2  py-1'>Log Out</button> */}

        </div>
    </div>
  )
}

export default UserMenu
