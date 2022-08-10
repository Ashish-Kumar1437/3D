import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// import nebula from '../img/nabula.jpg';
import stars from '../img/stars.jpg';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AnimationMixer } from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor('white',0.5);


document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 10, 15);

// const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
// const cubeLoader=new THREE.CubeTextureLoader();
// scene.background=cubeLoader.load([stars,stars,nabula,stars,nabula,stars]);
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//     nebula,
//     nebula,
//     stars,
//     stars,
//     stars,
//     stars
// ]);




//orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

//axesHelper
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

//sphere
const sphereGeometry = new THREE.SphereGeometry(1, 25, 25);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: '#ed3610',
    // wireframe:true
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 10;
sphere.position.z = 3;
sphere.castShadow = true;
scene.add(sphere);

//plane Geometry
const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
    side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

//grid Helper
const grid = new THREE.GridHelper(10, 10, 'red', 'red');
scene.add(grid);

//direction Light
const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(0, 25, 20);
directionLight.castShadow = true;
scene.add(directionLight);

//ambient Light
// const ambientLight=new THREE.AmbientLight('black',1)
// scene.add(ambientLight);

//shadow helper
const shadowHelper = new THREE.CameraHelper(directionLight.shadow.camera);
scene.add(shadowHelper);

//direction Light Helper
const directionLightHelper = new THREE.DirectionalLightHelper(directionLight);
scene.add(directionLightHelper);


// 3d object

const gltfLoader=new GLTFLoader();
const url=new URL('../model/monkey.glb',import.meta.url);
gltfLoader.load(url.href,function(gltf){
    const monkey=gltf.scene;
    scene.add(monkey);
    monkey.position.set(5,5,5);
}, undefined, function(error) {
    console.error(error);
});

const dogModel=new URL('../model/dog.glb',import.meta.url);
let mixer;
let clips
gltfLoader.load(dogModel.href,(gltf)=>{
    const dog=gltf.scene;
    scene.add(dog);
    dog.castShadow=true;

    mixer=new THREE.AnimationMixer(dog);
    clips=gltf.animations;
    clips.forEach((clip)=>{
        mixer.clipAction(clip).play();
    })
}, undefined, function(error) {
    console.error(error);
});
//dat gui
const gui = new dat.GUI();

const options = {
    spherecolor: "#ed3610",
    speed: 0.01,
    wireframe: false
}

gui.addColor(options, 'spherecolor').onChange(function (e) {
    sphere.material.color.set(e);
})

gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0, 0.1);

let step = 0;
const clock=new THREE.Clock();
function animate() {
    if(mixer){
        mixer.update(clock.getDelta());
    }
    step += options.speed;
    sphere.position.y = 1 + (5 * Math.abs(Math.sin(step)));
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
})