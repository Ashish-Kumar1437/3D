import * as THREE from 'three';


export class Controls{
    constructor(mixer,animationMap,model,currentAction){
        this.mixer=mixer;
        this.animationMap=animationMap;
        this.model=model;
        this.currentAction=currentAction;
        this.fadeDuration=0.2;
        this.shift=false;
        this.keys=['w','a','s','d','ArrowUp','ArrowLeft','ArrowDown','ArrowRight'];
        this.animationMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
    }
    
    
    toggleshift(){
       this.shift=!this.shift;
    }

    UpdateMovement(delta,keyPressed){
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