import React from "react";
import type { metadata } from "../hooks/useLoadNFTs";

interface props {
  nft: metadata;
  callback: (nft: metadata) => void;
  button: string;
}

function NFTTile(props: props) {
  const { nft, callback, button } = props;
  return (
    <div>

      <div className="relative w-56 h-auto overflow-hidden border bg-[#1E1E1E] shadow rounded-xl">
          <img className="object-cover w-56 h-56 " src={nft.image} />
        
        <div className="flex flex-col justify-between">
            <div className="px-3 py-4">
              <p className="font-semibold text-3x1 text-primary">{nft.name}</p>
              <div className="grid grid-cols-5">
                <div className="col-span-3 text-onBackground">                 
                  <div className="grid pt-2 grid-col-3">
                    <div className="inline col-span-1 col-start-1">
                      {nft.price && <span>{nft.price} </span>}
                    </div>
                    <div className="inline col-span-1 col-start-2">
                      <span className="float-right pr-2">MATIC</span>
                    </div>
                  </div>
                  <div className="grid grid-col-3">
                    <div className="inline col-span-1 col-start-1">
                      <span className="pr-3">Royalty</span>                   
                    </div>
                    <div className="inline col-span-1 col-start-2">
                      <p className="float-right pr-2">{nft.fee && nft.fee / 10} <span>%</span></p>
                    </div>
                  </div>
                </div> 
              
                <div className="col-span-2 px-2 pt-2 bg-transparent">
                  <button
                    className="px-5 py-3 font-bold text-black rounded-full cursor-pointer bg-secondary hover:bg-primary"
                    onClick={() => {
                      callback(nft);
                    }}
                  >
                    {button}
                  </button>
                </div>

              </div>

            </div>

        </div>

        {/* <span className="absolute px-2 py-1 text-black hover:bg-gray-100 hover:bg-opacity-50 rounded-xl opacity-20 hover:opacity-100 top-2 right-3 ">
          {nft.price && <span>{nft.price}Collection Name</span>}
        </span> */}

      </div>
    </div>
  );
}

export default NFTTile;
