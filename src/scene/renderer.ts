import {WebGLRenderer} from "three";

export function createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({
        antialias: true,
    });
    renderer.toneMappingExposure = Math.pow(0.7, 5.0);
    const sizes = {
        width: window.innerWidth - 20,
        height: window.innerHeight - 20,
    };
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
}
