import {createRenderer} from "@/scene/renderer";
import {createCamera} from "@/scene/camera";
import {createLights} from "@/scene/lights";
import {createScene} from "@/scene/scene";
import {createControls} from "@/scene/controls";
import {AxesHelper, Camera, Clock, Scene, Vector3, WebGLRenderer} from "three";
import {F22Plane} from "@/plane";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {loadModels} from "@/scene/models";

export class Word {
    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: Camera;
    private controls: OrbitControls;

    private animateItems: Array<(lock: Clock) => void> = [];
    private clock: Clock = new Clock();

    constructor(container: HTMLElement) {
        const scene = this.scene = createScene();
        const renderer = this.renderer = createRenderer();
        const camera = this.camera = createCamera();
        const lights = createLights();
        const models = loadModels();

        container.append(renderer.domElement);
        const controls = this.controls = createControls(camera, renderer.domElement);
        controls.update();

        Promise.all(models).then(models => {
            models.forEach(({mesh, animate}) => {
                this.animateItems.push(animate);
                scene.add(mesh);
            })
        })

        camera.position.set(3, 3, 3);
        camera.lookAt(new Vector3());

        scene.add(...lights);

        const axesHelper = new AxesHelper(1);
        scene.add(axesHelper);
    }

    public render(): void {
        this.animateItems.forEach(animateItem => animateItem(this.clock))
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
}
