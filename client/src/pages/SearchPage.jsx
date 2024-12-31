import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import { BackButton } from '@vkruglikov/react-telegram-web-app'
import Search from '../components/Search'
import toast from "react-hot-toast"
const SearchPage = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage] = useState(1)
  const params = useLocation()
  // const searchText = params?.search?.slice(3)
  const [searchText, setSearchText] = useState("");
  const fetchData = async() => {
    try {
      setLoading(true)
        const response = await Axios({
            ...SummaryApi.searchProduct,
            data : {
              search : searchText .toString(),
              page : page,
            }
        })
 
        const { data : responseDataq } = response
        // const responseDataq = typeof response.data === "string" 
        // ? JSON.parse(response.data) 
        // : response.data
                                            
        if(responseDataq?.success){
            if(responseDataq?.page == 1){
              setData(responseDataq?.data)
            }else{
              setData((preve)=>{
                return[
                  ...preve,
                  ...responseDataq?.data
                ]
              })
            }
            setTotalPage(responseDataq?.totalPage)
            console.log(responseDataq)
        }
    } catch (error) {
      toast.error(`Error: ${error.message || "Unknown error occurred"}`);
        AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchData()
  },[page,searchText])



  const handleFetchMore = ()=>{
    if(totalPage > page){
      setPage(preve => preve + 1)
    }
  }
  const handleBackButtonClick = () => {
    console.log('Hello, I am back button!');
    // You can handle custom navigation logic here if needed
    window.history.back(); // Example: goes back in the browser history
  };
  return (
    <section className=''>
 
       <BackButton onClick={handleBackButtonClick} />
      <div className='container mx-auto p-4'>
        <p className='font-semibold pb-1'>Search Results: {data.length}  </p>
<Search searchText={searchText} setSearchText={setSearchText} />
        <InfiniteScroll
              dataLength={data?.length}
              hasMore={true}
              next={handleFetchMore}
        >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
              {
                data.map((p,index)=>{
                  return(
                    <CardProduct data={p} key={p?._id+"searchProduct"+index}/>
                  )
                })
              }

            {/***loading data */}
            {
              loading && (
                loadingArrayCard.map((_,index)=>{
                  return(
                    <CardLoading key={"loadingsearchpage"+index}/>
                  )
                })
              )
            }
        </div>
        </InfiniteScroll>

              {
                //no data 
                !data[0] && !loading && (
                  <div className='flex flex-col justify-center items-center w-full mx-auto'>
                    <img
                      src={noDataImage} 
                      className='w-full h-full max-w-xs max-h-xs block'
                    />
                    <p className='font-semibold my-2'>No Data found</p>
                  </div>
                )
              }
      </div>
    </section>
  )
}

export default SearchPage
