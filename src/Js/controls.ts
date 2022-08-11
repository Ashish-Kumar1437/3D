import * as THREE from 'three';


export class Controls{
    mixer:THREE.AnimationMixer;
    animationMap: Map<string, THREE.AnimationAction> = new Map();
    currentAction:string ;
    fadeDuration=0.2;
    model:THREE.Group;
    shift:boolean=false;
    keys=['w','a','s','d','ArrowUp','ArrowLeft','ArrowDown','ArrowRight'];
    
    constructor(mixer:THREE.AnimationMixer,animationMap: Map<string, THREE.AnimationAction>,model:THREE.Group,currentAction:string){
        this.mixer=mixer;
        this.animationMap=animationMap;
        this.model=model;
        this.currentAction=currentAction;
        this.animationMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
    }
    
    public toggleshift(){
        this.shift = !this.shift;
    }

    public UpdateMovement(delta:number,keyPressed:object){
        const movement=this.keys.some(key => keyPressed[key]==true);
        var play="";
        if(movement && this.shift) play='Run';
        else if(movement) play="Walk";
        else play='Idle';

        if(play != this.currentAction){
            const stop=this.animationMap.get(this.currentAction);
            const start=this.animationMap.get(play);

            stop?.fadeOut(this.fadeDuration);
            start?.reset().fadeIn(this.fadeDuration).play();
            this.currentAction=play;

        }
        this.mixer.update(delta);
        
    }
}