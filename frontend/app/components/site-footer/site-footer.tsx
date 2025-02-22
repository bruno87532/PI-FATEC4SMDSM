import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

export const SiteFooter = () => {
  return (
    <footer className="bg-gray-100 p-4 relative">
      <p className="text-md font-medium text-gray-600 text-center">
        &copy; {new Date().getFullYear()} Todos os direitos reservados.
      </p>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <ul className="flex gap-6">
          <li className="cursor-pointer text-2xl text-gray-900 hover:text-black">
            <FaFacebook />
          </li>
          <li className="cursor-pointer text-2xl text-gray-900 hover:text-black">
            <FaInstagram />
          </li>
          <li className="cursor-pointer text-2xl text-gray-900 hover:text-black">
            <FaTwitter />
          </li>
        </ul>
      </div>
    </footer>
  )
}

