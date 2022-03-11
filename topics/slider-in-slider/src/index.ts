import 'swiper/css';
import 'swiper/css/pagination';
import './index.css';
import Swiper, { Pagination } from 'swiper';

const mainSwiper = new Swiper('.main-swiper', {
  modules: [Pagination],
  direction: 'horizontal',
  loop: true,
  spaceBetween: 50,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

const nestedSwiper = new Swiper('.nested-swiper', {
  modules: [Pagination],
  direction: 'vertical',
  spaceBetween: 50,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

const nestedSlides = document.querySelectorAll('.nested-swiper .swiper-slide');
const nestedSlidesCount = nestedSlides.length;

const AUTOPLAY_DELAY = 1000;
const NESTED_INDEX = 1;

const autoPlay = () => {
  const swipeNested = () => {
    const nestedIndex = nestedSwiper.realIndex;

    if (nestedIndex === nestedSlidesCount - 1) {
      return mainSwiper.slideNext();
    }

    return nestedSwiper.slideNext();
  };

  const swipeMain = () => {
    const mainIndex = mainSwiper.realIndex;

    if (mainIndex === NESTED_INDEX + 1) {
      nestedSwiper.slideTo(0);
    }

    return mainSwiper.slideNext();
  };

  setInterval(() => {
    const mainIndex = mainSwiper.realIndex;

    if (mainIndex === NESTED_INDEX) {
      return swipeNested();
    }

    return swipeMain();
  }, AUTOPLAY_DELAY);
};

autoPlay();
