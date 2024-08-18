import 'swiper/css';
import 'swiper/css/pagination';

import '../public/css/normalize.css';
import '../public/css/draft_common.scss';
import '../public/css/draft_b.scss';

import Lenis from 'lenis'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

Swiper.use([Autoplay, Pagination]);

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let lenis;

const initSmoothScrolling = () => {	
	lenis = new Lenis({
		lerp: 0.2, 
		smoothWheel: true 
	});
  lenis.on('scroll', () => ScrollTrigger.update());
  const scrollFn = (time) => {
		lenis.raf(time);
		requestAnimationFrame(scrollFn);
	};	
	requestAnimationFrame(scrollFn);
}

const heroWrapper = document.getElementById('hero-canvas');
const heroWrapperTL = gsap.timeline({paused:true});
const pressWrap = document.querySelector('.press-wrap');

gsap.timeline(
	{scrollTrigger:{
		trigger: ".section-hero",
		scrub:true,
		start: "top -200",
		end: "+=1700",
	}}
)
.to('.section-hero', { top:'-100vh' },'label-0' )
.to( heroWrapper, {width: "100%", height: "100vh", borderRadius:0, right:0, top:0, bottom:0},'label-0' )
.to(pressWrap, { bottom: 180})
.to( heroWrapper, { height: "0px"} );

gsap.timeline({
	scrollTrigger:{
		trigger: '.section-event',
		pin:true,
		start:'top top',
		end:'bottom top',
		scrub:1,
		ease:'linear'
	}
})
.to('.event-banner-down', {
	// height: 32, 
	marginTop:-565,
	stagger:.5
}, 'label-event-1')
.to('.section-event', {
	gap:10, 
}, 'label-event-1');

initSmoothScrolling();

//---------------------------

const heroSwiper = new Swiper('.hero-swiper-container', {
  speed: 10,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
	spaceBetween: 10,
  loop: true,
	on: {
		// slideChange: function(e){
		// 	let index_currentSlide = this.realIndex;
		// 	let currentSlide = this.slides[index_currentSlide];
		// 	currentSlide.classList.add("active");
		// 	// console.log('ddskskdk')	
		// },
		// slideResetTransitionEnd: function(e){
		// 	let index_currentSlide = this.realIndex;
		// 	let currentSlide = this.slides[index_currentSlide];
		// 	currentSlide.classList.remove("active");
		// },
	}
  // pagination: {
  //   el: ".swiper-pagination",
  // },
});

//---------------------------

const pageTop = document.querySelector('.btn-pagetop');
const btnPageTop = () => {
  window.addEventListener('scroll', function(){
    if(window.scrollY > window.innerHeight){
      pageTop.classList.add('active');
    }else{
      pageTop.classList.remove('active');
    }
  });
  pageTop.addEventListener('click', function(){
    gsap.to(window, {duration:1, scrollTo:0 });
  });
}
btnPageTop();

