precision mediump float;
varying vec2 vUv;
varying float wave;
uniform float uTime;
uniform float uProg;
uniform float uIndex;

// #pragma glslify: noise = require(glsl-noise/simplex/3d) 

void main() {
  vec3 pos = position;



  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}