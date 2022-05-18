import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="inset-x-0 bottom-0 mb-0">
      <div className="flex flex-col justify-center h-20 bg-background align-center">
        <div>
          <ul>
            <div className="flex justify-around align-middle text-onFooter">
                <li className="items-center hidden mt-1 xs:flex">
                  <div className="flex justify-between">
                  <Link href="/explore">
                    <p className="cursor-pointer lg:text-lg text-onFooter hover:drop-shadow hover:scale-105">
                      Explore
                    </p>
                  </Link>
                  <Link href="/create">
                    <p className="px-3 cursor-pointer lg:text-lg text-onFooter hover:drop-shadow hover:scale-105">
                      Create
                    </p>
                  </Link><Link href="/creatorsdashboard">
                    <p className="cursor-pointer lg:text-lg text-onFooter hover:drop-shadow hover:scale-105">
                      Dashboard
                    </p>
                  </Link>
                  </div>
                </li>
              <li className="flex items-center">
                <div className="flex items-center">
                  <div className="hidden pt-1 pr-1 md:inline">
                    <Image src="/digiTreasure_logo.png" alt="logo" width="55" height="35"/>
                  </div>
                  <p className="hidden px-1 text-xl font-bold lg:text-2xl md:inline text-onFooter">
                    NFT Marketplace{" "}
                  </p>
                  <div className="pt-2 pl-6 pr-1">
                    {/* Copyright symbol from icon8.com */}
                    <a target="_blank" href="https://icons8.com/icon/tocgjtmSkmsT/copyright-all-rights-reserved">
                    <Image src={"/copyright.png"} alt="copyright symbol" width="18" height="18" className="pt-8"/>
                    </a>
                  </div>
                  <span className="pt-1 text-sm text-onFooter">2022</span>
                </div>
              </li>
              <li className="flex items-center">
                <div className="flex justify-between text-onFooter w-200">
                  <Link href="/">
                    <FontAwesomeIcon
                      icon={faYoutube}
                      className="w-5 h-5 mx-2 cursor-pointer hover:drop-shadow hover:scale-110"
                    />
                  </Link>
                  <Link href="/">
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className="w-5 h-5 mx-2 cursor-pointer hover:drop-shadow hover:scale-110"
                    />
                  </Link>
                  <Link href="/">
                    <FontAwesomeIcon
                      icon={faTwitter}
                      className="w-5 h-5 mx-2 cursor-pointer hover:drop-shadow hover:scale-110"
                    />
                  </Link>
                  <Link href="/">
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="w-5 h-5 mx-2 cursor-pointer hover:drop-shadow hover:scale-110"
                    />
                  </Link>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
