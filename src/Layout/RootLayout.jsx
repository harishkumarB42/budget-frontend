import React from 'react'


import Navbar from '../Components/Navbar'

import { Outlet } from 'react-router-dom'

//Outlet – A special component used to display child pages inside the layout.


function RootLayout() {
  return (
    <>
     <Navbar />
    
        <div className="p-6">
        <Outlet/>
        </div>


    </>
  )
}

export default RootLayout