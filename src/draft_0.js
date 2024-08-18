import gsap from 'gsap';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import '../public/css/normalize.css';
import '../public/css/draft_common.scss';
import '../public/css/draft_3_0.scss';

import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import envTex from '../public/textures/blocky_photo_studio_1k.hdr';
import model1 from '../public/models/energy.glb';

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff, 0); 
    this.renderer.TextureEncoding = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.01, 3000 );
    this.camera.position.set(0, 0.35, 6);
    this.time = 0;

    this.gltf = new GLTFLoader();
    this.envLoader = new RGBELoader();    
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.75;

    this.aniIdle = function(obj){
      // obj.rotation.set(Math.cos(this.time / 4) / 8, 0, 0.15 + Math.sin(this.time / 2) / 8);
      // obj.rotation.set(0.15, Math.cos(this.time / 2) / 8 + roty, 0);
    }

    this.isPlaying = true;

    this.addLights();
    // this.settings();
    // this.initPost();
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.introAni();  
  }

  initPost(){
    // this.renderScene = new RenderPass( this.scene, this.camera );
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,      
    };    
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addLights() {
    const light2 = new THREE.DirectionalLight(0xffffff, 5);
    light2.position.set(1, 10, 0);
    this.scene.add(light2);
    light2.castShadow = true;
  }

  addObjects() {
    
    this.envLoader.load(envTex, (tex)=>{
      tex.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = tex;
    });

    this.objWrap1 = new THREE.Object3D();
    this.objGroup1 = new THREE.Object3D();
    this.objGroup1.add(this.objWrap1);

    this.gltf.load(model1, (gltf)=>{
        this.objWrap1.add(gltf.scene);
        this.obj1 = gltf.scene.children[0];
        this.obj1.receiveShadow = true; 
    });

    this.scene.add(this.objGroup1);
    this.objGroup1.scale.set(0.2, 0.2, 0.2);
    this.objGroup1.position.set(0, -0.08, 0);
    this.objGroup1.rotation.set(0.05, 0, 0);
    this.scene.add(this.objGroup1);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying){
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.03;

    // this.aniIdle(this.objWrap1);

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
  
  introAni(){
    const objsTl = gsap.timeline({paused:true});
    objsTl
    .to(this.objGroup1.position, {y: 1, duration:0.5}); 
  } 

} //--- Sketch

let heroSketch = new Sketch({
  dom: document.getElementById("hero-canvas")
});

let roty = 1.5708;
const heroTl = gsap.timeline();

const heroSwiper = new Swiper('.hero-wrap',{
  modules:[Navigation, Pagination, Autoplay],
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".hero-nav-next",
    prevEl: ".hero-nav-prev",
  },
  direction: "vertical",
  on:{
    // init: function(){
    //   // heroSketch.objsTl;
    //   console.log(heroSketch);
    // },
    activeIndexChange : function(){
      if(this.realIndex === 0){
        heroTl.to(heroSketch.objWrap1.rotation, {y: 0, duration:1});
      }else if(this.realIndex === 1){
        heroTl.to(heroSketch.objWrap1.rotation, {y: -roty, duration:1});
      }
      else if(this.realIndex === 2){
        heroTl.to(heroSketch.objWrap1.rotation, {y: -roty*2, duration:1});
      }else if(this.realIndex === 3){
        heroTl.to(heroSketch.objWrap1.rotation, {y: -roty*3, duration:1});
      }  
    }
  }  
});
