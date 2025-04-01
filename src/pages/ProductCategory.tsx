import { useState } from "react"
import { CategoryProps, ProductProps } from "../type"
import { useParams } from "react-router-dom"


const ProductCategory = () => {


    const [products,setProducts] = useState<ProductProps[]>([])
    const [category,setCategory] = useState<CategoryProps[]>([])

    const { nameCategory  } = useParams()

    console.log(nameCategory)

    return (
        <div>
            abc
        </div>
    )
}

export default ProductCategory