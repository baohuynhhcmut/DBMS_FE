import { RotatingLines } from "react-loader-spinner"

const Loading = () => {
  return (
    <div className="w-full h-full absolute top-0 left-0 flex flex-col items-center justify-center bg-black/60 bg-opacity-50 z-50">
        <RotatingLines
            visible={true}
            width="96"
            // color="grey"
            strokeColor="white"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
        />
        <p className="text-xl font-bold uppercase text-white">Loading ...</p>
    </div>
  )
}
export default Loading

