import React, { useEffect, useState } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { MainButton } from '@vkruglikov/react-telegram-web-app';
import useTelegramUser from '../hookscopy/useTelegramUser'
import Search from '../components/Search'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useTranslation } from 'react-i18next'

import 'swiper/css';
import CardLoading from '../components/CardLoading'


const Home = () => {
  const { t } = useTranslation();
  const userState = useSelector((state) => state?.user);
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

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

    navigate(url)
    console.log(url)
  }
  const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   // Retrieve user data from localStorage
  //   const user = localStorage.getItem('user');
  //   if (user) {
  //     setUserData(JSON.parse(user));
  //   }
  // }, []);
  const location = useLocation();
  const telegram = useTelegramUser()
  const isLoginPage = location.pathname === '/login';
  const isSearchPage = location.pathname === "/search"
  
  const loadingCardNumber = new Array(6).fill(null)
  return (
    <>
    <section className='bg-[var(--tg-theme-bg-color)]'>
      {!isLoginPage && <div className="flex py-2 gap-2 justify-center items-center">
        <p className='text-[var(--tg-theme-hint-color)]'>{t('welcome')}</p>
        <p className="text-[var(--tg-theme-text-color)] font-semibold">{telegram?.first_name}</p>
        {/* {user?.photo_url && (
            <img
              src={telegram.photo_url}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          )} */}
      </div>}
      {!isLoginPage && <div className='container mx-auto px-2 lg:hidden'>
        <Search />

      </div>
      }
      
      {/* <div className='container mx-auto'>
       
        {userState && (
          <div className="mt-4 p-4  shadow-md rounded">
            <h2 className="text-lg font-semibold">User Data:</h2>
            <pre className="text-sm">{userData}</pre>
            <h2 className="text-lg font-semibold">accesstoken:</h2>
            <pre className="text-sm">{localStorage.getItem('user')?"ture":"false"}</pre>
          </div>
        )}
      </div> */}

        {/* <Swiper
          spaceBetween={10}

          slidesPerView={1} // Display 1 image at a time
          loop={true} // Enable looping through images
          pagination={{
            clickable: true, // Makes pagination dots clickable
            // el: '.swiper-pagination', // Custom pagination class
          }}// Add pagination controls
          autoplay={{
            delay: 4000, // Delay between slide transitions (in ms)
            disableOnInteraction: true, // Autoplay continues even if user interacts with Swiper
          }}
          navigation // Enable navigation buttons
          modules={[Autoplay, Pagination, Navigation]}
        >
\
          <SwiperSlide>
            <div className={`w-full my-5 h-full min-h-20 rounded ${!banner && "animate-pulse my-2 "}`}>
              <img
                src={banner}
                className='mt-1 bg-[var(--tg-theme-bg-color)] rounded w-full h-full lg:hidden'
                alt='banner'
              />
            </div>

          </SwiperSlide>
          <SwiperSlide>
            <div className={`w-full my-5 h-full min-h-20 rounded ${!banner && "animate-pulse my-2 "}`}>
              <img
                src={banner}
                className='mt-1 bg-[var(--tg-theme-bg-color)] rounded w-full h-full lg:hidden'
                alt='banner'
              />
            </div>
          </SwiperSlide>

      
        </Swiper> */}
            {/* <div>
      {userData ? (
        <div>
          <p><strong>First Name:</strong> {userData?.first_name}</p>
          <p><strong>Last Name:</strong> {userData?.last_name || "N/A"}</p>
          <p><strong>Username:</strong> {userData?.username || "N/A"}</p>
          <p><strong>Language Code:</strong> {userData.language_code}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div> */}
        <div className="swiper-pagination"></div>
      {/* </div> */}
      
      <p className='px-4 mx-auto text-sm font-semibold '>{t('category')}</p>
      <div className='container mx-auto px-4 my-2 overflow-x-auto no-scrollbar '>
  <div className='flex gap-2'>
    {
      loadingCategory ? (
        new Array(5).fill(null).map((_, index) => (
          <div
            key={index + "loadingcategory"}
            className="bg-tg-theme-secondary-bg rounded-lg min-h-10 flex-shrink-0 w-40 shadow relative overflow-hidden"
          >
            {/* Themed Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--tg-theme-button-light-color)] to-transparent animate-shimmer"></div>

            {/* Placeholder for image */}
            {/* <div className="bg-[var(--tg-theme-text-color)]/10 min-h-24 rounded-lg"></div> */}

            {/* Placeholder for text */}
            {/* <div className="bg-[var(--tg-theme-text-color)]/10 h-8 rounded-lg"></div> */}
          </div>
        ))
      ) : (
        categoryData.map((cat, index) => {
          return (
            <div key={cat._id + "displayCategory"} className='w-20 flex-shrink-0 rounded-lg h-full bg-[var(--tg-theme-secondary-bg-color)] border-bg-[var(--tg-theme-bg-color)]' onClick={() => handleRedirectProductListpage(cat._id, cat.name)}>
              <div className='rounded-sm overflow-hidden p-1'>
                <img
                 src={cat?.image?.replace(/^http:/, 'https:')}
                  className='w-full h-full object-scale-down'
                />
                <p className='text-[var(--tg-theme-text-color)] p-1 text-xs text-center whitespace-normal break-words'>{cat?.name}</p>
              </div>
            </div>
          )
        })
      )
    }
  </div>
</div>

      {/***display category product */}
      {loadingCategory&&<p className='px-4 mb-2 mx-auto text-sm font-semibold'>Products</p> }
      {
        loadingCategory ?  (
        
          <div>
          {/* <h2 className="text-lg font-semibold mb-4">Products</h2> */}
          <div className="px-4 grid grid-cols-2 gap-5">
            {loadingCardNumber.map((_, index) => (
              <CardLoading key={"CategorywiseProductDisplay123" + index} />
            ))}
          </div>
        </div>
        ) :
        categoryData?.map((c, index) => {
          return (
            <CategoryWiseProductDisplay
              key={c?._id + "CategorywiseProduct"}
              id={c?._id}
              name={c?.name}
            />
          )
        })
      }

      {/* <MainButton text="Send Message" onClick={handleButtonClick} /> */}

    </section>
    </>
  )
}

export default Home
