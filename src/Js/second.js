import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader.js';


const renderer=new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('yellow',0.5);
renderer.shadowMap.enabled=true;

document.body.appendChild(renderer.domElement);

const scene= new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z=10;
camera.position.y=5;

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const planeGeometry=new THREE.PlaneGeometry(15,15,20,20);
const planeMaterial=new THREE.MeshStandardMaterial({color:'white'});
const plane=new THREE.Mesh(planeGeometry,planeMaterial);
plane.rotation.x=-Math.PI/2;
plane.receiveShadow=true;
scene.add(plane);

const spotlight=new THREE.SpotLight('white',2)
scene.add(spotlight);
spotlight.position.set(-5,20,10);
spotlight.castShadow=true;
spotlight.angle=Math.PI/24;

const loader=new GLTFLoader();
const url=new URL('../model/rtfkt-brothers-400/source/RTFKT-Brothers-400.glb',import.meta.url);
let mixer;
loader.load(url.href,gltf=>{
    const model=gltf.scene;
    model.traverse(function (object) {
        console.log(object);
        if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    mixer=new THREE.AnimationMixer(model);
    const animations=gltf.animations;
    animations.forEach(animation =>{
        mixer.clipAction(animation).play();
    })
})

const ambientLight=new THREE.AmbientLight('white',0.2);
scene.add(ambientLight);

const clock=new THREE.Clock();
function animation(){
    if(mixer) mixer.update(clock.getDelta()*2);
    renderer.render(scene,camera);
}
renderer.setAnimationLoop(animation);

window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

