import axios from "axios"
import { useState } from "react"
import { useHistory } from "react-router"
import styles from './Register.module.css'

export default function RegisterPage() {
  const history = useHistory()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [username, setusername] = useState("")
  
  const Register =async ()=>{
      try {
        const {data} = await axios.post('http://localhost:5000/register',{username,email,password},{withCredentials:true})
        if (data.success && data.user) {
          history.push('/login')
        }
      } catch (error) {
        console.log(error.message);
        
      
  }
    }

      

  return (
        <div className={styles.form}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            className={styles.input}

            value={email}
            onChange={(e) => setemail(e.target.value)}
          />

    <br/>
          <label htmlFor="email" className={styles.label}>password</label>
          <input
            type="password"
            name="password"
            value={password}
            className={styles.input}

            onChange={(e) => setpassword(e.target.value)}
          />
           <br/>
          <label htmlFor="username"  className={styles.label}>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            className={styles.input}
            onChange={(e) => setusername(e.target.value)}
          />
          <button onClick={Register} >Register</button>
        </div>
  )
}
