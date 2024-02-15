import {AbstractPlanet, Planet} from "@/planet/abstract-planet";
import {Clock, Color} from "three";
import {Material} from "three/src/materials/Material";
import * as THREE from "three";

export class Sun extends AbstractPlanet {

    protected getColor(): Color {
        return new Color("rgb(225,173,1)");
    }

    protected createMaterial(): Material {
        const earthMColor = this.getColor();
        return new THREE.MeshBasicMaterial({
            // wireframe: true,
            color: earthMColor,
            reflectivity: 0.57,
        });
    }

    public animate(clock: Clock) {
        const slowMo = 0.5;
        const elapsedTimeSlowMo = clock.elapsedTime * slowMo;
        const elapsedTime = clock.elapsedTime;
        const orbitRadius = 200;
        const x = this.group.position.x;
        const y = Math.cos(elapsedTimeSlowMo) * 100;
        const z = Math.sin(elapsedTimeSlowMo) * 350;
        // this.group.position.set(x, y, z);
    }
}
