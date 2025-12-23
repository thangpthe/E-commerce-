import React from 'react'
import {TbBrandMeta} from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
const Topbar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        <div className="container mx-auto flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-gray-300">
                    <TbBrandMeta className='h-5 w-5'/>
                </a>
                <a href="#" className="hover:text-gray-300">
                    <IoLogoInstagram className='h-5 w-5'/>
                </a>
            </div>

            <div className="text-sm text-center grow">
                <span>We ship worldwide - Fast and reliable shipping!</span>
            </div>
            <div className="text-sm hidden md-black">
                <a href="tel:+1234567890" className='hover:text-gray-300'>
                    +1 (234) 567-890
                </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar;