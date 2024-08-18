import{preloadImages}from"../utils.js";gsap.registerPlugin(Flip);const POSITION_CLASSES={NORTH:"pos-north",SOUTH:"pos-south",WEST:"pos-west",EAST:"pos-east"},gridElement=document.querySelector(".grid"),gridItems=Array.from(gridElement.querySelectorAll(".grid__item")),gridImages=gridElement.querySelectorAll(".grid__img"),fullscreenElement=document.querySelector(".fullscreen");let isFullscreen=!1;const animationDefaults={duration:1,ease:"expo.inOut"},flipImage=(e,t)=>{gsap.set(e,{zIndex:99});const s=Flip.getState(t,{props:"borderRadius"});isFullscreen?e.appendChild(t):fullscreenElement.appendChild(t),Flip.from(s,{...animationDefaults,absolute:!0,prune:!0,onComplete:()=>{isFullscreen&&gsap.set(e,{zIndex:"auto"}),isFullscreen=!isFullscreen}})},determinePositionClass=(e,t)=>e.bottom<t.top?POSITION_CLASSES.NORTH:e.top>t.bottom?POSITION_CLASSES.SOUTH:e.right<t.left?POSITION_CLASSES.WEST:e.left>t.right?POSITION_CLASSES.EAST:"",moveOtherItems=(e,t)=>{const s=e.getBoundingClientRect(),i=gridItems.filter((t=>t!==e)),l=Flip.getState(i);i.forEach((e=>{const t=e.getBoundingClientRect(),i=determinePositionClass(t,s);i&&(e.classList.toggle(i,!isFullscreen),gsap.set(e,{rotation:isFullscreen?0:gsap.utils.random(-50,50)}))})),Flip.from(l,{...animationDefaults,scale:!0,prune:!0})},toggleImage=e=>{const t=e.target,s=gridItems[t.dataset.index];flipImage(s,t),moveOtherItems(s)},initEvents=()=>{gridImages.forEach(((e,t)=>{e.dataset.index=t,e.addEventListener("click",toggleImage)}))};preloadImages(".grid__img").then((()=>{document.body.classList.remove("loading"),initEvents()}));