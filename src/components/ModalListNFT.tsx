import React, { Fragment, useEffect, useState } from "react";
import useListNft from "../hooks/useListNFT";
import { Dialog, Transition } from "@headlessui/react";
import type { metadata } from "../hooks/useLoadNFTs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Processing from "./Processing";
import { useRouter } from "next/router";

type props = {
  NFTToList: metadata;
  toggle: () => void;
  isOpen: boolean;
  setSuccessMessage: (arg: boolean) => void;
  setErrorMessage: (arg: boolean) => void;
};

function ModalListNFT(props: props) {
  const [processing, setProcessing] = useState(false);
  const [nftPrice, setNftPrice] = useState("");
  //open and close the modal based on the props passed by the parent (create page)
  const [isOpen, setOpen] = useState(props.isOpen);
  // get all the NFT information from the props and callbacks
  const { NFTToList, toggle, setSuccessMessage, setErrorMessage } = props;

  const list = useListNft();
  //we use the router from the next to refresh the page when the minting is done.
  const router = useRouter();

  //control the state of the modal based on the props value
  useEffect(() => {
    setOpen(props.isOpen);
  }, [props.isOpen]);

  const handleListing = (NFT: metadata) => {
    setProcessing(true);
    //build the success callback for the mint funcion
    const callback = () => {
      //close the processing modal in case of success
      setProcessing(false);
      //set the success message
      setSuccessMessage(true);
      //close the listing modal
      toggle();
      setTimeout(function () {
        setSuccessMessage(false);
      }, 5000);
      //refresh the page
      router.reload();
    };
    //build the error callback for the mint funcion
    const errCallback = () => {
      setProcessing(false);
      setErrorMessage(true);
      toggle();
      setTimeout(function () {
        setErrorMessage(false);
      }, 5000);
    };
    const options = {
      collectionAddr: NFT.address,
      id: NFT.id,
      nftPrice,
      callback,
      errCallback,
    };
    try {
      //invoke the list function
      list(options);
    } catch (err) {
      console.log(err);
      setProcessing(false);
    }
  };

  return (
    <div className="">
      <Dialog
        open={isOpen}
        as="div"
        className="fixed inset-0 overflow-y-auto z-25"
        onClose={() => setOpen(false)}
      >
        <div className="flex p-10 relative justify-center mt-6 bg-[#242424] w-10/12 sm:w-8/12 md:w-1/2 lg:w-5/12 2xl:w-1/3 mx-auto rounded-xl">
          <button type="button" onClick={props.toggle}>
            <div className="absolute top-5 right-5">
              <FontAwesomeIcon icon={faCircleXmark} className="text-normal text-onBackground" />
            </div>
          </button>
          <div className="relative w-8/12 text-onBackground">
            <Dialog.Title
              as="p"
              className="mt-4 text-3xl leading-6 font-strong"
            >
              List Your NFT
            </Dialog.Title>
            <p className="mt-4 title is-4">Do you want to list this NFT?</p>
            <br />
            <img
              src={NFTToList?.image}
              alt={NFTToList?.name}
              className="object-cover rounded w-60 h-60"
            />
            <p className="text-lg">{NFTToList?.name}</p>
            <br />
            <div className="flex items-center">
              <label className="mr-4">Item&nbsp;Price</label>
              <div className="control">
                <input
                  className="w-full bg-[#2C2C2C] px-3 py-2 rounded"
                  type="text"
                  placeholder="1000"
                  onChange={(e) => setNftPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="justify-center px-4 py-3 text-black sm:px-6 sm:flex">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 mt-3 font-medium rounded-md bg-secondary hover:bg-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={props.toggle}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 mt-3 font-medium rounded-md bg-secondary hover:bg-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => handleListing(NFTToList)}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      <Processing isOpen={processing} />
    </div>
  );
}

export default ModalListNFT;
