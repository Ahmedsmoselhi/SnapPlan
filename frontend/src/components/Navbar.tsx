import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './logo';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const [nav, setNav] = useState<boolean>(false);

    const handleNav = () => {
        setNav(!nav);
    };

    const navItems = [
        { id: 1, text: 'Explore', path: '/attendee/Explore' },
        { id: 2, text: 'Booked Events', path: '/attendee/BookedEvents' },
        { id: 3, text: 'Account', path: '/attendee/Account' },
    ];

    return (
        <div className='bg-gray-200 flex justify-between items-center h-24 max-w-full px-4 text-slate-900'>
            {/* Logo */}
            <Link to='/organizer/Home'>
                <h1 className='w-full font-bold'> <Logo size='text-3xl' /> </h1>
            </Link>

            {/* Desktop Navigation */}
            <ul className='hidden md:flex'>
                {navItems.map(item => (
                    <li key={item.id}>
                        <Link
                            to={item.path}
                            className='p-4 hover:text-orange-400 rounded-xl m-2 cursor-pointer duration-300 whitespace-nowrap block'
                        >
                            {item.text}
                        </Link>
                    </li>
                ))
                }
            </ul >

            {/* Mobile Navigation Icon */}
            < div onClick={handleNav} className='block md:hidden' >
                {nav ? <X size={20} /> : <Menu size={20} />}
            </div >

            {/* Mobile Navigation Menu */}
            < ul
                className={
                    nav
                        ? 'fixed md:hidden left-0 top-0 w-[50%] h-full border-r border-r-gray-900 bg-gray-200 ease-in-out duration-500 z-1'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                }
            >
                {/* Mobile Logo */}
                <Link to='/organizer/Home'>
                    < h1 className='w-full text-3xl font-bold m-4' > <Logo size='text-3xl' /></h1 >
                </Link>

                {/* Mobile Navigation Items */}
                {
                    navItems.map(item => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className='p-4 hover:text-orange-400 rounded-xl m-2 cursor-pointer duration-300 whitespace-nowrap block'
                            >
                                {item.text}
                            </Link>
                        </li>
                    ))
                }
            </ul >
        </div >
    );
};

export default Navbar;
