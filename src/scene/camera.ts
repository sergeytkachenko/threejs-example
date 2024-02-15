import {PerspectiveCamera} from "three";

export function createCamera() {
    const sizes = { width: window.innerWidth - 20, height: window.innerHeight - 20};
    const camera = new PerspectiveCamera(
        75, sizes.width / sizes.height, 0.1);
    return camera;
}
