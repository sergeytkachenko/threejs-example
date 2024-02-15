import {F22Plane} from "@/plane";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Clock, Group} from "three";
import {Object3D} from "three/src/core/Object3D";

export function loadModels(): Array<Promise<{mesh: Object3D, animate: any}>> {
    const loader = new GLTFLoader();
    const parrot = loader
        .loadAsync('./models/parrot.glb')
        .then(model => {
            const object: Group = model.scene;
            object.scale.set(0.01, 0.01, 0.01);
            object.position.set(0, -1, 0);
            return {mesh: object, animate: () => {}};
        })

    const f22Factory = new F22Plane();
    return [f22Factory.build(), parrot];
}
