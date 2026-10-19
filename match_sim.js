const fs=require('fs'); const vm=require('vm');
const js=fs.readFileSync('js_main.js','utf8');
// --- stubs (reuse from smoke.js logic but declared standalone) ---
function Vec(){ const o={x:0,y:0,z:0,set(x,y,z){o.x=x;o.y=y;o.z=z;return o;},copy(c){o.x=c.x;o.y=c.y;o.z=c.z;return o;},add(c){o.x+=c.x;o.y+=c.y;o.z+=c.z;return o;},clone(){return Vec().copy(o);},subVectors(a,b){o.x=a.x-b.x;o.y=a.y-b.y;o.z=a.z-b.z;return o;},sub(c){o.x-=c.x;o.y-=c.y;o.z-=c.z;return o;},length(){return Math.hypot(o.x,o.y,o.z)||1;},normalize(){return o;},distanceTo(c){return Math.hypot(o.x-c.x,o.y-c.y,o.z-c.z);},multiplyScalar(sx){o.x*=sx;o.y*=sx;o.z*=sx;return o;},dot(c){return o.x*c.x+o.y*c.y+o.z*c.z;},lerp(c,t){o.x+=(c.x-o.x)*t;o.y+=(c.y-o.y)*t;o.z+=(c.z-o.z)*t;return o;},lerpVectors(a,b,t){o.x=lerp(a.x,b.x,t);o.y=lerp(a.y,b.y,t);o.z=lerp(a.z,b.z,t);return o;},setFromMatrixPosition(){return o;}};return o;}
function Color(){const o={r:1,g:1,b:1};o.copy=c=>{o.r=c.r;o.g=c.g;o.b=c.b;return o;};o.set=c=>o;o.setHSL=()=>o;o.lerp=()=>o;o.setHex=()=>o;o.getHexString=()=>'000000';o.clone=()=>Color();return o;}
function Node(){this.position=Vec();this.rotation=Vec();this.scale=Vec();this.children=[];this.userData={};this.visible=true;this.isMesh=false;this.castShadow=false;this.receiveShadow=false;this.frustumCulled=null;this.material=null;this.geometry=null;this.instanceMatrix={needsUpdate:false};this.count=0;}
Node.prototype.add=function(c){this.children.push(c);return this;};Node.prototype.remove=function(c){const i=this.children.indexOf(c);if(i>=0)this.children.splice(i,1);};Node.prototype.traverse=function(f){f(this);this.children.forEach(c=>c.traverse&&c.traverse(f));};Node.prototype.updateMatrixWorld=function(){};Node.prototype.getWorldPosition=function(out){out=out||Vec();out.x=this.position.x;out.y=this.position.y;out.z=this.position.z;return out;};Node.prototype.clone=function(){return new Node();};Node.prototype.setMatrixAt=function(){};
function GeoS(){this.attributes={position:{count:0,getX:()=>0,getY:()=>0,getZ:()=>0,setY:()=>{},set:()=>{},array:[],needsUpdate:false}};}GeoS.prototype.computeVertexNormals=function(){};GeoS.prototype.setAttribute=function(k,a){this.attributes[k]=a;};GeoS.prototype.rotateX=function(){};GeoS.prototype.scale=function(){};
function Mat(o){this.color=Color();if(o&&(o.color!==undefined)){ if(typeof o.color==='number'){this.color.setHex(o.color);} else {this.color=o.color;} } Object.assign(this,o); if(typeof this.color==='number'){const c=this.color;this.color=Color();this.color.setHex(c);} }
function Box3(){this.min=Vec();this.max=Vec();}Box3.prototype.setFromCenterAndSize=function(c,s){this.min.x=c.x-s.x/2;this.max.x=c.x+s.x/2;this.min.y=c.y-s.y/2;this.max.y=c.y+s.y/2;this.min.z=c.z-s.z/2;this.max.z=c.z+s.z/2;return this;};
function Euler(){const o=Vec();o.set=function(){return o;};return o;}
function ctx2d(){return {fillStyle:'',strokeStyle:'',lineWidth:1,font:'',globalAlpha:1,fillRect(){},beginPath(){},arc(){},fill(){},moveTo(){},lineTo(){},closePath(){},stroke(){},clearRect(){},save(){},restore(){},translate(){},rotate(){},scale(){},fillText(){},drawImage(){},createLinearGradient(){return {addColorStop(){}};},createRadialGradient(){return {addColorStop(){}};},getImageData(){return {data:new Uint8Array(4)};},putImageData(){},measureText(){return {width:0};}};}
function audioCtxStub(){const mk=()=>({gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}},connect(){},frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},type:'',start(){},stop(){}});return {destination:{},currentTime:0,sampleRate:44100,createGain:mk,createOscillator:mk,createBuffer:()=>({getChannelData:()=>new Float32Array(8)}),createBufferSource:()=>({buffer:null,connect(){},start(){}}),createBiquadFilter:()=>({type:'',frequency:{value:0},connect(){}})};}
const THREE={Vector3:Vec,Color,Group:Node,Scene:Node,Mesh:function(){const n=new Node();n.geometry=new GeoS();n.setAttribute=function(k,a){this.geometry.setAttribute(k,a);};return n;},MeshStandardMaterial:Mat,MeshBasicMaterial:Mat,ShaderMaterial:Mat,LineBasicMaterial:Mat,LineSegments:function(geo,mat){const n=new Node();n.geometry=geo;n.material=mat;n.frustumCulled=false;n.visible=false;return n;},Points:function(geo,mat){const n=new Node();n.geometry=geo;n.material=mat;n.frustumCulled=false;n.visible=false;return n;},InstancedMesh:Node,PlaneGeometry:GeoS,BoxGeometry:GeoS,SphereGeometry:GeoS,CylinderGeometry:GeoS,DodecahedronGeometry:GeoS,BufferGeometry:GeoS,BufferAttribute:function(){this.needsUpdate=false;this.array=[];this.count=0;},PerspectiveCamera:function(){const n=new Node();n.aspect=1;n.fov=75;n.lookAt=()=>{};n.updateProjectionMatrix=()=>{n.fov=75;};return n;},DirectionalLight:function(){const n=new Node();n.position=Vec();n.shadow={mapSize:{set(){},setSize(){}},camera:{},bias:0};n.target=new Node();return n;},HemisphereLight:Node,AmbientLight:Node,FogExp2:function(){},Raycaster:function(){this.set=()=>{};this.far=0;this.ray={intersectBox:()=>null};},Box3,Euler,Quaternion:function(){const o={x:0,y:0,z:0,w:1};o.setFromEuler=()=>o;o.setFromAxisAngle=()=>o;o.identity=()=>o;return o;},Matrix4:function(){return {compose:()=>{},setFromEuler:()=>{}};},WebGLRenderer:function(){const n=new Node();n.domElement=new Node();n.setPixelRatio=()=>{};n.setSize=()=>{};n.shadowMap={enabled:false,type:0};n.toneMapping=0;n.toneMappingExposure=1;n.outputColorSpace='';n.render=()=>{};n.autoClear=true;return n;},CanvasTexture:function(){return {wrapS:0,wrapT:0,anisotropy:4,needsUpdate:false,repeat:Vec()};},Clock:function(){return {getDelta:()=>0.016};},SRGBColorSpace:'srgb',ACESFilmicToneMapping:2,PCFSoftShadowMap:2,BackSide:1,AdditiveBlending:2,RepeatWrapping:1};
// DOM
const root={};
function makeEl(id){const el={id,style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},children:[],innerHTML:'',textContent:'',value:'2',addEventListener(){},appendChild(c){this.children.push(c);return c;},prepend(c){this.children.unshift(c);},querySelectorAll(){return {forEach(){},length:0};},getContext:()=>ctx2d(),requestPointerLock(){},requestFullscreen(){},setAttribute(){},remove(){},removeChild(){},insertBefore(){},className:'',type:''};root[id]=el;return el;}
const html=fs.readFileSync('index.html','utf8');
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
ids.forEach(id=>makeEl(id));
// set select values for match settings
['sel-teamsize','sel-ai','sel-kills','sel-time','sel-mode','sel-gyro','sel-team','in-callsign','in-vol','in-sens','in-fov'].forEach(id=>{ if(root[id])root[id].value= id==='sel-team'?'0':id==='sel-ai'?'2':id==='sel-kills'?'30':id==='sel-time'?'5':id==='sel-teamsize'?'3':id==='sel-mode'?'offline':(id==='sel-gyro'?'on':id==='in-callsign'?'TESTER':id==='in-vol'?'80':id==='in-sens'?'100':'80'); });
function makeBody(){const b=makeEl('body');b.firstChild=null;return b;}
const doc={documentElement:makeEl('html'),body:makeBody(),getElementById:id=>root[id]||makeEl(id),querySelectorAll(){return {forEach(){},length:0};},createElement:()=>{const c=makeEl('tmp');c.width=256;c.height=256;c.getContext=()=>ctx2d();return c;},addEventListener(){},readyState:'complete',exitPointerLock(){},fullscreenElement:null,exitFullscreen(){},style:{}};
const win={innerWidth:1280,innerHeight:720,devicePixelRatio:1,addEventListener(){},navigator:{maxTouchPoints:0},AudioContext:audioCtxStub,webkitAudioContext:audioCtxStub};
let calls=0;
const ctx=vm.createContext({console,Math,JSON,Object,Array,Number,String,Boolean,Date,Promise,setTimeout,clearTimeout,requestAnimationFrame:()=>0,THREE,document:doc,window:win,navigator:win.navigator,localStorage:{getItem:()=>null,setItem(){},removeItem(){}},DeviceOrientationEvent:undefined,BroadcastChannel:undefined});
try{ vm.runInContext(js,ctx,{timeout:30000}); }catch(err){ console.log('BOOT ERROR:',err.stack.split('\n')[0]); process.exit(1);}
console.log('Boot OK. Now simulating match...');
// reach global functions & create a G
let G;
try{
  vm.runInContext('G = initGame()',ctx);
  G = vm.runInContext('G',ctx);
  vm.runInContext('initUI1(G)',ctx);
  vm.runInContext('initUI2(G)',ctx);
  G.isTouch=false;
  // gather player count before and start match
  const before=vm.runInContext('initGame? 0 : 0',ctx);
  vm.runInContext('startMatch(G)',ctx);
  console.log('Match started. Teamsize:',G.state.teamSize,'aiPerTeam:',G.state.aiPerTeam,'killLimit:',G.state.killLimit);
  console.log('Players spawned:',Object.keys(G.players).length);
  console.log('Local:',G.localPlayer.name,'team',G.localPlayer.team);
  // verify bot counts per team
  const b0=Object.values(G.players).filter(p=>p.team===0&&p.isBot).length;
  const b1=Object.values(G.players).filter(p=>p.team===1&&p.isBot).length;
  const h0=Object.values(G.players).filter(p=>p.team===0&&p.isLocal).length;
  console.log('Team0 bots:',b0,'Team1 bots:',b1,'Local count:',h0);
  // ---- direct game-logic test: kills, score, death, respawn, win ----
  vm.runInContext('' + `
  const p=G.localPlayer;
  const enemy=Object.values(G.players).find(p=>p.team===1&&p.isBot);
  let guard=0;
  while(enemy.alive && guard<50){ guard++; applyDamage(G,enemy,p,p.weapons[p.weaponIdx],true); }
  console.log('After shooting enemy: enemyAlive='+enemy.alive+' score='+JSON.stringify(G.state.score)+' kills='+p.kills+' enemyDeaths='+enemy.deaths);
  p.alive=false; p.health=0; p.deaths=10; p.respawnTimer=0.05;
  respawn(G,p);
  console.log('After respawn: playerAlive='+p.alive+' playerHealth='+p.health);
  for(let i=0;i<30;i++){ G.state.score[0]=i; checkWin(G); if(G.state.over)break; }
  console.log('Win triggered at score0='+G.state.score[0]+' over='+G.state.over);
`, ctx);
  // run 600 update frames
  for(let i=0;i<600;i++){
    vm.runInContext('updateGlobal(G,'+0.016+')',ctx);
    vm.runInContext('render(G)',ctx);
    // every 100 frames, make the local player fire & move
    if(i%30===0){ G.input.fire=true; G.input.lookDx=2; G.input.lookDy=0.3; }
    if(i%30===29){ G.input.fire=false; }
    if(i%120===0){ G.input.move={x:0.6,z:0.8}; G.input.sprint=true; }
    if(i%120===60){ G.input.move={x:0,z:0};G.input.sprint=false; }
  }
  console.log('After 600 frames (10s): score=',G.state.score,'over=',G.state.over);
  const local=G.localPlayer;
  console.log('Local alive:',local.alive,'health:',Math.round(local.health),'kills:',local.kills,'deaths:',local.deaths,'shots:',local.shots);
}catch(err){ console.log('MATCH SIM ERROR:',err.stack); process.exit(1); }
console.log('ALL OK');
