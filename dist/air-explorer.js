import * as THREE from 'three';
import { GLTFLoader } from './vendor/three/loaders/GLTFLoader.js';
import { OrbitControls } from './vendor/three/controls/OrbitControls.js';

const parts = {
  cover: {n:'01',name:'ฝาครอบและบานสวิง',category:'ตัวเครื่องภายนอก',role:'ดูแลความสะอาดภายนอก และทิศทางลมที่ส่งเข้าห้อง',why:'ฝุ่นและคราบสะสมตามฝาครอบ รอยต่อ และบานสวิง ควรทำความสะอาดตามวิธีที่ผู้ผลิตกำหนด',checks:['คราบฝุ่นตามรอยต่อและช่องลม','สภาพตัวล็อกฝาครอบและรอยแตกร้าว','การเปิด–ปิดและทิศทางของบานสวิง'],result:'ตรวจความเรียบร้อยของฝาครอบ และทดสอบบานสวิงอีกครั้ง',offset:[0,.53,.14],anchor:[.37,.07,.14]},
  filter: {n:'02',name:'แผ่นกรองอากาศ',category:'ด่านแรกที่รับฝุ่น',role:'ดักฝุ่นก่อนอากาศไหลผ่านคอยล์เย็น',why:'ฝุ่นที่อุดตันแผ่นกรองทำให้อากาศผ่านได้น้อยลง แอร์จึงส่งลมและทำความเย็นได้ไม่เต็มประสิทธิภาพ',checks:['ปริมาณฝุ่นและสิ่งอุดตันทั้งสองด้าน','สภาพตาข่าย ขอบกรอง และรอยฉีกขาด','ความแห้งและการใส่กลับเข้ารางอย่างพอดี'],result:'แผ่นกรองสะอาดและใส่แน่น พร้อมตรวจแรงลมหลังประกอบ',offset:[0,.27,.30],anchor:[.37,.05,.09]},
  coil: {n:'03',name:'คอยล์เย็น',category:'หัวใจของการแลกเปลี่ยนความร้อน',role:'รับความร้อนจากอากาศในห้องผ่านแผงครีบและท่อ',why:'สิ่งสกปรกที่เกาะครีบคอยล์ขัดขวางลมและการแลกเปลี่ยนความร้อน จึงควรตรวจและทำความสะอาดตามสภาพ',checks:['ฝุ่นและคราบที่ค้างอยู่ในร่องครีบ','ครีบพับหรือเสียรูปซึ่งกีดขวางทางลม','ความเย็นและอุณหภูมิลมก่อน–หลังบริการ'],result:'ตรวจทางลมผ่านคอยล์ และทดลองเดินเครื่องหลังทำความสะอาด',offset:[0,.015,.22],anchor:[.37,.04,.035]},
  fan: {n:'04',name:'พัดลมโพรงกระรอก',category:'ส่งลมเย็นให้ทั่วห้อง',role:'พัดลมทรงกระบอกกระจายลมจากคอยล์ออกทางช่องแอร์',why:'คราบฝุ่นตามใบพัดอาจลดการไหลของลม และควรตรวจร่วมกับอาการเสียงผิดปกติหรือการสั่นขณะทำงาน',checks:['คราบที่ติดตามซี่ใบพัดและช่องลม','ใบพัดบิ่น แตก หรือมีสิ่งกีดขวาง','เสียง การสั่น และการหมุนขณะทดสอบ'],result:'ทดลองความเร็วพัดลมและฟังเสียงหลังประกอบกลับ',offset:[0,-.16,.27],anchor:[.37,-.05,.015]},
  drain: {n:'05',name:'ถาดน้ำทิ้งและทางระบายน้ำ',category:'นำน้ำควบแน่นออกจากเครื่อง',role:'รวบรวมน้ำจากคอยล์เย็นและระบายออกทางท่อน้ำทิ้ง',why:'คราบและสิ่งอุดตันทำให้น้ำระบายไม่สะดวก อาจล้นถาดหรือหยดออกจากตัวเครื่อง จึงควรตรวจทั้งถาดและทางระบาย',checks:['ตะกอนและคราบสะสมในถาด','รอยรั่ว รอยต่อ และทางเดินท่อ','การไหลของน้ำและน้ำค้างในถาดหลังทดสอบ'],result:'ทดสอบการระบายน้ำและตรวจรอยหยดก่อนจบงาน',offset:[0,-.33,.23],anchor:[.37,-.13,.01]}
};
const host=document.querySelector('#ac-canvas'), labels=document.querySelector('#part-labels');
const toggle=document.querySelector('#explode-toggle'), range=document.querySelector('#explode-range');
let selected='cover', ready=false, amount=0, target=0, frame=0, last=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const modelScale=1.25;
const explodeSpread=.72;
const views={
  assembled:{focus:[0,.07,.08],offset:[.46,.23,2.05]},
  overview:{focus:[0,.03,.03],offset:[.68,.34,3.45]},
  cover:{focus:[0,-.05,.02],offset:[.35,.18,2.05]},
  filter:{focus:[0,.05,.095],offset:[.25,.12,1.45]},
  coil:{focus:[0,.046,.026],offset:[.25,.12,1.45]},
  fan:{focus:[0,-.055,.012],offset:[.24,.11,1.4]},
  drain:{focus:[.05,-.13,.015],offset:[.24,.12,1.4]}
};
const groups={}, pins={}, homes=new Map();
let cameraMode='assembled',cameraPart=null,cameraFollowing=false;
function showPart(key,open=true){
  selected=key; const p=parts[key];
  for(const b of document.querySelectorAll('[data-part]'))b.setAttribute('aria-pressed',String(b.dataset.part===key));
  document.querySelector('#part-kicker').textContent=`${p.n} / 05 · ${p.category}`;
  document.querySelector('#part-title').textContent=p.name;
  for(const field of ['role','why','result'])document.querySelector('#part-'+field).textContent=p[field];
  document.querySelector('#part-checks').replaceChildren(...p.checks.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
  if(ready){
    for(const [id,g] of Object.entries(groups))g.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.set(id===key?0x065ea1:0x000000);o.material.emissiveIntensity=id===key?.15:0;}});
    if(open){setTarget(1,false);setCameraView('part',key);}else draw();
  }
}
document.querySelectorAll('.part-picker button').forEach(b=>b.addEventListener('click',()=>showPart(b.dataset.part)));
function setTarget(t,frameView=true){target=t;if(reduced.matches)amount=t;toggle.setAttribute('aria-pressed',String(t>0));toggle.textContent=t>0?'ประกอบกลับ':'แยกชิ้นส่วนแอร์';if(frameView)setCameraView(t>.03?'overview':'assembled');draw();}
function setCameraView(mode,part=null){cameraMode=mode;cameraPart=part;cameraFollowing=true;draw();}
function draw(){if(!frame)frame=requestAnimationFrame(render);}
let scene,camera,renderer,controls,modelRoot;
function followCamera(dt){
  if(!cameraFollowing)return;
  const view=cameraMode==='part'?views[cameraPart]:views[cameraMode];
  const focus=cameraMode==='part'?groups[cameraPart].localToWorld(new THREE.Vector3(...view.focus)):modelRoot.localToWorld(new THREE.Vector3(...view.focus));
  const destination=focus.clone().add(new THREE.Vector3(...view.offset));
  const alpha=reduced.matches?1:1-Math.exp(-6.5*dt);
  camera.position.lerp(destination,alpha);controls.target.lerp(focus,alpha);controls.update();
  if(camera.position.distanceTo(destination)<.004&&controls.target.distanceTo(focus)<.004){camera.position.copy(destination);controls.target.copy(focus);controls.update();cameraFollowing=false;}
}
function render(now){
  frame=0;const dt=Math.min((now-last)/1000||.016,.05);last=now;
  amount=THREE.MathUtils.damp(amount,target,7,dt);if(Math.abs(amount-target)<.001)amount=target;
  for(const [id,g]of Object.entries(groups)){
    const p=parts[id];g.position.fromArray(p.offset).multiplyScalar(amount*explodeSpread);
    if(id!=='cover')g.visible=amount>.03;
  }
  for(const [o,home]of homes){o.material.opacity=1-amount*.88;o.material.transparent=amount>.01;o.material.depthWrite=amount<.01;}
  range.value=Math.round(amount*100);document.querySelector('#explode-value').textContent=`${Math.round(amount*100)}%`;
  document.querySelector('#view-state').textContent=amount>.5?'สำรวจชิ้นส่วนภายใน':'มุมมองตัวเครื่อง';
  scene.updateMatrixWorld(true);followCamera(dt);camera.updateMatrixWorld();
  for(const [id,b]of Object.entries(pins)){
    const v=groups[id].localToWorld(new THREE.Vector3(...parts[id].anchor)).project(camera);
    b.style.transform=`translate(${(v.x+1)*host.clientWidth/2-22}px,${(1-v.y)*host.clientHeight/2-22}px)`;
    b.style.visibility=amount>.65&&v.z<1?'visible':'hidden';b.tabIndex=amount>.65?0:-1;
  }
  renderer.render(scene,camera);
  if((amount!==target||cameraFollowing)&&!document.hidden)draw();
}
async function init(){
  try{
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
    host.prepend(renderer.domElement);scene=new THREE.Scene();modelRoot=new THREE.Group();scene.add(modelRoot);
    camera=new THREE.PerspectiveCamera(29,1,.01,20);camera.position.set(.46,.23,2.05);
    controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.07,.08);controls.enablePan=false;controls.enableZoom=true;controls.minDistance=1.1;controls.maxDistance=4.2;controls.maxPolarAngle=Math.PI*.8;controls.update();controls.saveState();controls.addEventListener('change',draw);controls.addEventListener('start',()=>cameraFollowing=false);
    scene.add(new THREE.HemisphereLight(0xeaf6ff,0x798a9a,2.5));
    const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-2,3,4);scene.add(light);
    const fill=new THREE.DirectionalLight(0xb9e8ff,1.5);fill.position.set(3,1,-1);scene.add(fill);
    for(const id of Object.keys(parts)){groups[id]=new THREE.Group();modelRoot.add(groups[id]);const b=document.createElement('button');b.type='button';b.className='part-pin';b.dataset.part=id;b.textContent=parts[id].n;b.setAttribute('aria-label',parts[id].name);b.addEventListener('click',()=>showPart(id));labels.append(b);pins[id]=b;}
    const gltf=await new GLTFLoader().loadAsync('assets/celar-air.glb');modelRoot.add(gltf.scene);scene.updateMatrixWorld(true);
    const meshes=[];gltf.scene.traverse(o=>{if(o.isMesh)meshes.push(o);});
    for(const o of meshes){o.material=o.material.clone();if(/Front_Cover|Brand|Display|Indicator|Swing_Flap|Lower_Edge|Outlet_Upper_Lip/.test(o.name)){groups.cover.attach(o);o.userData.part='cover';}else{homes.set(o,o.position.clone());o.userData.part='cover';}}
    function mat(color,metalness=0){return new THREE.MeshStandardMaterial({color,roughness:.46,metalness});}
    function box(id,size,pos,color){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat(color));m.position.set(...pos);m.userData.part=id;groups[id].add(m);return m;}
    // Schematic interior: distinct geometry for mesh filter, finned coil, cross-flow fan and drain tray.
    for(const x of [-.195,.195]){
      box('filter',[.37,.008,.012],[x,.133,.095],0x2b7289);box('filter',[.37,.008,.012],[x,-.038,.095],0x2b7289);
      for(const dx of [-.183,.183])box('filter',[.008,.18,.012],[x+dx,.048,.095],0x2b7289);
      for(let i=0;i<19;i++)box('filter',[.002,.17,.003],[x-.174+i*.019,.048,.095],0x87c1c9);
      for(let i=0;i<9;i++)box('filter',[.36,.002,.003],[x,-.032+i*.020,.096],0x87c1c9);
    }
    box('coil',[.75,.15,.055],[0,.046,.018],0x507887);
    for(let i=0;i<65;i++)box('coil',[.003,.153,.064],[-.369+i*.0115,.046,.026],0x9cbed0);
    for(let i=0;i<3;i++)box('coil',[.77,.008,.008],[0,-.003+i*.047,.064],0xb87d46);
    const cylinder=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.74,40,1,true),mat(0x294d65));cylinder.rotation.z=Math.PI/2;cylinder.position.set(0,-.055,.012);cylinder.userData.part='fan';groups.fan.add(cylinder);
    for(let i=0;i<24;i++){const a=i*Math.PI/12;const blade=box('fan',[.74,.003,.016],[0,-.055+Math.sin(a)*.046,.012+Math.cos(a)*.046],0x719bb1);blade.rotation.x=-a;}
    for(const x of [-.375,-.18,0,.18,.375]){const disc=new THREE.Mesh(new THREE.CylinderGeometry(.049,.049,.005,32),mat(0x375970));disc.rotation.z=Math.PI/2;disc.position.set(x,-.055,.012);disc.userData.part='fan';groups.fan.add(disc);}
    box('drain',[.79,.012,.105],[0,-.137,.015],0xd5e3ea);
    for(const z of [-.035,.065])box('drain',[.79,.025,.006],[0,-.12,z],0xa6c9db);
    for(const x of [-.392,.392])box('drain',[.006,.025,.105],[x,-.12,.015],0xa6c9db);
    box('drain',[.083,.018,.018],[.428,-.137,.014],0x69a8c5);
    modelRoot.scale.setScalar(modelScale);
    ready=true;host.dataset.ready='true';document.querySelector('#viewer-status').hidden=true;toggle.disabled=false;range.disabled=false;
    showPart(selected,false);
    toggle.addEventListener('click',()=>setTarget(target>0?0:1));range.addEventListener('input',()=>setTarget(Number(range.value)/100));
    document.querySelector('#reset-view').addEventListener('click',()=>setTarget(0));
    let down;
    renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
    renderer.domElement.addEventListener('pointerup',e=>{
      if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;
      const r=renderer.domElement.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);
      const targets=amount>.03?Object.values(groups).filter(g=>g.visible):[gltf.scene,groups.cover];
      const hit=ray.intersectObjects(targets,true)[0];if(hit?.object.userData.part)showPart(hit.object.userData.part);
    });
    const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();draw();};
    new ResizeObserver(resize).observe(host);resize();
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw();});
  }catch(error){document.querySelector('#viewer-status').textContent='แสดงโมเดล 3D ไม่ได้ในขณะนี้ คุณยังเลือกอ่านจุดตรวจแต่ละส่วนได้จากปุ่ม';console.error('AC explorer:',error);}
}
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();init();}},{rootMargin:'300px'});observer.observe(host);
const hero=document.querySelector('model-viewer');
if(reduced.matches && hero)hero.removeAttribute('auto-rotate');
