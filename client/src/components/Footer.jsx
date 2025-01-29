import React from 'react'
import { FaTelegram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t'>
        <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
        <p>
        Made with <span role="img" aria-label="heart" style={{ color: 'red' }}>❤️</span> by 
        <a 
          href="https://abnet-wolde-dev.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer" 
          className='text-[var(--tg-theme-button-light-color)]'
          style={{ color: '', marginLeft: '5px' }}
        >
          Abnet 
        </a>
        {/* <p>{new Date().getFullYear()}</p> */}
      </p>
            <div className='flex items-center gap-4 justify-center text-xl'>
            <a href='https://www.linkedin.com/in/abnet-wolde-8b3923220/' className='hover:text-blue-500'>
                    <FaLinkedin/>
                </a>
                <a href='https://github.com/Abenetwolde' className='hover:text-blue-500'>
                    <FaGithub/>
                </a>
                <a href='https://t.me/abnet_abi' className='hover:text-blue-500'>
                    <FaTelegram/>
                </a>
          
          
            </div>
        </div>
    </footer>
  )
}

export default Footer
