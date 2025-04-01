import { useEffect, useState } from "react"
import BannerCategory from "./ui/BannerCategory"
import CategorySection from "./ui/CategorySection"
import Highlight from "./ui/Highlight"
import { HomeBanner } from "./ui/HomeBanner"
import ProductSection from "./ui/ProductSection"
import Loading from "./ui/Loading"

function App() {

  const [loading,setLoading ] = useState(false)
  useEffect(() => {
    const loadingImage = () => {
      setLoading(true)
      setTimeout(() => setLoading(false),1000)
    }
    loadingImage()
  },[])


    return(
      <>
        {loading ? <Loading /> : (
          <>
             <BannerCategory />
          <HomeBanner />
          <Highlight />
          <CategorySection />
          <ProductSection />
          </>
        )}
      </>
    )
}

export default App
