import * as THREE from "three";
import {Color, Vector3} from "three";
import {randFloat} from "three/src/math/MathUtils";

const count = 1 * 1000;

export class RocketFire {
    public build(point: Vector3): {mesh: THREE.Object3D, update: (elapsedTime: number) => void} {
        const texture = new THREE.TextureLoader().load( "models/fire.png" );
        const geo = new THREE.BufferGeometry();
        let vertexPositions: any[] = [];
        const vertexColors: number[] = [];
        const color = new Color("rgb(248,129,0)");
        for (let i = 0; i < count; i++) {
            const x = point.x;
            const y = point.y + (Math.random() * 7 * -1);
            const z = point.z;
            vertexPositions.push(x, y , z);
            vertexColors.push(248, 129, 0);
        }
        // points.forEach((p) => {
        //     const { x, y, z } = p;
        //     vertexPositions.push(x, y, z);
        //     vertexColors.push(x * cMult, y * cMult, z * cMult);
        // });
        geo.setAttribute( "position", new THREE.Float32BufferAttribute(vertexPositions, 3));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(vertexColors, 3));
        geo.attributes.position.needsUpdate = true;

        const mat = new THREE.PointsMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
            size: 0.5,
            // map: texture,
            blending: THREE.NormalBlending,
        });
        const mesh = new THREE.Points(geo, mat);
        function update (elapsedTime: number) {
            let vertexPositions: any[] = [];
            const positions: Float32Array = geo.attributes.position.array as unknown as Float32Array;
            for (let i = 0; i < count; i++) {
                const x1 = positions[i * 3 + 0];
                const y1 = positions[i * 3 + 1];
                const z1 = positions[i * 3 + 2];
                const y = y1 - Math.abs(Math.random());

                const f = randFloat(0, 0.2);
                const x = x1 - Math.sin(x1 * f);
                const z = z1 - Math.sin(z1 * f);

                if (y1 < -9) {
                    const circlePoint = new THREE.Vector3().setFromCylindricalCoords(
                        randFloat(0, 1),
                        Math.PI * 2 * Math.random(),
                        randFloat(point.y - 0.5, point.y),
                    );
                    vertexPositions.push(circlePoint.x, circlePoint.y, circlePoint.z);
                } else {
                    vertexPositions.push(x, y , z);
                }
            }
            geo.setAttribute( "position", new THREE.Float32BufferAttribute(vertexPositions, 3));
        }
        return { mesh, update: update };
    }
 }
