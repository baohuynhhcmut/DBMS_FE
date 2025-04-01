import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { FaChevronDown } from "react-icons/fa";
import { CategoryProps } from '../type';
import { Link } from 'react-router-dom';

type Props = {
    category: CategoryProps[]
}

const MenuHeader = ({ category }:Props) => {

    return (
        <Menu>
            <MenuButton className="px-2 border border-gray-300 rounded-md cursor-pointer"> 
                <p className="flex items-center gap-1">
                    Category <FaChevronDown />
                </p>
            </MenuButton>
            <Transition
                enter="transition duration-75 ease-out"
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave="transition duration-75 ease-in"
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
            >
                <MenuItems 
                    className='z-50 w-52 origin-top-right border border-white/5 bg-white p-1 text-sm/6 text-black rounded-md shadow-sm divide-y [--anchor-gap:var(--spacing-1)]'
                    anchor='bottom start'
                >
                    {category?.map((item) => (
                        <MenuItem key={item._id}>
                            <Link to={`/category/${item._base}`} className='flex w-full items-center gap-2 rounded-md py-2 hover:bg-black/10 tracking-wide'>
                                <img 
                                    src={item.image} 
                                    className='w-6 h-6 rounded-md'    
                                />
                                {item.name}
                            </Link>
                        </MenuItem>
                    ))}
                </MenuItems>
            </Transition>
        </Menu>
    )
}

export default MenuHeader