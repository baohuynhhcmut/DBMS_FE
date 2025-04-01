import { HiArrowCircleLeft } from "react-icons/hi"


export const LeftArrow = ({ onClick, ...rest }:any) => {

  return (
   <button 
    className="absolute left-0 text-[32px] text-gray-700 hover:text-black"
   >
        <HiArrowCircleLeft onClick={() => onClick()} />
   </button>
  )
}