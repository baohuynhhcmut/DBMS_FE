import { store } from "../lib/store"
import Container from "../ui/Container"
import ProductCart from "../ui/ProductCart"



const Favorite = () => {

  const { favoriteProduct  } = store()

  return (
    <Container className="">
        {/* {favoriteProduct.map(item) => {
            
        }} */}
        abc
    </Container>
  )
}

export default Favorite