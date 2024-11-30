// this file contains the header component that will be used in the layout component
// it contains the logo and the navigation links
// it also contains the cart and sign in buttons
// the cart button will take the user to the cart page
// the sign in button will take the user to the sign in page
// the logo will take the user to the home page

import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import Menu from './menu'

const Header = async () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/assets/icons/logo.svg"
              // this controls the size of the logo
              width={48}
              height={48}
              alt={`${APP_NAME} logo`}
            />
            {APP_NAME}
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  )
}

export default Header
