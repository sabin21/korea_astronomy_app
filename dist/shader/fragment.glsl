precision mediump float;

varying vec2 vUv;
varying float wave;

uniform float time;
uniform float progress;
uniform float uProg;
uniform float distanceFromCenter;
uniform sampler2D uTexture;
uniform vec4 resolution;
uniform float uIndex;

uniform float rVx;
uniform float rVy;
uniform float gVx;
uniform float gVy;

varying vec3 vPosition;
float PI = 3.141592653589793238;

void main()	{

	vec2 uv = vUv;
  vec2 dUv = vec2(uv.x, uv.y);
  vec3 texture1;
  
  // float rVx = 0.01 ;
	// float rVy = 0.008 ;
	// float gVx = 0.004 ;
	// float gVy = 0.004 ;
	float rVx = 0.008 ;
	float rVy = 0.008 ;
	float gVx = 0. ;
	float gVy = 0. ;

dUv.y += wave * 0.05;
    float r = texture2D(uTexture, dUv + vec2(rVx*sin(time), rVy*sin(time))).r;
    float g = texture2D(uTexture, dUv + vec2(gVx, gVy)).g;
    float b = texture2D(uTexture, dUv + vec2(0., -0.02) * uProg).b;
    texture1 = vec3(r, g, b);

	vec4 t = texture2D(uTexture, vUv);
	float bw = (t.r + t.g + t.b)/3.;
	vec4 another = vec4(bw,bw,bw,1.);
	gl_FragColor = mix(another,t,distanceFromCenter);
	gl_FragColor.a = clamp(distanceFromCenter, 0.3, 1.);

	gl_FragColor = vec4(texture1, gl_FragColor.a);
}