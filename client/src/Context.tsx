import { createContext, useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import { useHistory } from "react-router"

export const myContext = createContext<{
  user: any
  logout: any
  setUser: any
}>({ setUser: null, user: null, logout: null })
export default function Context(props: any) {
  const history = useHistory()
  const [userObject, setUserObject] = useState<any>()
  const logout = () => {
    setUserObject(null)
  }
  useEffect(() => {
    axios
      .get(`http://localhost:5000/getuser`, { withCredentials: true })
      .then((res: AxiosResponse) => {
        console.log(res?.data)
        if (res?.data && res.data.user) {
          setUserObject(res.data.user)
        }
      })
      .catch((e) => console.log(e.message))
  }, [history])
  const setUser = () => {
    axios
    .get(`http://localhost:5000/getuser`, { withCredentials: true })
    .then((res: AxiosResponse) => {
      console.log(res?.data)
      if (res?.data && res.data.user) {
        setUserObject(res.data.user)
      }
    })
    .catch((e) => console.log(e.message))
  }
  return (
    <myContext.Provider value={{ user: userObject, logout, setUser }}>
      {props.children}
    </myContext.Provider>
  )
}
