import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({close}) => {
    const { register, handleSubmit,reset } = useForm()
    const { fetchAddress } = useGlobalContext()
    const tg = window.Telegram?.WebApp;
    const theme = tg?.themeParams; // Get theme parameters

    const toastStyle = {
        background: theme?.bg_color || '#333',   // Default background color (fallback if undefined)
        color: theme?.text_color || '#fff',       // Text color
        borderRadius: '8px',                      // Optional styling
        padding: '12px',                          // Optional styling
    }; 
    const onSubmit = async(data)=>{

        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data : {
                    address_line :data.addressline,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message,{style:toastStyle})
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className=' bg-[var(--tg-theme-secondary-bg-color)]  fixed top-0 left-0 right-0 bottom-0 z-50  h-screen overflow-auto '>
        <div className='p-4 w-full max-w-lg mt-8 mx-auto rounded'>
            <div className='flex justify-between items-center gap-4 z-40 '>
                <h2 className='font-semibold '>Add Address</h2>
                <button onClick={close} className='hover:text-red-500'>
                    <IoClose  size={25}/>
                </button>
            </div>
            <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-1'>
                    <label htmlFor='addressline'>Address  :</label>
                    <input
                        type='text'
                        id='addressline' 
                        className='border bg-[var(--tg-theme-secondary-bg-color)] p-2 rounded'
                        {...register("addressline",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='city'>Sub City :</label>
                    <input
                        type='text'
                        id='city' 
                        className='border bg-[var(--tg-theme-secondary-bg-color)] p-2 rounded'
                        {...register("city",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='state'>State :</label>
                    <input
                        type='text'
                        id='state' 
                        className='border bg-[var(--tg-theme-secondary-bg-color)] p-2 rounded'
                        {...register("state",{required : true})}
                    />
                </div>
                {/* <div className='grid gap-1'>
                    <label htmlFor='pincode'>Pincode :</label>
                    <input
                        type='text'
                        id='pincode' 
                        className='border bg-[var(--tg-theme-secondary-bg-color)] p-2 rounded'
                        {...register("pincode",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='country'>Country :</label>
                    <input
                        type='text'
                        id='country' 
                        className='border bg-[var(--tg-theme-secondary-bg-color)] p-2 rounded'
                        {...register("country",{required : true})}
                    />
                </div> */}
                <div className='grid gap-1'>
                    <label htmlFor='mobile'>Mobile No. :</label>
                    <input
                        type='text'
                        id='mobile' 
                        className='border bg-[var(--tg-theme-secondary-bg-color)] p-2 rounded'
                        {...register("mobile",{required : true})}
                    />
                </div>

                <button type='submit' className='bg-[var(--tg-theme-button-color)] w-full  py-2 font-semibold mt-4 hover:bg-primary-100'>Submit</button>
            </form>
        </div>
    </section>
  )
}

export default AddAddress
