import{preloadImages}from"../utils.js";gsap.registerPlugin(Flip);const POSITION_CLASSES={NORTH:"pos-north",SOUTH:"pos-south",WEST:"pos-west",EAST:"pos-east"},DIRECTIONS=["pos-north","pos-south","pos-west","pos-east"],gridElement=document.querySelector(".grid"),gridItems=Array.from(gridElement.querySelectorAll(".grid__item")),gridImages=gridElement.querySelectorAll(".grid__img"),fullscreenElement=document.querySelector(".fullscreen");let isFullscreen=!1;const animationDefaults={duration:.6,ease:"expo"},flipImage=(e,t)=>{gsap.set(e,{zIndex:99});const s=Flip.getState(t);isFullscreen?e.appendChild(t):fullscreenElement.appendChild(t),Flip.from(s,{...animationDefaults,scale:!0,prune:!0,onComplete:()=>{isFullscreen&&gsap.set(e,{zIndex:"auto"}),isFullscreen=!isFullscreen}})},determineDirectionClassFromData=e=>{switch(e.dataset.directionItems){case"north":return POSITION_CLASSES.NORTH;case"south":return POSITION_CLASSES.SOUTH;case"west":return POSITION_CLASSES.WEST;case"east":return POSITION_CLASSES.EAST;default:return determineRandomDirectionClass()}},determineRandomDirectionClass=()=>{const e=Math.floor(Math.random()*DIRECTIONS.length);return DIRECTIONS[e]},moveOtherItems=(e,t)=>{const s=gridItems.filter((t=>t!==e)),r=Flip.getState(s);s.forEach((e=>{t&&e.classList.toggle(t,!isFullscreen)})),Flip.from(r,{...animationDefaults,scale:!0,prune:!0})},toggleImage=e=>{const t=e.target,s=gridItems[t.dataset.index];flipImage(s,t);const r=determineDirectionClassFromData(s);moveOtherItems(s,r)},initEvents=()=>{gridImages.forEach(((e,t)=>{e.dataset.index=t,e.addEventListener("click",toggleImage)}))};preloadImages(".grid__img").then((()=>{document.body.classList.remove("loading"),initEvents()}));