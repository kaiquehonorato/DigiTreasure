import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Carousel from "../src/components/Carousel";

const Home: NextPage = () => {
  return (
    <div className="pt-3 pb-5 pl-4 bg-[#121212]">
      <div className="flex flex-col items-center justify-around p-10 leading-loose lg:flex-row h-10/12 ">
        <div className="flex flex-col items-center px-3 pb-5">
          <p className="text-2xl xs:text-5xl lg:text-6xl xl:text-8xl mt-3 font-bold text-[#E2E2E2]">
            Collect, Sell <br />
            or Create <span className="text-[#46E5FC]">NFTs</span>
          </p>
          <p className="text-[#A2A2A2] my-auto py-3 lg:py-8 xl:py-10 ml-1 xs:w-3/4 font-thin text-lg lg:text-xl">
            Create your own NFTs and put it up for sale directly in the marketplace.
          </p>
          <div className="flex justify-center mt-5">
            <Link href="/explore">
              <button className="text-[#F2F2F2] border-2 border-primary  py-2 px-2 sm:px-5 font-bold rounded-2xl hover:text-black hover:bg-primary ">
                Explore Collections
              </button>
            </Link>
          </div>
        </div>
        {/* <div className="mt-3 mr-9">
          <Image src="/KAIQUE.png" alt="Leprechaun NFT" width="650" height="650" />
        </div> */}
        <Carousel />
      </div>
    </div>
  );
};
export default Home;
