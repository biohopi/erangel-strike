const fs=require('fs'); const vm=require('vm');
const html=fs.readFileSync('index.html','utf8');
const s=html.indexOf('<script>\n'); const e=html.indexOf('</script>', s);
let js=html.slice(s+'<script>\n'.length, e);

function Vec(){ const o={x:0,y:0,z:0,
  set(x,y,z){o.x=x;o.y=y;o.z=z;return o;}, copy(c){o.x=c.x;o.y=c.y;o.z=c.z;return o;},
  add(c){o.x+=c.x;o.y+=c.y;o.z+=c.z;return o;}, clone(){return Vec().copy(o);},
  subVectors(a,b){o.x=a.x-b.x;o.y=a.y-b.y;o.z=a.z-b.z;return o;}, sub(c){o.x-=c.x;o.y-=c.y;o.z-=c.z;return o;},
  length(){return Math.hypot(o.x,o.y,o.z)||1;}, normalize(){return o;}, distanceTo(c){return Math.hypot(o.x-c.x,o.y-c.y,o.z-c.z);},
  multiplyScalar(sx){o.x*=sx;o.y*=sx;o.z*=sx;return o;}, dot(c){return o.x*c.x+o.y*c.y+o.z*c.z;}}; return o; }
function Color(){ const o={r:1,g:1,b:1}; o.copy=c=>{o.r=c.r;o.g=c.g;o.b=c.b;return o;};
  o.set=c=>o; o.setHSL=function(){return o;}; o.lerp=function(){return o;}; o.setHex=function(){return o;};
  o.getHexString=()=>'000000'; o.clone=()=>Color(); return o; }
function Node(){ this.position=Vec(); this.rotation=Vec(); this.scale=Vec();
  this.children=[]; this.userData={}; this.visible=true; this.isMesh=false; this.castShadow=false; this.receiveShadow=false;
  this.frustumCulled=null; this.material=null; this.geometry=null; this.instanceMatrix={needsUpdate:false}; this.count=0; }
Node.prototype.add=function(c){this.children.push(c);return this;};
Node.prototype.remove=function(c){const i=this.children.indexOf(c);if(i>=0)this.children.splice(i,1);};
Node.prototype.traverse=function(f){f(this);this.children.forEach(c=>c.traverse&&c.traverse(f));};
Node.prototype.updateMatrixWorld=function(){};
Node.prototype.getWorldPosition=function(out){out=out||Vec();out.x=this.position.x;out.y=this.position.y;out.z=this.position.z;return out;};
Node.prototype.clone=function(){return new Node();};
Node.prototype.setMatrixAt=function(){};
function Geo(){ this.attributes={position:{count:0,getX:()=>0,getY:()=>0,getZ:()=>0,setY:()=>{},set:()=>{},array:[],needsUpdate:false}}; }
Geo.prototype.computeVertexNormals=function(){}; Geo.prototype.setAttribute=function(k,a){this.attributes[k]=a;};
Geo.prototype.rotateX=function(){}; Geo.prototype.scale=function(){};
function Mat(o){ this.color=Color(); Object.assign(this,o); }
function Box3(){ this.min=Vec(); this.max=Vec(); }
Box3.prototype.setFromCenterAndSize=function(c,s){ this.min.x=c.x-s.x/2;this.max.x=c.x+s.x/2; this.min.y=c.y-s.y/2;this.max.y=c.y+s.y/2; this.min.z=c.z-s.z/2;this.max.z=c.z+s.z/2; return this; };
function Euler(){ const o=Vec(); o.set=function(){return o;}; return o; }
const THREE={
  Vector3:Vec, Color:Color, Group:Node, Scene:Node, Mesh:function(){ const n=new Node(); n.geometry=new Geo(); n.setAttribute=function(k,a){this.geometry.setAttribute(k,a);}; return n; },
  MeshStandardMaterial:Mat, MeshBasicMaterial:Mat, ShaderMaterial:Mat, LineBasicMaterial:Mat,
  LineSegments:Node, Points:Node, InstancedMesh:Node,
  PlaneGeometry:Geo, BoxGeometry:Geo, SphereGeometry:Geo, CylinderGeometry:Geo, DodecahedronGeometry:Geo,
  BufferGeometry:Geo, BufferAttribute:function(){ this.needsUpdate=false; this.array=[]; this.count=0; },
  PerspectiveCamera:function(){ const n=new Node(); n.aspect=1;n.fov=75; n.lookAt=()=>{}; n.updateProjectionMatrix=()=>{n.fov=75;}; return n; },
  DirectionalLight:function(){ const n=new Node(); n.position=Vec(); n.shadow={mapSize:{set(){},setSize(){}},camera:{},bias:0}; n.target=new Node(); return n; },
  HemisphereLight:Node, AmbientLight:Node, FogExp2:function(){},
  Raycaster:function(){ this.set=()=>{}; this.far=0; this.ray={intersectBox:()=>null}; },
  Box3:Box3, Euler:Euler,
  Quaternion:function(){ const o={x:0,y:0,z:0,w:1}; o.setFromEuler=()=>o; o.setFromAxisAngle=()=>o; o.identity=()=>o; return o; },
  Matrix4:function(){ return { compose:()=>{}, setFromEuler:()=>{} }; },
  WebGLRenderer:function(){ const n=new Node(); n.domElement=new Node(); n.setPixelRatio=()=>{}; n.setSize=()=>{}; n.shadowMap={enabled:false,type:0};
    n.toneMapping=0; n.toneMappingExposure=1; n.outputColorSpace=''; n.render=()=>{}; n.autoClear=true; return n; },
  CanvasTexture:function(){ return {wrapS:0,wrapT:0,anisotropy:4,needsUpdate:false,repeat:Vec()}; },
  Clock:function(){ return { getDelta:()=>0.016 }; },
  SRGBColorSpace:'srgb',ACESFilmicToneMapping:2,PCFSoftShadowMap:2,BackSide:1,AdditiveBlending:2,RepeatWrapping:1
};
function ctx2d(){ return { fillStyle:'', strokeStyle:'', lineWidth:1, font:'', globalAlpha:1, fillRect(){}, beginPath(){}, arc(){}, fill(){}, moveTo(){}, lineTo(){}, closePath(){}, stroke(){}, clearRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, scale(){}, fillText(){}, drawImage(){}, createLinearGradient(){return {addColorStop(){}};}, createRadialGradient(){return {addColorStop(){}};}, getImageData(){return {data:new Uint8Array(4)};}, putImageData(){}, measureText(){return {width:0};} }; }
function makeEl(id){ const el={ id, style:{}, dataset:{}, classList:{add(){},remove(){},toggle(){},contains:()=>false},
  children:[], innerHTML:'', textContent:'', value:'',
  addEventListener(){}, appendChild(c){this.children.push(c);return c;}, prepend(c){this.children.unshift(c);},
  querySelectorAll(){ return { forEach(){}, length:0 }; }, getContext(){return null;},
  requestPointerLock(){}, requestFullscreen(){}, setAttribute(){}, remove(){}, removeChild(){},
  insertBefore(){},
  className:'', type:''}; return el; }
