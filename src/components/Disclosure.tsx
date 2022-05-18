import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Moralis from "moralis/types";
import type { metadata } from "../hooks/useLoadNFTs";
import NFTTile from "./NFTTile";

interface props {
  collectionName: string;
  filteredNFTs: metadata[];
  listNFT: (arg0: any) => void;
}

//display each nft under the disclosure of corresponding collection
export default function MyDisclosure(props: props) {
  return (
    <div className="w-10/12 px-4 pt-4 mx-auto">
      <div className="p-2 bg-transparent rounded-2xl">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left border-b rounded-lg bg-background text-grey border-[#1E1E1E]">
                <span className="text-onBackground">{props.collectionName}</span>
                <FontAwesomeIcon
                  icon={faChevronUp}
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-onBackground`}
                />
              </Disclosure.Button>
              <div className="md:flex w-max">
                {props.filteredNFTs &&
                  props.filteredNFTs.map((nft: any, i: any) => (
                    <Disclosure.Panel
                      key={i}
                      className="px-4 pt-4 pb-2 text-sm text-onBackground"
                    >
                      <NFTTile
                        nft={nft}
                        callback={props.listNFT}
                        button="List"
                      />
                    </Disclosure.Panel>
                  ))}
              </div>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
