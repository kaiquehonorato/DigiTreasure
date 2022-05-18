import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { NextPage } from "next";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // icons imported from fontawesome
import { faWallet, faCircleDot } from "@fortawesome/free-solid-svg-icons";
const Header: NextPage = () => {
  //get moralis variables, most of the authentication process is done in the header, on this way shared between all pages
  const {
    authenticate,
    isAuthenticated,
    user,
    isWeb3Enabled,
    enableWeb3,
    web3,
    chainId,
    Moralis,
  } = useMoralis();
  //display wrong network banner in case the user chain does not correspond to the selected chain id "0x38" from bsc
  const [networkMsg, setNetworkMsg] = useState(false);
  const [chainIdUser, setchainIdUser] = useState("");
  const chainIdEnv = process.env.NEXT_PUBLIC_CHAIN_ID;

  // when authenticated initialize the web3 instance into the app, this instance will talk to the block chain, perform transactions and read from contracts
  useEffect(() => {
    tryWeb3();
  }, [isAuthenticated]);

  // add an event listener to any change on the chain, and if the new chain id doesn't match with the selected chain id, then set the network banner
  useEffect(() => {
    const unsubscribe = Moralis.onChainChanged((chain: any) => {
      console.log(chain);
      setchainIdUser(chain);
      verifyNetwork();
    });
    //we return the unsubscribe so react close the listener whenthe component is dismounted
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    verifyNetwork();
  }, [chainId]);

  const tryWeb3 = async () => {
    //case there is no web3 instance yet and we alredy have an authenticated user, then enable web3
    !isWeb3Enabled && isAuthenticated ? enableWeb3() : null;
  };
  //self explanatory
  async function login() {
    tryWeb3();
    if (!user) {
      const user = await authenticate({
        signingMessage: "Log in using Moralis",
      });
    }
  }

  async function verifyNetwork() {
    // the user chain Id is get from the useMoralis hook.
    console.log(chainId);
    if (!chainId) return;
    //check if is not equal to the env chain id
    if (chainId !== chainIdEnv) {
      setNetworkMsg(true);
    } else {
      setNetworkMsg(false);
    }
  }

  //when the user clicks on the batter, attempt to change the chain
  const changeNetwork = async () => {
    try {
      if (!chainIdEnv) return;
      await Moralis.switchNetwork(chainIdEnv);
    } catch (error: any) {
      //the error code 4902 means that the user doesnt have the chain on their metamask, so ask the user to add the chain automatically.
      if (error.code === 4902) {
        try {
          const chainId = "0x13881";
          const chainName = "Mumbai Testnet";
          const currencyName = "Matic";
          const currencySymbol = "Matic";
          const rpcUrl = "https://rpc-mumbai.maticvigil.com";
          const blockExplorerUrl = "https://polygonscan.com/";

          await Moralis.addNetwork(
            chainId,
            chainName,
            currencyName,
            currencySymbol,
            rpcUrl,
            blockExplorerUrl
          );
        } catch (error: any) {
          console.log(error.message);
        }
      }
    }
  };

  return (
    <div>
      <nav
        className="flex flex-wrap items-center w-full px-3 py-6 md:px-5 lg:px-8 bg-background text-onHeader"
        role="navigation"
        aria-label="main navigation"
      >
        {networkMsg && (
          <div className="flex w-full ">
            <div className="flex px-2 mx-auto mb-0 text-white bg-[#BD3C2C] hover:bg-opacity-70 rounded-xl justify-content-center">
              <button
                className="delete"
                onClick={() => setNetworkMsg(false)}
              ></button>
              <button
                onClick={() => changeNetwork()}
                className="button is-warning"
              >
                <p className="title is-5">
                  Look&apos;s like you are in a different network than Mumbai Testnet. Click here and let me change for you.🤗
                </p>{" "}
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <div className="p-1 pb-0 lg:pr-5">
            <Link href="/">
              <Image src="/digiTreasure_logo.png" alt="logo" height="42" width="60"/>
            </Link>
          </div>

          <div className="">
            <Link href="/">
              <p className="text-lg font-black cursor-pointer md:text-2xl lg:text-3xl text-onHeader">
                Digital Treasure Marketplace
              </p>
            </Link>
          </div>
        </div>
        <button className="ml-auto sm:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" data-target="#menu" className="mb-1 fill-onHeader menu-toggler">
            <path d="M6 36V33H42V36ZM6 25.5V22.5H42V25.5ZM6 15V12H42V15Z"/>
          </svg>
        </button>
        <div id="menu" className="hidden w-full sm:inline-flex sm:flex-grow sm:w-auto">
          <div className="justify-end float-right ml-auto sm:inline-flex sm:flex-grow sm:w-auto">
          <Link href="/explore">
              <p className="ml-4 menuItem">
                Explore
              </p>
            </Link>
            <Link href="/create">
              <p className="ml-4 menuItem">
                Create
              </p>
            </Link>
            <div className="group menuItem">
              <button
                className=""
                onClick={login}
              >
                <span className="invisible w-24 sm:visible">
                  <FontAwesomeIcon
                    icon={faWallet}
                    className="sm:w-5 md:h-5 lg:w-7 lg:h-7 text-onHeader"
                  />
                </span>
              </button>
              {/* <span className="sm:invisible sm:navBadge group-hover:visible">Connect Wallet</span> */}
            </div>
            <Link href="/creatorsdashboard">
              <div className="relative group menuItem">
                <span className="invisible icon text-onHeader sm:visible">
                  <FontAwesomeIcon icon={faCircleDot} className="sm:w-5 md:h-5 lg:w-7 lg:h-7" />
                </span>
                {/* <span className="w-24 sm:invisible sm:navBadge group-hover:visible">Dashboard</span> */}
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