const idInHtml=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
const byId={}; idInHtml.forEach(id=>byId[id]=makeEl(id));
const doc={ documentElement:makeEl('html'), body:(()=>{const b=makeEl('body');b.firstChild=null;return b;})(),
  getElementById: id=>byId[id]||makeEl(id),
  querySelectorAll(){ return { forEach(){}, length:0 }; },
  createElement:()=>{ const c=makeEl('tmp'); c.width=256; c.height=256; c.getContext=()=>ctx2d(); return c; }, addEventListener(){}, readyState:'complete',
  exitPointerLock(){}, fullscreenElement:null, exitFullscreen(){}, style:{} };
function audioCtxStub(){ const g=(v)=>({ gain:{value:v,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}}, connect(){return g;}, frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}}, type:'', start(){}, stop(){} }); return { destination:{}, currentTime:0, sampleRate:44100, createGain:()=>g(1), createOscillator:()=>({type:'',frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){} ,start(){},stop(){}}), createBuffer:()=>({getChannelData:()=>new Float32Array(8)}), createBufferSource:()=>({buffer:null,connect(){},start(){}}), createBiquadFilter:()=>({type:'',frequency:{value:0},connect(){}}) }; }

function audioCtxStub(){ const mkGain=()=>({gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}},connect(){},frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},type:'',start(){},stop(){}}); return { destination:{}, currentTime:0, sampleRate:44100, createGain:mkGain, createOscillator:mkGain, createBuffer:()=>({getChannelData:()=>new Float32Array(8)}), createBufferSource:()=>({buffer:null,connect(){},start(){}}), createBiquadFilter:()=>({type:'',frequency:{value:0},connect(){}}) }; }
const win={ innerWidth:1280, innerHeight:720, devicePixelRatio:1, addEventListener(){}, navigator:{maxTouchPoints:0}, AudioContext:audioCtxStub, webkitAudioContext:audioCtxStub };
const ctx=vm.createContext({
  console: console, Math, JSON, Object, Array, Number, String, Boolean, Date, Promise,
  setTimeout, clearTimeout, requestAnimationFrame:()=>0, THREE,
  document:doc, window:win, navigator:win.navigator, localStorage:{getItem:()=>null,setItem(){},removeItem(){}},
  DeviceOrientationEvent:undefined, BroadcastChannel:undefined
});
try {
  vm.runInContext(js, ctx, {timeout:20000});
  console.log('RESULT: BOOT OK — map, characters, assets, UI wiring all constructed without throwing.');
} catch(err){
  console.log('RESULT: RUNTIME ERROR ---');
  console.log(err.stack||err.message);
}
