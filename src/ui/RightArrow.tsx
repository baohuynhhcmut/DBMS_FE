import { HiArrowCircleRight } from "react-icons/hi"



export const RightArrow = ({ onClick, ...rest }:any) => {

  return (
   <button 
    className="absolute right-0 text-[32px] text-gray-700 hover:text-black"
   >
        <HiArrowCircleRight onClick={() => onClick()} />
   </button>
  )
}