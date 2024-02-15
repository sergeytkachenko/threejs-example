import {Color, Scene} from "three";

export function createScene() {
    const scene = new Scene();
    scene.background = new Color("rgb(210,213,212)");
    return scene;
}
