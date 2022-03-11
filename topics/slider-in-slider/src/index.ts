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
