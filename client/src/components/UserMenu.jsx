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
import { AiOutlineDashboard, AiOutlineUnorderedList } from "react-icons/ai";
import { FaList, FaBoxes, FaUpload, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
const parseJSON = (jsonString) => {
  try {
    return (new Function('return ' + jsonString))();
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    return null;
  }
};
const UserMenu = ({close}) => {
  //  const user = useSelector((state)=> state.user)
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
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

  const getLinkClasses = (path) =>
    `px-2 py-2 flex items-center gap-2 rounded ${
      location.pathname === path ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100"
    }`;
const {t}=useTranslation()
  return (
    <div className='md:bg-white'>
 <BackButton onClick={handleBackButtonClick}/>
        <div className='font-semibold'>{t('my_account')}</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{tguser?.first_name   ||""} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
            <HiOutlineExternalLink size={15}/>
          </Link>
        </div>

        <Divider/>

        <div className='text-sm grid gap-5 p-2'>
      {isAdmin(user.role) && (
        <Link onClick={handleClose} to="/dashboard/" className={getLinkClasses("/dashboard/")}>
          <AiOutlineDashboard /> Dashboard
        </Link>
      )}
      {isAdmin(user.role) && (
        <Link onClick={handleClose} to="/dashboard/category" className={getLinkClasses("/dashboard/category")}>
          <FaList /> Category
        </Link>
      )}
      {isAdmin(user.role) && (
        <Link onClick={handleClose} to="/dashboard/subcategory" className={getLinkClasses("/dashboard/subcategory")}>
          <AiOutlineUnorderedList /> Sub Category
        </Link>
      )}
      {isAdmin(user.role) && (
        <Link onClick={handleClose} to="/dashboard/upload-product" className={getLinkClasses("/dashboard/upload-product")}>
          <FaUpload /> Upload Product
        </Link>
      )}
      {isAdmin(user.role) && (
        <Link onClick={handleClose} to="/dashboard/product" className={getLinkClasses("/dashboard/product")}>
          <FaBoxes /> Product
        </Link>
      )}
      <Link onClick={handleClose} to="/dashboard/myorders" className={getLinkClasses("/dashboard/myorders")}>
        <FaShoppingCart /> {t('my_orders')}
      </Link>
      <Link onClick={handleClose} to="/dashboard/address" className={getLinkClasses("/dashboard/address")}>
        <FaMapMarkerAlt /> {t('saved_address')}
      </Link>
    </div>
    </div>
  )
}

export default UserMenu
