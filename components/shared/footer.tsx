// Code: Footer component. It shows the app name and the project name.

import { APP_NAME } from '@/lib/constants'
const Footer = () => {
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {APP_NAME}.Databases Project Sem 5 .
      </div>
    </footer>
  )
}
export default Footer
