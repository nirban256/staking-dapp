import React from 'react';
import logo from "../images/logo3.png";

// linear-gradient(90deg, #4f6cff 0%, #bb29f7 87.72%)

const Navbar = ({ isConnected, connect }) => {
    return (
        <div className='sticky top-0 z-10'>
            <nav className='pt-2 md:pt-4 pb-1 text-white bg-white mt-0 mb-0 ml-auto mr-auto block relative border-b-[1px] border-solid border-[#e6e6e6]'>
                <ul className='flex flex-row justify-between px-2 md:px-8 py-1 md:py-4 relative mt-0 mb-0 ml-auto mr-auto md:max-w-6xl'>
                    <li className='w-40 md:w-52'>
                        <img src={logo} alt="Baked Bread" />
                    </li>
                    <li>
                        {isConnected() ? (
                            <button type='submit' className="bg-gradient-to-r from-[#4f6cff] to-[#bb29f7] hover:from-[#bb29f7] hover:to-[#4f6cff] px-4 py-2 font-semibold rounded-3xl text-sm md:text-xl md:px-2 border-none outline-none">
                                Connected
                            </button>
                        ) : (
                            <button type='submit' className="bg-gradient-to-r from-[#4f6cff] to-[#bb29f7] hover:from-[#bb29f7] hover:to-[#4f6cff] px-2 py-2 font-semibold text-sm rounded-3xl md:text-xl md:px-4 border-none outline-none" onClick={() => connect()}>
                                Connect Wallet
                            </button>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;