import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as skeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
const renderer=new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);

const scene =new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,15,30);
const orbit=new OrbitControls(camera,renderer.domElement);
orbit.update();

// const axesHelper=new THREE.AxesHelper(10);
// scene.add(axesHelper);

const planeGeometry=new THREE.PlaneGeometry(30,30);
const planeMaterial=new THREE.MeshStandardMaterial({
    color:'white',
    visible:false
})
const plane=new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.rotateX(-Math.PI/2)
plane.name="surface";

scene.add(new THREE.AmbientLight('white',2));

const grid=new THREE.GridHelper(30,30);
scene.add(grid);

const highlightPlane=new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshStandardMaterial({
        color:'white',
        side: THREE.DoubleSide,
        transparent:true
        })
)
scene.add(highlightPlane);
highlightPlane.rotateX(-Math.PI/2);
highlightPlane.position.set(0.5,0,0.5)

const mouse=new THREE.Vector2();
const rayCaster=new THREE.Raycaster();
let intersects;


window.addEventListener('mousemove',(e)=>{
    mouse.x=(e.clientX/window.innerWidth)*2-1;
    mouse.y=-(e.clientY/window.innerHeight)*2+1;
    rayCaster.setFromCamera(mouse,camera);
    intersects=rayCaster.intersectObjects(scene.children);
    intersects.forEach(intersect=>{
        if(intersect.object.name=='surface'){
            const highlightPosition=new THREE.Vector3().copy(intersect.point).floor();
            highlightPlane.position.set(highlightPosition.x+0.5,0,highlightPosition.z+0.5);

            const objectexits=objects.find(object=>{
                return (object.position.x == highlightPlane.position.x && object.position.z == highlightPlane.position.z)
               })
            const modelExits=models.find(model=>{
                return (model.position.x == highlightPlane.position.x && model.position.z == highlightPlane.position.z)
            })
            if(!objectexits && !modelExits) highlightPlane.material.color.set('white');
            else highlightPlane.material.color.set('red');
        }
    })
})

const sphere=new THREE.Mesh(
    new THREE.SphereGeometry(0.3,5,5),
    new THREE.MeshStandardMaterial({color:'orange',wireframe:true})
)
const url=new URL('../model/Soldier.glb',import.meta.url);
let soldier,action;
const loader=new GLTFLoader();
loader.load(url.href,(gltf)=>{
    const model=gltf.scene;
    model.rotation.y=Math.PI;
    soldier=model;

    action=gltf.animations.find(clip=>{
        if(clip.name=='Walk'){
            console.log(clip);
            return clip;
        }
    });
    // console.log(animation);
    
})

const objects=[];
const models=[];
const mixers=[];
let flag=true;

window.addEventListener('click',()=>{
    const modelExits=models.find(model=>{
        return (model.position.x == highlightPlane.position.x && model.position.z == highlightPlane.position.z)
    })
    const objectexits=objects.find(object=>{
     return (object.position.x == highlightPlane.position.x && object.position.z == highlightPlane.position.z)
    })
    if(flag){
   if(!objectexits && !modelExits){
        const sphereClone=sphere.clone();
        sphereClone.position.copy(highlightPlane.position);
        sphereClone.position.y=0.3;
        scene.add(sphereClone);
        objects.push(sphereClone);
        highlightPlane.material.color.set('red');
        flag=false;
   }}
   else{
    
   if(!modelExits && !objectexits){
    const soldierClone = new skeletonUtils.clone(soldier);
    soldierClone.position.copy(highlightPlane.position);
    scene.add(soldierClone);
    models.push(soldierClone);
    highlightPlane.material.color.set('red');
    flag=true;
    const mixer=new THREE.AnimationMixer(soldierClone);
    mixer.clipAction(action).play()
    mixers.push(mixer)
    
}}}
)
const clock=new THREE.Clock();

function animation(time){
    const delta=clock.getDelta();
    mixers.forEach(mixer=>{
        mixer.update(delta);
    })
    objects.forEach(object=>{
            object.rotation.x += (0.01)
            object.rotation.y += (0.01)
    })
    highlightPlane.material.opacity=1+Math.sin(time*0.0051);
    renderer.render(scene,camera);
}
renderer.setAnimationLoop(animation);

window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
})
document.body.appendChild(renderer.domElement);
