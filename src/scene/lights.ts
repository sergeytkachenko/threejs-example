import {Color, DirectionalLight, PointLight} from "three";

export function createLights() {
    const light = new DirectionalLight(
        new Color("rgb(171,171,171)"), 1);
    light.position.set(0, 100, 0);

    const pointLight = new PointLight(
        new Color("rgb(255,255,255)"), 1 * 10, 1000, 0.1);
    pointLight.position.set(0, 200, 0);

    return [light, pointLight];
}
