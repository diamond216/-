// Sunlight caustics on shallow water, drawn with a small WebGL shader behind the page.
// Low resolution (scaled up and blurred by the browser), about 30 frames a second, paused when the tab is hidden.
// Falls back to the plain CSS gradient on .water if WebGL is missing; holds still when reduced motion is on.
(function () {
  "use strict";
  const cv = document.querySelector(".water"), gl = cv && cv.getContext("webgl", { alpha: false, antialias: false });
  if (!gl) return;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  // after the well-known "water caustic" pattern: a few rounds of wave interference, then sharpened to bright lines
  const fs = `precision mediump float;uniform vec2 r;uniform float t;uniform float sy;
  void main(){
    vec2 uv=gl_FragCoord.xy/r.y; uv.y-=sy*.00025;
    vec2 p=mod(uv*6.2831*1.15,6.2831)-250.; vec2 i=p; float c=1.; float k=.005;
    for(int n=0;n<4;n++){float tt=t*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));
      c+=1./length(vec2(p.x/(sin(i.x+tt)/k),p.y/(cos(i.y+tt)/k)));}
    c/=4.; c=1.17-pow(c,1.4); float l=pow(abs(c),8.);
    float depth=gl_FragCoord.y/r.y;                       // 1 at the top of the screen, 0 at the bottom
    vec2 q=gl_FragCoord.xy/r.y;
    // slow, wide drifts of colour so the water is never one flat blue: cyan patches and a little periwinkle
    float d1=.5+.5*sin(q.x*1.7+t*.21+sin(q.y*2.3-t*.17));
    float d2=.5+.5*sin(q.y*1.9-t*.13+cos(q.x*1.3+t*.11));
    vec3 deep=vec3(.36,.62,.92), cyan=vec3(.48,.84,.95), peri=vec3(.62,.66,.95), foam=vec3(.93,.97,1.);
    vec3 water=mix(foam,deep,depth*.78);
    water=mix(water,cyan,d1*.32*depth+.06);
    water=mix(water,peri,d2*.18*depth);
    gl_FragColor=vec4(water+vec3(1.,.99,.95)*l*.36,1.);
  }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uS = gl.getUniformLocation(pr, "sy");
  const SCALE = 0.35;
  function size() { cv.width = Math.round(innerWidth * SCALE); cv.height = Math.round(innerHeight * SCALE); gl.viewport(0, 0, cv.width, cv.height); }
  addEventListener("resize", size); size();
  cv.style.filter = "blur(1.2px)";
  let last = 0;
  function draw(ms) {
    if (!document.hidden && ms - last > 33) {
      last = ms;
      gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, (calm ? 12 : ms / 1000) * 0.35 + 23); gl.uniform1f(uS, scrollY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    if (!calm) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  if (calm) addEventListener("scroll", () => requestAnimationFrame(draw), { passive: true });
})();
