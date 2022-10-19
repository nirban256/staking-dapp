import React from 'react';
import logo from "../images/logo3.png";

// linear-gradient(90deg, #4f6cff 0%, #bb29f7 87.72%)

const Navbar = ({ isConnected, connect }) => {
    return (
        <div>
            <nav className='pt-4 pb-1 text-white sticky top-0 z-10 bg-white'>
                <ul className='flex justify-between align-middle flex-row px-3 md:px-8'>
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