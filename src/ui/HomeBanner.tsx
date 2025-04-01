import { homebanner } from "../assets"
import Container from "./Container"

export const HomeBanner = () => {

  return (
    <Container className="relative py-5 overflow-hidden">
        <div className="relative ">
            <img 
                src={homebanner}
                alt="banner"
                className="w-full h-full max-h-[400px] object-cover rounded-md  brightness-50"
            />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-10 gap-y-10 animate-slide-up">
            <h2 className="font-bold text-5xl text-white">Go to Meow products</h2>
            <p className="text-gray-300">And have some great gift for new customer today</p>
            <button className="w-44 p-2 rounded-xl flex font-bold text-xl items-center justify-center text-black bg-white hover:bg-slate-700 hover:text-white">Shop Now</button>
        </div>
    </Container>
  )

}