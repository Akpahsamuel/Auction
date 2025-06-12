import { IoMdBasket } from "react-icons/io";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="py-5 max-w-[600px] h-screen max-h-[600px] flex flex-col gap-4 items-center justify-center">
        <IoMdBasket size={160} className="text-gray-500" />
        <p className="text-3xl font-semibold">
          Ooops!!! Lost in the wilderness!
        </p>
        <p className="text-gray-500 text-center">
          The page you are looking for is currently not availabe or probably
          under construction! Click on the button below to return to where you
          were coming from!
        </p>
        <button className="bg-[#006fee] h-[40px] rounded-xl text-white font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 flex justify-center gap-1.5 items-center w-full text-[8px] shadow-md shadow-black/20">
          <span className="text-[14px]">Back to previous page</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
