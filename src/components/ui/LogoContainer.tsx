import { Link } from "react-router-dom"

const LogoContainer = () => {
  return (
    <Link to={"/"}>
        <img className="w-[40px] object-contain mt-1" src="./assets/svg/logo.svg" alt="" />
    </Link>
  )
}

export default LogoContainer
