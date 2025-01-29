import React from 'react'

const CardLoading = () => {
  return (
    <div className='bg-tg-theme-secondary-bg  min-h-10 shadow relative overflow-hidden border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer  animate-pulse'>
      <div className='min-h-24 inset-0 bg-gradient-to-r from-transparent via-[var(--tg-theme-button-light-color)] to-transparent animate-shimmer rounded'>
      </div>
      <div className='p-2 lg:p-3  inset-0 bg-gradient-to-r from-transparent via-[var(--tg-theme-button-light-color)] to-transparent animate-shimmer rounded w-20'>
      </div>
      <div className='p-2 lg:p-3inset-0 bg-gradient-to-r from-transparent via-[var(--tg-theme-button-light-color)] to-transparent animate-shimmer rounded'>
      </div>
      <div className='p-2 lg:p-3 inset-0 bg-gradient-to-r from-transparent via-[var(--tg-theme-button-light-color)] to-transparent animate-shimmer rounded w-14'>
      </div>

      <div className='flex items-center justify-between gap-3'>
        <div className='p-2 lg:p-3 inset-0 bg-gradient-to-r from-transparent via-[var(--tg-theme-button-light-color)] to-transparent animate-shimmer rounded w-20'>
        </div>
        <div className='p-2 lg:p-3 inset-0 bg-gradient-to-r from-transparent via-[var(--tg-theme-button-light-color)] to-transparent animate-shimmer rounded w-20'>
        </div>
      </div>

    </div>
  )
}

export default CardLoading
