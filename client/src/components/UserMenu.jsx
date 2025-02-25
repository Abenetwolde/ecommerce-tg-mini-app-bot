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
import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '../provider/fetchData'

const UserMenu = ({close}) => {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });  
  
  //  const user = useSelector((state)=> state.user)
  // const userString = localStorage.getItem('user');
  // const user = JSON.parse(userString);
  // // Parse the JSON string into a JavaScript object
  // // const user = userString ? JSON.parse(userString) : null;
  // console.log("user...................",user)
   const dispatch = useDispatch()
   const navigate = useNavigate()


  

  //  if (isLoading) return <div>Loading...</div>;
  console.log("user..............",user)
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
            navigate("/login")
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
    `md:px-2 md:py-2 py-1 flex items-center md:gap-2 gap-1 rounded ${
      location.pathname === path ? "bg-gray-200 text-gray-800" : "md:hover:bg-gray-100"
    }`;
const {t}=useTranslation()
  return (
 <>
{isLoading?<p>Loading...</p>:
    <div className='md:bg-white'>
          <BackButton onClick={handleBackButtonClick} />
      <div className='font-semibold sm:text-xs'>{t('my_account')}</div>
      <div className='text-sm flex items-center gap-2 sm:gap-1 sm:text-xs'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>{tguser?.first_name || ""} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : user.role === "TESTER" ?"(TESTER)":""}</span></span>
        <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200 sm:hover:text-gray-700'>
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

    <Divider className='h-0.5' />

    <div className='text-sm grid gap-5 p-2 sm:gap-2 sm:text-xs'>
      {(isAdmin(user.role) || user.role === "TESTER") && (
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
      { user.role === "USER" &&<Link onClick={handleClose} to="/dashboard/myorders" className={getLinkClasses("/dashboard/myorders")}>
        <FaShoppingCart /> {t('my_orders')}
      </Link>}
      { user.role === "USER"&&  <Link onClick={handleClose} to="/dashboard/address" className={getLinkClasses("/dashboard/address")}>
        <FaMapMarkerAlt /> {t('saved_address')}
      </Link>}
    
    </div>
  </div>
}
  </>
  )
}

export default UserMenu
