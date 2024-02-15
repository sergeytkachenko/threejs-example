import {Object3D} from "three/src/core/Object3D";
import {Camera, Clock} from "three";

export abstract class AbstractPlane {
    abstract build(renderer: any, a: any): Promise<{
        mesh: Object3D,
        focus: (camera: Camera, scena: any) => void,
        animate: (clock: Clock) => void,
    }>;
}
