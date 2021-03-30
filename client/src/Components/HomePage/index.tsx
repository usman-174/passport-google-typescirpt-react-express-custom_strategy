import  { useContext } from 'react';
import { myContext } from '../../Context';


function Home() {
      const {user} = useContext(myContext)
    
    return (
        <div style={{textAlign:'center', margin:'auto'}}>
           {user ? <> <h1>Welcome {user.username}</h1> <br/>
           
            <p>Your Email is {user.email}</p>
           </>: <>
           <h1>You are currently Logged out. To see your profile please Login.</h1>
           </>}
        </div>
    )
}

export default Home
