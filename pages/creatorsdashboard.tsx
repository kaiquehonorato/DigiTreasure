import React, { useEffect, useMemo, useState } from "react";
import useLoadNFTs from "../src/hooks/useLoadNFTs";
import ModalListNFT from "../src/components/ModalListNFT";
import type { metadata } from "../src/hooks/useLoadNFTs";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import Disclosure from "../src/components/Disclosure";
import NFTTile from "../src/components/NFTTile";
import { useQuery } from "react-query";
import ToastError from "../src/components/ToastError";
import ToastSucess from "../src/components/ToastSucess";

function CreatorsDashboard() {
  //Moralis variables
  const { isWeb3Enabled, user } = useMoralis();
  //state to store the nft to list in the marketplace
  const [nftToList, setnftToList] = useState<metadata>();
  //state to control the modal to list the nft.
  const [modalOpen, setModalOpen] = useState(false);
  //state to store the all nfts of the user
  const [userNFTsMetada, setUserNFTsMetada] = useState<metadata[]>();
  // store the filtered nfts of the user, use this to filter by collection
  const [filteredNFTs, setFilteredNFTs] = useState<metadata[]>();
  //state to switch between all collections and a specific collection.
  const [allCollections, setAllCollections] = useState<boolean>();
  // state to display message in case the user doesnt have any nft to display
  const [empty, setEmpty] = useState(false);
  // control the success toast in case of  a successful listing.
  const [isSuccess, setIsSuccess] = useState(false);
  // control the error toast in case of a failed listing
  const [isError, setisError] = useState(false);
  //hold the collection information retrieved from moralis.
  const [collectionList, setCollectionList] = useState<
    Moralis.Object<Moralis.Attributes>[]
  >([]);
  //function from custom hook useLoadNFTs
  const fetchNFTs = useLoadNFTs();
  //variable to check when the collection is fully retrieved, avoiding rendering without the proper information
  const { isLoading } = useQuery("collection", {
    enabled: isWeb3Enabled,
    refetchOnWindowFocus: false,
  });

  //Open the modal to list the nft
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  //should fetch nfts when there is a user authenticated and when all the collections has been retrieved
  useEffect(() => {
    executeFectchNFTs();
  }, [isWeb3Enabled, isLoading]);

  const executeFectchNFTs = async () => {
    //guardian clause, exit case there is no authenticated user or when the collection is still loading
    if (!isWeb3Enabled && !isLoading) return;
    try {
      //fetch the nfts using the custom hook useLoadNFTS
      const [_metadata, _collectionList, loading] = await fetchNFTs();
      //case the response is empty display the empty message
      setEmpty(!_metadata?.length);
      //save the metadata in the state so we can apply filters later.
      setUserNFTsMetada(_metadata);
      //also set the filtered nfts as the response, displaying in that way all the nfts.
      setFilteredNFTs(_metadata);
      if (!_collectionList) return;
      //set all the collections
      setCollectionList(_collectionList);
      //switch this state do display the disclosure for each collection, and this should only be displayed case all collections is set, otherwise just display the nfts of the selected collection
      setAllCollections(true);
    } catch (err) {
      //case an error occurs display the error toast
      console.log(err);
      if (!isError) {
        setisError(true);
        setTimeout(function () {
          setisError(false);
        }, 5000);
      }
    }
  };

  //action to list the nft
  const listNFT = async (nft: metadata) => {
    //save the current nft in the state.
    setnftToList(nft);
    //open the list modal
    toggleModal();
    return;
  };

  //filter the current collection based on the picklist value
  async function picklistChange(e: React.ChangeEvent<HTMLSelectElement>) {
    //get the collection address from the picklist
    const collectionName = e.target.value;
    //case all collection is selected, display all nfts within each collection disclosure.
    if (collectionName === "All Collections") {
      setFilteredNFTs(userNFTsMetada);
      setAllCollections(true);
      return;
    }
    if (!userNFTsMetada) return;
    //case any other collection Address is selected then filter all the nfts based on this address
    const _metadata = userNFTsMetada.filter((item) => {
      return item.address === collectionName.toLowerCase();
    });
    setAllCollections(false);
    //and then display this filtered nfts
    setFilteredNFTs(_metadata);
  }

  return (
    <div className="pb-24">
      {empty ? (
        <div className="flex mx-auto mt-8 justify-content-center">
          <div className="mx-auto text-center">
            <p className="text-4xl pt-36 pb-8 text-[#F1F1F1] font-bold">
              You currently do not have a NFT. You can mint one here.
            </p>
            <br />
            <Link href="/create">
              <button className="w-4/12 px-12 py-3 font-bold text-black cursor-pointer bg-secondary hover:bg-primary hover:text-black rounded-xl">
                Mint
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {nftToList && (
            <ModalListNFT
              isOpen={modalOpen}
              toggle={toggleModal}
              NFTToList={nftToList}
              setErrorMessage={setisError}
              setSuccessMessage={setIsSuccess}
            />
          )}
          <p className="text-5xl font-bold text-center text-primary py-14">
            Your Collection
          </p>
          <div className="flex w-5/6 mx-auto mt-4 mb-8 overflow-hidden bg-white border rounded sm:w-2/3 md:w-1/2 lg:w-5/12 xl:w-1/3">
            <span className="relative px-4 py-2 text-lg font-semibold text-gray-500 whitespace-no-wrap border-b border-r border-gray-400 bg-primary rounded-r-xl">
              Collection:
            </span>
            <span style={{padding: '0.45rem 0.95rem'}} className="absolute text-lg font-semibold text-white whitespace-no-wrap rounded-r-xl">
              Collection:
            </span>
            <select
              className="w-full py-2 ml-2 bg-white "
              onChange={(e) => {
                picklistChange(e);
              }}
            >
              <option>All Collections</option>
              {collectionList.map((collection, i) => (
                <option key={i} value={collection.get("collectionAddress")}>
                  {collection.get("name")}
                </option>
              ))}
            </select>
          </div>
          {!allCollections ? (
            <div className="justify-center md:flex">
              <div className="px-4" style={{ maxWidth: "1600px" }}>
                {filteredNFTs && filteredNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredNFTs.map((nft: any, i: any) => (
                      <div key={i}>
                        <NFTTile nft={nft} callback={listNFT} button="List" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex w-full mx-auto mt-8 justify-content-center">
                    <div className="mx-auto text-center">
                      <p className="text-4xl font-bold text-onBackground">
                        <div>You do not have NFTs in this colleciton.</div>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {userNFTsMetada &&
                collectionList.map(
                  (collection, i) =>
                    userNFTsMetada.filter((item) => {
                      return (
                        item.address ===
                        collection.get("collectionAddress").toLowerCase()
                      );
                    }).length > 0 && (
                      <Disclosure
                        key={i}
                        collectionName={collection.get("name")}
                        filteredNFTs={userNFTsMetada.filter((item) => {
                          return (
                            item.address ===
                            collection.get("collectionAddress").toLowerCase()
                          );
                        })}
                        listNFT={listNFT}
                      />
                    )
                )}
            </div>
          )}
        </div>
      )}

      {isSuccess && <ToastSucess isOpen={true} toggle={setIsSuccess} />}
      {isError && <ToastError isOpen={true} toggle={setisError} />}
    </div>
  );
}

export default CreatorsDashboard;
