import React, { useEffect, useState } from "react";
import Toggle from "../src/components/Toggle";
import CreateCollection from "./createcollection";
import Mint from "./mint";
import { useMoralis } from "react-moralis";

function Create() {
  const [collection, setColection] = useState(false);
  const { chainId } = useMoralis();

  return (
    <div className="w-full pb-24 mt-6">
      {chainId == process.env.NEXT_PUBLIC_CHAIN_ID ? (
        <>
          <div className="flex flex-col items-center pt-5 justify-items-center">
            <p className="text-4xl font-bold xs:text-5xl sm:text-6xl text-primary">Create a New</p>
            <p className="text-4xl font-bold xs:text-5xl sm:text-6xl text-primary">Collection or Item</p>
          </div>
          <div className="flex justify-center mt-16 ">
            <Toggle callback={setColection} />
          </div>
          <div className="hidden "></div>
          {!collection ? <CreateCollection /> : <Mint />}
        </>
      ) : (
        <div className="text-xl font-bold text-center text-onBackground">
          <p>YOU&apos;RE ON THE WRONG CHAIN, PLEASE CHANGE TO the MUMBAI TEST NET.</p>
          <p>Your chain: {chainId}</p>
          Required chain : {process.env.NEXT_PUBLIC_CHAIN_ID}
        </div>
      )}
    </div>
  );
}

export default Create;
