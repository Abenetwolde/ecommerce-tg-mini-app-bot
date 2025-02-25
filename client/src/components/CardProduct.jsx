import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
  
  return (
    <Link to={url} className='bg-[var(--tg-theme-secondary-bg-color)] border-[var(--tg-theme-hint-color)] py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer ' >
      <div className=' relative min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
            <img 
               src={data.image[0]?.replace(/^http:/, 'https:')}
                // src={data.image[0]}
                className='w-full h-full object-cover lg:scale-125'
            />
               {data.discount && (
                    <div className='absolute top-0 right-0 text-[var(--tg-theme-text-color)] bg-red-500 bg-opacity-80  text-xs  rounded-bl'>
                        {data.discount}% OFF
                    </div>
                )}
      </div>
      <div className='flex items-center gap-1'>
        {/* <div className='rounded text-xs w-fit p-[1px] px-2 text-[var(--tg-theme-text-color)] bg-[var(--tg-theme-bg-color)]'>
              10 min 
        </div> */}
        {/* <div>
            {
              Boolean(data.discount) && (
                <p className=' text-[var(--tg-theme-text-color)] bg-[var(--tg-theme-bg-color)] px-2 w-fit text-xs rounded-full'>{data.discount}% discount</p>
              )
            }
        </div> */}
      </div>
      <div className='px-2 pb-1 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
        {data.name}
      </div>
      {/* <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
        {data.unit} 
        
      </div> */}

      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
        <div className='flex items-center gap-1'>
          <div className='font-semibold'>
              {`${pricewithDiscount(data.price,data.discount)} ETB`} 
          </div>
          
          
        </div>
        <div className=''>
          {
            data.stock == 0 ? (
              <p className='text-red-500 text-sm text-center'>Out of stock</p>
            ) : (
              <AddToCartButton data={data} />
            )
          }
            
        </div>
      </div>

    </Link>
  )
}

export default CardProduct
