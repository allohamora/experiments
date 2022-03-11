import 'swiper/css';
import 'swiper/css/pagination';
import './index.css';
import Swiper, { Pagination, Autoplay } from 'swiper';

const NESTED_INDEX = 1;

const nestedSlides = document.querySelectorAll('.nested-swiper .swiper-slide');
const nestedSlidesCount = nestedSlides.length;

const nestedSwiper = new Swiper('.nested-swiper', {
  modules: [Pagination, Autoplay],
  direction: 'vertical',
  spaceBetween: 50,
  autoplay: {
    delay: 1000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

const mainSwiper = new Swiper('.main-swiper', {
  modules: [Pagination, Autoplay],
  direction: 'horizontal',
  loop: true,
  spaceBetween: 50,
  autoplay: {
    delay: 1000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

mainSwiper.on('slideChange', () => {
  if (mainSwiper.realIndex === NESTED_INDEX + 1) {
    return nestedSwiper.slideTo(0);
  }

  if (mainSwiper.realIndex === NESTED_INDEX) {
    mainSwiper.autoplay.stop();
    nestedSwiper.autoplay.start();
  }
});

nestedSwiper.on('slideChange', () => {
  if (nestedSwiper.realIndex === nestedSlidesCount - 1) {
    nestedSwiper.autoplay.stop();
    mainSwiper.autoplay.start();
  }
});

nestedSwiper.autoplay.stop();
