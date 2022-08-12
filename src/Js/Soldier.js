import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {Controls} from './controls'

const renderer =new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor('aqua');
renderer.shadowMap.enabled=true;

const scene= new THREE.Scene();
const camera= new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,4,10);

const orbit =new OrbitControls(camera,renderer.domElement);
orbit.update();

const planeGeometry=new THREE.PlaneGeometry(15,15,20,20);
const planeMaterial=new THREE.MeshStandardMaterial({color:"yellow",
side:THREE.DoubleSide});
const plane=new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.rotation.x=-Math.PI/2;
plane.receiveShadow=true;

const directionLight=new THREE.DirectionalLight();
scene.add(directionLight);
directionLight.castShadow=true;
directionLight.position.set(0,10,10);

scene.add(new THREE.AmbientLight('white',0.5))

const url=new URL('../model/Soldier.glb',import.meta.url);
const loader=new GLTFLoader();

let controls;
loader.load(url.href,(gltf)=>{
    const model=gltf.scene;
    model.traverse((obj)=>{
        if(obj.isObject3D){obj.castShadow=true;
    }
    })
    model.rotation.y=Math.PI;
    scene.add(model);

    const mixer=new THREE.AnimationMixer(model);
    const animations=gltf.animations;
    const animationMap=new Map();
    animations.filter(a => a.name != 'Tpose').forEach((a)=>{
        animationMap.set(a.name,mixer.clipAction(a));
    })
    controls = new Controls(mixer,animationMap,model,'Idle');
})
let keyPressed={};
window.addEventListener('keydown',(e)=>{
    if(e.shiftKey && controls){
        controls.toggleshift();
    }else{
        keyPressed[e.key.toLowerCase()]=true;
    }
    // console.log(e.key);
})
window.addEventListener('keyup',(e)=>{
        keyPressed[e.key.toLowerCase()]=false;
    // console.log(e.key);
})

const clock=new THREE.Clock()
function animate(){
    let mixerDelta=clock.getDelta();
    if(controls)controls.UpdateMovement(mixerDelta,keyPressed);
renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
})

document.body.appendChild(renderer.domElement);