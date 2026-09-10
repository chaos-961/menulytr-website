/* Lightweight three.js background scenes. Each layout mounts one.
   Scenes read colors from the CSS palette and recolor when it changes. */
(function () {
  if (!window.THREE) { window.MenuScene = { mount: function () {} }; return; }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var probe = document.createElement('canvas').getContext('2d');
  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function col(n) { probe.fillStyle = '#000'; probe.fillStyle = cssVar(n) || '#000'; var s = probe.fillStyle; return new THREE.Color(/^#/.test(s) ? s : '#000000'); }
  function isMobile() { return window.innerWidth < 720; }
  var dotTex = null;
  function softDot() {
    if (dotTex) return dotTex;
    var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d');
    var r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.35, 'rgba(255,255,255,.7)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    dotTex = new THREE.CanvasTexture(c); return dotTex;
  }
  var NOISE = [
    'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}',
    'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
    'float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);',
    'vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);',
    'vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);',
    'vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));',
    'float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);',
    'vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);',
    'vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
    'vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);',
    'vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;',
    'vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}'
  ].join('\n');

  var SCENES = {
    /* Slow drifting specks, like dust in afternoon light. */
    dust: function (api) {
      var n = isMobile() ? 220 : 520, W = 11, H = 7;
      var geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), vel = new Float32Array(n);
      for (var i = 0; i < n; i++) { pos[i * 3] = (Math.random() * 2 - 1) * W; pos[i * 3 + 1] = (Math.random() * 2 - 1) * H; pos[i * 3 + 2] = (Math.random() * 2 - 1) * 2; vel[i] = 0.04 + Math.random() * 0.14; }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var mat = new THREE.PointsMaterial({ size: isMobile() ? 0.1 : 0.08, map: softDot(), transparent: true, opacity: 0.55, depthWrite: false, sizeAttenuation: true, color: col('--accent') });
      var pts = new THREE.Points(geo, mat); api.scene.add(pts); api.camera.position.z = 8;
      return {
        update: function (t, dt) {
          var p = geo.attributes.position.array;
          for (var i = 0; i < n; i++) { p[i * 3 + 1] += vel[i] * dt; p[i * 3] += Math.sin(t * 0.4 + i) * 0.0015; if (p[i * 3 + 1] > H) p[i * 3 + 1] = -H; }
          geo.attributes.position.needsUpdate = true;
          pts.rotation.y += (api.pointer.x * 0.08 - pts.rotation.y) * 0.03;
          pts.rotation.x += (-api.pointer.y * 0.05 - pts.rotation.x) * 0.03;
        },
        recolor: function () { mat.color = col('--accent'); }
      };
    },
    /* A soft, breathing form in the accent color. */
    blob: function (api) {
      var uniforms = { uTime: { value: 0 }, uA: { value: col('--accent') }, uB: { value: col('--accent').clone().multiplyScalar(0.45) }, uBg: { value: col('--bg') } };
      var mat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: NOISE + '\nuniform float uTime; varying float vN; varying vec3 vNormal; varying vec3 vView;\nvoid main(){ float n = snoise(normal*1.5 + uTime*0.22); float n2 = snoise(normal*4.0 - uTime*0.12)*0.25; vN = n; vec3 p = position + normal*(n*0.3 + n2*0.12); vec4 mv = modelViewMatrix*vec4(p,1.0); vNormal = normalize(normalMatrix*normal); vView = -mv.xyz; gl_Position = projectionMatrix*mv; }',
        fragmentShader: 'uniform vec3 uA; uniform vec3 uB; uniform vec3 uBg; varying float vN; varying vec3 vNormal; varying vec3 vView;\nvoid main(){ vec3 N = normalize(vNormal); vec3 V = normalize(vView); float fres = pow(1.0 - max(dot(N,V),0.0), 2.4); float light = 0.5 + 0.5*max(dot(N, normalize(vec3(0.5,0.9,0.6))),0.0); vec3 base = mix(uA, uB, smoothstep(-0.7,0.7,vN)); vec3 c = base*light + uBg*fres*0.7; gl_FragColor = vec4(c,1.0);\n#include <colorspace_fragment>\n}'
      });
      var mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, isMobile() ? 48 : 96), mat);
      api.scene.add(mesh); api.camera.position.z = 5;
      return {
        update: function (t) {
          uniforms.uTime.value = t;
          mesh.rotation.y = t * 0.12 + api.pointer.x * 0.35;
          mesh.rotation.x = Math.sin(t * 0.2) * 0.2 - api.pointer.y * 0.25;
        },
        recolor: function () { uniforms.uA.value = col('--accent'); uniforms.uB.value = col('--accent').multiplyScalar(0.45); uniforms.uBg.value = col('--bg'); }
      };
    },
    /* Thin concentric rings, slowly turning. */
    rings: function (api) {
      var group = new THREE.Group(); api.scene.add(group); var mats = [], rings = [];
      for (var i = 0; i < 7; i++) {
        var pts = new THREE.EllipseCurve(0, 0, 0.9 + i * 0.32, 0.9 + i * 0.32, 0, Math.PI * 2, false, 0).getPoints(220);
        var g = new THREE.BufferGeometry().setFromPoints(pts);
        var m = new THREE.LineBasicMaterial({ color: col('--accent'), transparent: true, opacity: 0.95 - i * 0.11 });
        var r = new THREE.LineLoop(g, m);
        r.rotation.x = Math.PI / 2 * (0.35 + i * 0.1); r.rotation.y = i * 0.3;
        group.add(r); mats.push(m); rings.push(r);
      }
      api.camera.position.z = 7.5;
      return {
        update: function (t) {
          rings.forEach(function (r, i) { r.rotation.z = t * (0.06 + i * 0.02); r.rotation.x = Math.PI / 2 * (0.35 + i * 0.1) + Math.sin(t * 0.25 + i) * 0.18; });
          group.rotation.y += (api.pointer.x * 0.45 - group.rotation.y) * 0.04;
          group.rotation.x += (-api.pointer.y * 0.3 - group.rotation.x) * 0.04;
        },
        recolor: function () { var c = col('--accent'); mats.forEach(function (m) { m.color = c; }); }
      };
    },
    /* A field of points rippling; the ripple phase follows page scroll. */
    waves: function (api) {
      var cols = isMobile() ? 70 : 150, rows = isMobile() ? 40 : 75, n = cols * rows, W = 18, D = 11;
      var geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3);
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) { var i = (y * cols + x) * 3; pos[i] = (x / (cols - 1) - 0.5) * W; pos[i + 1] = 0; pos[i + 2] = (y / (rows - 1) - 0.5) * D; }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var mat = new THREE.PointsMaterial({ size: 0.055, color: col('--accent'), transparent: true, opacity: 0.6, map: softDot(), depthWrite: false });
      var pts = new THREE.Points(geo, mat); api.scene.add(pts);
      api.camera.position.set(0, 3.4, 7.5); api.camera.lookAt(0, -0.4, 0);
      return {
        update: function (t) {
          var p = geo.attributes.position.array, ph = api.scroll * 7;
          for (var i = 0; i < p.length; i += 3) { var x = p[i], z = p[i + 2]; p[i + 1] = Math.sin(x * 0.75 + t * 0.55 + ph) * 0.35 + Math.sin(z * 1.1 - t * 0.35 + ph * 0.5) * 0.25 + Math.sin((x + z) * 0.45 + t * 0.2) * 0.15; }
          geo.attributes.position.needsUpdate = true;
          pts.rotation.y += (api.pointer.x * 0.06 - pts.rotation.y) * 0.04;
        },
        recolor: function () { mat.color = col('--accent'); }
      };
    },
    /* Large soft spheres. The canvas is blurred with CSS so they read as bokeh. */
    orbs: function (api) {
      var group = new THREE.Group(); api.scene.add(group); var data = [];
      var a = col('--accent'), t2 = col('--text');
      for (var i = 0; i < 9; i++) {
        var r = 0.6 + Math.random() * 1.3;
        var m = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? t2 : a, transparent: true, opacity: 0.14 + Math.random() * 0.16, depthWrite: false });
        var s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m);
        s.position.set((Math.random() * 2 - 1) * 5.5, (Math.random() * 2 - 1) * 3.2, (Math.random() * 2 - 1) * 2);
        group.add(s); data.push({ s: s, m: m, k: i % 3 === 0, ox: s.position.x, oy: s.position.y, f: 0.08 + Math.random() * 0.18, ph: Math.random() * 6.28 });
      }
      api.camera.position.z = 8;
      return {
        update: function (t) {
          data.forEach(function (d) { d.s.position.x = d.ox + Math.sin(t * d.f + d.ph) * 0.9; d.s.position.y = d.oy + Math.cos(t * d.f * 0.8 + d.ph) * 0.6; });
          group.rotation.y += (api.pointer.x * 0.12 - group.rotation.y) * 0.02;
        },
        recolor: function () { var a2 = col('--accent'), t3 = col('--text'); data.forEach(function (d) { d.m.color = d.k ? t3 : a2; }); }
      };
    }
  };

  function mount(canvas, kind, opts) {
    if (!canvas || !SCENES[kind]) return null;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch (e) { canvas.style.display = 'none'; return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100); camera.position.z = 6;
    var api = { renderer: renderer, scene: scene, camera: camera, canvas: canvas, opts: opts || {}, pointer: new THREE.Vector2(0, 0), scroll: 0 };
    var impl = SCENES[kind](api);
    var visible = true, hidden = false, running = false, last = 0, t = 0;

    function resize() {
      var r = canvas.getBoundingClientRect(), w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      if (impl.resize) impl.resize();
      if (reduce) renderOnce();
    }
    function renderOnce() { impl.update(t, 0); renderer.render(scene, camera); }
    function frame(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000) || 0; last = now; t += dt;
      impl.update(t, dt); renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    function start() { if (running || reduce) return; if (!visible || hidden) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
    function stop() { running = false; }

    new ResizeObserver(resize).observe(canvas); resize();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
    document.addEventListener('visibilitychange', function () { hidden = document.hidden; hidden ? stop() : start(); });
    window.addEventListener('pointermove', function (e) { api.pointer.x = (e.clientX / window.innerWidth) * 2 - 1; api.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1); }, { passive: true });
    window.addEventListener('scroll', function () { var max = document.documentElement.scrollHeight - window.innerHeight; api.scroll = max > 0 ? window.scrollY / max : 0; }, { passive: true });
    window.addEventListener('palette:change', function () { if (impl.recolor) impl.recolor(); if (reduce) renderOnce(); });
    if (reduce) renderOnce(); else start();
    return api;
  }
  window.MenuScene = { mount: mount };
})();
