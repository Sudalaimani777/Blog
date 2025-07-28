import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from "./Pages/Contact";
import { Route, Routes } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
        <Navbar />
        <Routes>
            <Route path='/' element={< Home/>} />
            <Route path="/About" element={<About />} />
            <Route path='/Contact' element={<Contact />}/>
        </Routes>
    </div>
  )
}

export default Layout;