// Carousel from https://www.geeksforgeeks.org/how-to-add-image-carousel-in-nextjs/

import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
  
export default class NFTCarousel extends Component {
    render() {
        return (
            <div className='w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[450px]'>
              <Carousel>
                  <div className=''>
                      <img src="/KAIQUE.png" alt="Kaique's NFT"/>
                      <p className="legend">Kaique</p>
  
                  </div>
                  <div>
                      <img src="/RYLEE.png" alt="Rylee's NFT" />
                      <p className="legend">Rylee</p>
  
                  </div>
                  <div>
                      <img src="/ANDRESSA.png" alt="Andressa's NFT"/>
                      <p className="legend">Andressa</p>
  
                  </div>
                  <div>
                      <img src="/CAIO.png" alt="Caio's NFT"/>
                      <p className="legend">Caio</p>  
                  </div>
              </Carousel>
            </div>
        );
    }
};