import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { MainButton } from '@vkruglikov/react-telegram-web-app';
import useTelegramUser from '../hookscopy/useTelegramUser'
import Search from '../components/Search'
const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()
  const user = useTelegramUser();
  const handleButtonClick = async () => {
    if (!user) {
      console.error('User data not found!');
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot6109494690:AAGHFhZ0U9v5tz2Ii0rVlE3xm2j4bg5OaVA/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: user.id, // User's Telegram ID
          text: `Hello, ${user.first_name}! This is a test message from the Telegram Web App.`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Message sent successfully:', result);
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      console.log(url)
  }

    const location = useLocation();
  const telegram = useTelegramUser()
    const isLoginPage = location.pathname === '/login';
    const isSearchPage = location.pathname === "/search"
  return (
   <section className='bg-[var(--tg-theme-bg-color)]'>
              { !isLoginPage&&    <div className="flex py-2 gap-2 justify-center items-center">
                <p className='text-[var(--tg-theme-hint-color)]'>Welcome</p>
                <p className="text-[var(--tg-theme-text-color)] font-semibold">{telegram?.first_name}</p>
            </div>}
       {    !isLoginPage&& <div className='container mx-auto px-2 lg:hidden'>
                <Search />
             
            </div>}
      <div className='container mx-auto'>

          <div className={`w-full my-5  h-full min-h-20 rounded ${!banner && "animate-pulse my-2 " } `}>
              <img
                src={banner}
                className='w-full h-full hidden lg:block'
                alt='banner' 
              />
              <img
                src={banner}
                className='mt-1 bg-[var(--tg-theme-bg-color)] rounded w-full  h-full lg:hidden'
                alt='banner' 
              />
          </div>
      </div>
      <p className='px-4 mx-auto text-sm font-semibold'>Categories</p>
      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2'>

          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div key={cat._id+"displayCategory"} className='w-full h-full bg-[var(--tg-theme-secondary-bg-color)] border-bg-[var(--tg-theme-bg-color)]' onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}>
                    <div>
                        <img 
                          src={cat.image}
                          className='w-full h-full object-scale-down'
                        />
                        {/* <p className='text-xs'>jdsdsd</p> */}
                    </div>
                  </div>
                )
              })
              
            )
          }
      </div>

      {/***display category product */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }

<MainButton text="Send Message" onClick={handleButtonClick} />

   </section>
  )
}

export default Home
