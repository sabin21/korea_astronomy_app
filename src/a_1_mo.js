import '../public/css/normalize.css';
import '../public/css/draft_common.scss';
import '../public/css/mockup.scss';
import '../public/css/draft_a_mo.scss';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const scrollAction = () => {

  let pinWrap = document.querySelector(".row-wrapper");
  let pinWrapWidth = 2140;
  let horizontalScrollLength = pinWrapWidth + (window.innerWidth*0.1);

  gsap.to(".row-wrapper", {
    scrollTrigger: {
      scrub: true,
      trigger: ".section-hero",
      pin: true,
      start: "top top",
      end: pinWrapWidth
    },
    x: -horizontalScrollLength,
    ease: "none"
  });

}
scrollAction();

//-------------------------------------------------

import * as THREE from 'three';

//-----------------

const fragmentShader = {
  fragment : `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        uniform sampler2D overlayTexture;

        varying vec2 vUv;

        void main() {

            // Baselayer + bloomlayer + 0.2(overlay)
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

        }
`
}
const vertexShader = {
  vertex : `
        varying vec2 vUv;

        void main() {

            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
      `
}

//-----------------

const STAR_MIN = 0.25;
const STAR_MAX = 5.0;

const HAZE_MAX = 50.0;
const HAZE_MIN = 20.0;
const HAZE_OPACITY = 0.2;

const BASE_LAYER = 0;
const BLOOM_LAYER = 1;
const OVERLAY_LAYER = 2;

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { Galaxy } from './objects/galaxy.js';

let canvas, renderer, camera, scene, baseComposer, bloomComposer, overlayComposer;
let galaxyWrapper, galaxy;

initThree();

function initThree() {

  canvas = document.querySelector('#hero-canvas');
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xEBE2DB, 0.00003);

  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 5000000 );
  camera.position.set(0, 500, 500);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  galaxyWrapper = new THREE.Group();
  galaxyWrapper.position.set(0,0,0);
  galaxyWrapper.rotation.set(0,Math.PI*1,0);
  scene.add(galaxyWrapper);

  galaxy = new Galaxy(galaxyWrapper);

  initRenderPipeline();
}

function initRenderPipeline() {
  renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      canvas,    
  });

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  THREE.ColorManagement.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.2;

  const renderScene = new RenderPass( scene, camera );

  const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
  bloomPass.threshold = 0.1;
  bloomPass.strength = 0.5;
  bloomPass.radius = 0.2;

  bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  overlayComposer = new EffectComposer(renderer);
  overlayComposer.renderToScreen = false;
  overlayComposer.addPass(renderScene);

  const finalPass = new ShaderPass(
      new THREE.ShaderMaterial( {
          uniforms: {
              baseTexture: { value: null },
              bloomTexture: { value: bloomComposer.renderTarget2.texture },
          },
          vertexShader: vertexShader.vertex,
          fragmentShader: fragmentShader.fragment,
          defines: {}
      } ), 'baseTexture'
  );

  finalPass.needsSwap = true;
  baseComposer = new EffectComposer( renderer );
  baseComposer.addPass( renderScene );
  baseComposer.addPass(finalPass);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render() {

  if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
  }

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  galaxy.updateScale(camera);
  renderPipeline()
  requestAnimationFrame(render);
  
  galaxyWrapper.rotation.z += 0.0015;
}

function renderPipeline() {
  camera.layers.set(BLOOM_LAYER)
  bloomComposer.render()

  camera.layers.set(OVERLAY_LAYER)
  overlayComposer.render()

  camera.layers.set(BASE_LAYER)
  baseComposer.render()
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);  
}

animate();

//---------------------------------------

const heroOverlay = document.querySelector('.hero-overlay');

const scrollHeroGalaxy = () => {
  gsap.timeline({
    scrollTrigger:{
      trigger: '.hero-swiper-wrap',
      start: 0,
      end: '+=50%',
      scrub: true
    }
  })
  .fromTo(galaxyWrapper.position, {y:50, z:0},{ y:-300,z:200},"label-0")
  .fromTo(galaxyWrapper.rotation, { x: 0.2}, { x: -1.8},"label-0");

  gsap.timeline({
    scrollTrigger:{
      trigger: '.section-2',
      start: "top 50%",
      end: '+=200%',
      scrub: true
    }
  })
  .to(galaxyWrapper.position, { x: 150, y:200,z:100}, "label-2")
  .to(galaxyWrapper.rotation,{ duration:1, x: 0.6, y:-0.2}, "label-2")
  .to(heroOverlay, { opacity: 0.8, duration:2}, "label-2" );
};

scrollHeroGalaxy();