import { useEffect } from "react"
import Footer from "./Footer"
import Header from "./Header"
import { Toaster } from "react-hot-toast"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { store } from "../lib/store"

type Props = {
    children: React.ReactNode
}
const auth = getAuth()

const Layout = ({children} : Props) => {

    const { getUserInfo } = store()

    useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
        getUserInfo(user?.uid)
    })

    return () => unSub()
    
  },[getUserInfo])



  return (
    <>
        <Header />
            {children}
        <Footer />
        <Toaster 
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            // toastOptions={{
            //     style: {
            //         background: '#fff',
            //         color: '#',
            //       },
            // }}
        />
    </>
  )
}
export default Layout
