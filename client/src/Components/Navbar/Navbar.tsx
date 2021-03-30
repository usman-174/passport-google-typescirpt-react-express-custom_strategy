import { useContext } from "react"
import styles from "./Navbar.module.css"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import { myContext } from "../../Context"
export default function NavBar() {
  const context  = useContext(myContext)

  const router = useHistory()
  const Logout = async () => {
    const { data } = await axios.get("http://localhost:5000/auth/logout", {
      withCredentials: true,
    })
    if (data) {
      context.logout() 
      router.push("/")
      console.log(data)
    }
  }
  return (
    <div className={styles.navBarWrapper}>
      <ul className={styles.navBar}>
        <li>
          <Link to="/">Home</Link>
        </li>

       {!context.user? <>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </>
  :
        <li>
          <Link to="/login" onClick={Logout}>
            Logout
          </Link>
        </li>}
      </ul>
    </div>
  )
}
