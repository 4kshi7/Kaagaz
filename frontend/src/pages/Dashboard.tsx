import { Appbar } from "../components/Appbar";
import { motion } from "framer-motion";

export const Dashboard = () => {
  return (
    <div className="">
      <Appbar />
      <div className="h-screen  w-full flex flex-col items-center justify-center text-center ">
        <div className="mt-24 md:mt-24 overflow-y-hidden  ">
          <motion.div animate={{ y: [-100, 0] }} transition={{ duration: 1.1 }}>
            <h1 className="tracking-tighter text-4xl md:text-5xl lg:text-6xl  xl:text-7xl mb-4 font-medium">
              Welcome to Kaagaz App
            </h1>
          </motion.div>

          <motion.div animate={{ y: [100, 0] }} transition={{ duration: 1.1 }}>
            <h1 className="text-gray tracking-tighter md:text-md xl:text-xl ">
              Where your stories come to life, powered by Generative AI✨.
            </h1>
          </motion.div>
        </div>

        <div className="mb-2 h-80 w-80 md:h-72 md:w-72 ">
          <img
            className="h-full w-full object-cover"
            src="https://i.pinimg.com/originals/ec/90/0c/ec900cf378e31c147d2ae7b5fdba6ce6.gif"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
