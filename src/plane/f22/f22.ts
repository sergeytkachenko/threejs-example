import {AbstractPlane} from "@/plane";
import {
    Object3D,
    Clock,
    Camera,
    Vector3,
    Group,
    Mesh,
    MeshPhongMaterial,
    Scene,
    Quaternion,
    Euler,
    Ray,
    BufferGeometry,
    BufferAttribute,
    PointsMaterial,
    Points,
    Box3, BoxHelper, Box3Helper, Sprite, WebGLRenderer
} from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {FilmPass} from "three/examples/jsm/postprocessing/FilmPass";
import {OutputPass} from "three/examples/jsm/postprocessing/OutputPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export class F22Plane extends AbstractPlane {
    private object: Group | undefined;
    private camera: Camera | undefined;
    private engine: Mesh = new Mesh();
    private nose: Mesh = new Mesh();
    private pilot: Mesh = new Mesh();
    private f22: Mesh = new Mesh();
    private scene: Scene | undefined;
    private desiredDelta = {
        rotation: {
            x: 0,
            y: 0,
            z: 0,
            add(delta: Vector3) {
                this.x += delta.x;
                this.y += delta.y;
                this.z += delta.z;
            },
            tickDelta() {
                const step = 0.01;
                const {x, y, z} = this;
                const deltaX = Math.min(Math.abs(x), step);
                const xSign = Math.sign(x);

                const deltaY = Math.min(Math.abs(y), step);
                const ySign = Math.sign(y);

                const deltaZ = Math.min(Math.abs(z), step);
                const zSign = Math.sign(z);

                this.x -= deltaX * xSign;
                this.y -= deltaY * ySign;
                this.z -= deltaZ * zSign;

                return {x: deltaX * xSign, y: deltaY * ySign, z: deltaZ * zSign};
            }
        },
        speed: 0.001,
    };

    async build(): Promise<{
        mesh: Object3D;
        animate: (clock: Clock) => void;
        focus: (camera: Camera, scene: Scene) => void;
        keydown(keys: string[]): void;
    }> {

        return new Promise(async resolve => {
            const loader = new GLTFLoader();
            const model = await loader.loadAsync('./models/f22.glb');
            const object: Group = model.scene;
            const engine= object.children
                .find(x => x.name === 'engine') as Mesh;

            const nose = object.children
                .find(x => x.name === 'nose') as Mesh;
            const pilot = object.children
                .find(x => x.name === 'pilot') as Mesh;

            this.engine = engine;
            this.nose = nose;
            this.pilot = pilot;
            this.object = object;

            [engine, nose, pilot].forEach(x => {
                (x.material as MeshPhongMaterial).transparent = true;
                (x.material as MeshPhongMaterial).opacity = 0;
            });

            object.scale.set(0.1, 0.1 , 0.1);
            // object.position.set(1, 0, 0);

            // object.rotation.setFromQuaternion(
            //     new Quaternion()
            //         .setFromAxisAngle(new Vector3( 0, 0, 1 ), Math.PI / 2 )
            // );
            //
            // const quaternion = new Quaternion();
            // quaternion.setFromAxisAngle(new Vector3( 0, 0, 0 ), Math.PI / 2 );
            //
            // const t = object.quaternion.clone().multiply(quaternion).normalize();
            //
            // object.rotation.setFromQuaternion(t);

            resolve({
                mesh: object,
                animate: (clock: Clock) => {
                    this.animate();
                },
                focus: (camera: Camera, scene) => {
                    this.scene = scene;
                    this.camera = camera;
                    this.animate();
                },
                keydown: keys => this.keydown(keys)
            });
        });
    }

    private keydown(keys: string[]) {
        const delta = 0.005;
        keys.forEach(key => {
            switch(key) {
                case 'd':
                    this.desiredDelta.rotation.add(new Vector3(0, 0, delta * 2));
                    break;
                case 'a':
                    this.desiredDelta.rotation.add(new Vector3(0, 0, -delta * 2))
                    break;
                case 'w':
                    this.desiredDelta.rotation.add(new Vector3(delta, 0, 0))
                    break;
                case 's':
                    this.desiredDelta.rotation.add(new Vector3(-delta, 0, 0))
                    break;
                case 'c':
                    this.desiredDelta.speed += 0.01;
                    break;
                case 'v':
                    this.desiredDelta.speed -= 0.01;
                    break;
                case 'q':
                    this.desiredDelta.rotation.add(new Vector3(0, delta, 0))
                    break;
                case 'e':
                    this.desiredDelta.rotation.add(new Vector3(0, -delta, 0))
                    break;
            }
        });
    }

    private animate() {
        const object = this.object;
        if (!object || !this.scene) {
            return;
        }

        let {x, y, z} = this.desiredDelta.rotation
            .tickDelta();

        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(new Vector3(x, y, z), Math.PI / 2 );

        const newQuaternion = object.quaternion
            .clone()
            .multiply(quaternion)
            .normalize();

        // object.rotation.setFromQuaternion(newQuaternion);
        object.quaternion.slerp(newQuaternion, 0.5);

        // this.engine.add(this.camera as any)

        // const dotGeometry = new BufferGeometry();
        // dotGeometry.setAttribute('position', new BufferAttribute(
        //     new Float32Array([
        //         objects.nose.x,
        //         objects.nose.y,
        //         objects.nose.z,
        //     ]), 3)
        // );
        // const dotMaterial = new PointsMaterial({ size: 0.05, color: 0xff0000 });
        // const dot = new Points(dotGeometry, dotMaterial);
        // //this.scene.add(dot);

        // const cameraPosition = objects
        //     .nose.clone()
        //     .add(dir);

        // this.camera?.position.set(
        //     cameraPosition.x,
        //     cameraPosition.y,
        //     cameraPosition.z,
        // );
        // this.camera?.lookAt(objects.nose.x, objects.nose.y,objects.nose.z);
        //

        let f22Quaternion = new Quaternion().setFromEuler(object.rotation);
        const v2 = new Vector3( 0, 0, 0.1).applyQuaternion(f22Quaternion);

        const offset = this.desiredDelta.speed;
        object.position.add(v2.clone().multiplyScalar(offset));


        const objects = {
            nose: new Vector3(),
            engine: new Vector3(),
            pilot: new Vector3(),
            f22: new Vector3(),
        };
        this.nose.getWorldPosition(objects.nose);
        this.engine.getWorldPosition(objects.engine);
        this.pilot.getWorldPosition(objects.pilot);
        this.f22.getWorldPosition(objects.f22);

        const targetCameraPosition = object.position.clone();

        // const targetCameraPosition = objects.nose.clone();


        const a1 = new Quaternion().setFromEuler(object.rotation);
        const ang = 0 * (Math.PI / 180);
        const a = new Quaternion()
            .setFromEuler(object.rotation);

            // .setFromAxisAngle(new Vector3(0, object.rotation.y, 0), a1.w)

        const v1 = new Vector3(0, 0.2, -1)
            .applyQuaternion(a)
            .multiplyScalar(2.3);
        targetCameraPosition.add(v1);

        const dotGeometry = new BufferGeometry();
        dotGeometry.setAttribute('position', new BufferAttribute(
            new Float32Array([
                targetCameraPosition.x,
                targetCameraPosition.y,
                targetCameraPosition.z,
            ]), 3)
        );
        const dotMaterial = new PointsMaterial({ size: 0.05, color: 0xff0000 });
        const dot = new Points(dotGeometry, dotMaterial);
        this.scene.add(dot);


        // this.camera?.up.set(0, 0.1, 0);
        this.camera?.lookAt(object.position.x, object.position.y, object.position.z);
        this.camera?.position.set(targetCameraPosition.x, targetCameraPosition.y, targetCameraPosition.z);

        // this.camera?.position.set(5, 5, 5);
        // this.camera?.lookAt(new Vector3())
    }
}

