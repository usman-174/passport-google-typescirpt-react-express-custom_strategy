import axios from "axios"
import { useContext, useState } from "react"
import { useHistory } from "react-router"
import github from "../../assests/github.png"
import googleImage from "../../assests/google.jpg"
import { myContext } from "../../Context"
import styles from "./LoginStyle.module.css"

export default function LoginPage() {
  const context  = useContext(myContext)
  const history = useHistory()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const googleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self")
    // window.open("https://o-auth-video-backend.herokuapp.com/auth/google", "_self");
  }

  const githubLogin = () => {
    window.open("http://localhost:5000/auth/github", "_self")
  }
  const logIn =async ()=>{
      console.log(email,password)
      try {
        const {data} = await axios.post('http://localhost:5000/auth/login',{email,password},{withCredentials:true})
        console.log(data);
        context.setUser()
        history.push('/')
      } catch (error) {
        console.log(error.message);
        
      
  }
    }

      

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginForm}>
        <h1>Login</h1>
        <div className={styles.googleContainer} onClick={googleLogin}>
          <img src={googleImage} alt="Google Icon" />
          <p>Login With Google</p>
        </div>
        <div
          className={`${styles.googleContainer} ${styles.githubContainer}`}
          onClick={githubLogin}
        >
          <img src={github} alt="Github Icon" />
          <p>Login With Github</p>
        </div>

        <div className="form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />

    <br/>
          <label htmlFor="email">password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <button onClick={logIn} >LogIn</button>
        </div>
      </div>
    </div>
  )
}
