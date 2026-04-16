import logo from "../assets/logo.png"; 
import { Link, NavLink } from "react-router-dom";

// react icons
import { CgFacebook } from 'react-icons/cg';
import { BsInstagram } from 'react-icons/bs'
import { FiClock } from "react-icons/fi";
import { FiPhoneCall  } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";

const Footer = () => {
    
    const FooterLinks = {
        main: [
            {name:"Home", path:"/"},
            {name:"Menu", path:"/menu"},
            {name:"Reservation", path:"/book-table"},
            {name:"Cart", path:"/cart"}
        ],   
    }
    
    return (
        <div className="">

            <footer className="bg-white w-full px-5 lg:px-[70px] md:px-[30px] pt-15 pb-4.5">

                <div className="flex flex-col md:flex-row justify-between gap-5 w-full">
                    
                    {/* Logo + description */}
                    <div className="flex flex-col gap-2 lg:w-1/2">

                        <img src={logo} alt="logo" className="w-[150px]" />

                        <p className="text-gray-600 mt-4 text-sm max-w-[350px] lg:max-w-[450px]">
                            BiteHub is your go-to platform for delicious meals and seamless reservations. BiteHub is your go-to platform for delicious meals and seamless reservations.
                        </p>

                        <div className="flex gap-2 text-[#E09A05] mt-2">

                            <Link to={'#'} className="text-xl p-1.5 hover:text-white transition-colors 
                            duration-300 rounded-full hover:bg-[#E09A05]">
                                <CgFacebook />
                            </Link>

                            <Link to={'#'} className="text-xl p-1.5 hover:text-white transition-colors 
                            duration-300 rounded-full hover:bg-[#E09A05]">
                                <BsInstagram />
                            </Link>
                        
                        </div>

                    </div>

                    {/* Links Sections */}
                    <div className="flex gap-18 md:gap-8 lg:gap-20 lg:w-1/2">

                        {/* Quick Links */}
                        <div className="lg:w-1/2">
                        
                            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Quick Links</h3>

                            <div className="flex flex-col gap-2">
                                { FooterLinks.main.map((links,index)=>         
                                    <NavLink to={links.path} key={index} className={({ isActive }) =>
                                            isActive
                                                ? "text-[#E09A05] flex items-center gap-1"
                                                : "text-sm text-gray-600 hover:text-[#E09A05] transition-colors duration-300 flex items-center gap-1 group"
                                        } >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 hidden 
                                        lg:inline-block lg:opacity-0 -translate-x-2 group-hover:opacity-100 
                                        group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                        {links.name}

                                    </NavLink>
                                )}    

                            </div>

                        </div>

                        {/* Contact Info */}
                        <div className="lg:w-1/3">
                            
                            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Contact Us</h3>
                            
                            <div className="flex flex-col gap-3">

                            {/* Address - Google Maps Link */}

                                <Link to="https://maps.google.com/?q=Clifton+Block+5+Karachi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 flex items-start gap-2 group 
                                    hover:text-[#E09A05] transition-colors duration-300"
                                >
                                    <SlLocationPin className="w-5 h-5 mt-0.5 shrink-0 text-[#E09A05] group-hover:scale-110 transition-transform duration-300"/>
                                    <span >123 Food Street, Block 5,<br/> Clifton, Karachi</span>
                                </Link>

                                {/* Phone - Clickable */}

                                <Link  to="tel:+923333422776"
                                    className="text-sm text-gray-600 flex items-center gap-2 group hover:text-[#E09A05] transition-colors duration-300"
                                >
                                    <FiPhoneCall  className="w-4.5 h-4.5 shrink-0 text-[#E09A05] group-hover:scale-110 transition-transform duration-300"/>
                                    <span>+92 333 3422776</span>
                                </Link>


                                {/* Hours */}
                                <div className="text-sm text-gray-600 flex items-center gap-2 group">
                                    <FiClock className="w-5 h-5 shrink-0 text-[#E09A05]"/>
                                    <span> 7:00 PM – 2:00 AM</span>
                                </div>
                            </div>
                        </div>
                    
                    </div>

                </div>                 

                {/* bottom footer */}
                <div className="border-t border-gray-200 pt-5 flex-row flex items-center gap-4 w-full justify-between mt-8">
                    <p className="text-gray-400 text-[12px]">© 2026 All Rights Reserved.</p>
                    <p className="text-gray-400 text-[12px]">Design By Shahzain khan</p>
                </div>
            
            </footer>
        </div>
        
    );
};

export default Footer;