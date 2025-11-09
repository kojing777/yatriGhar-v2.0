import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import logo from '../../assets/yatri.png'

const Navbar = () => {
  return (
    <div className='flex  justify-between items-center px-4  md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
        <Link to="/">
          <img src={logo} alt="logo" className='h-12 px-6  opacity-80'/>
        </Link>
        <UserButton/>
    </div>
  )
}

export default Navbar