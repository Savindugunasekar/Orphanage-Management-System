import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

import './Carousel.css';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';


const Carousel = ({ images }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'3'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
        }}
        // pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="swiper_container"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image.url} alt={`slide_image_${index}`} className="slide-image" />
          </SwiperSlide>
        ))}
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  );
};

export default Carousel;
