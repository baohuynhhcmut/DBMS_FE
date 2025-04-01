import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'

const MenuUser = () => {
  return (
    <Menu>
      <MenuButton>My account</MenuButton>
      <div className='bg-white z-[1000] relative'>
        <MenuItems anchor="bottom">
            <MenuItem>
            <a className="block data-[focus]:bg-blue-100" href="/settings">
                Settings
            </a>
            </MenuItem>
            <MenuSeparator className="my-1 h-px bg-black" />
            <MenuItem>
            <a className="block data-[focus]:bg-blue-100" href="/support">
                Support
            </a>
            </MenuItem>
            <MenuItem>
            <a className="block data-[focus]:bg-blue-100" href="/license">
                License
            </a>
            </MenuItem>
        </MenuItems>
      </div>
    </Menu>
  )
}
export default MenuUser