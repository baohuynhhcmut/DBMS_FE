import Container from "./Container"
import { HighlightsType } from "../type"
import { getData } from "../lib"
import config from "../config/api-config"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


const Highlight = () => {

  const [highlight, setHighlight] = useState<HighlightsType[]>([])

  useEffect(() => {
          const fetchAPI = async () => {
              const endpoint = `${config?.baseUrl}highlightsProducts`;
              try {
                  const data = await getData(endpoint)
                  setHighlight(data)
              } catch (error) {
                  console.log(error)
                  throw error
              }
          }
          fetchAPI()
      }, [])

  return (
    <Container className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {highlight.map((item) => (
            <div className="flex flex-col items-center shadow-md rounded-md p-4 transition-transform scale-90 hover:scale-100 duration-200">
                <img src={item.image} alt={item.title} className="w-60 h-60 object-cover " />
                <span className="font-bold text-2xl">{item.name}</span>
                <span className="text-lg font-bold text-gray-500">{item.title}</span>
                <Link to={item._base} className="text-center w-44 p-2 bg-white shadow-lg text-black rounded-lg font-bold hover:bg-black hover:text-white">{item.buttonTitle}</Link>
            </div>
        ))}
    </Container>
  )

}
export default Highlight