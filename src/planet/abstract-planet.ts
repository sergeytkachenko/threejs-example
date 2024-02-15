import {Clock, Color, Group, Mesh, MeshPhysicalMaterial, Vector3} from "three";
import * as THREE from "three";
import {Material} from "three/src/materials/Material";
import {Object3D} from "three/src/core/Object3D";

export interface Planet {
    radius: number; // m
    position: Vector3;
}

export abstract class AbstractPlanet {
    constructor(protected config: Planet) {
        this._color = this.getColor();
        this.create();
    }

    private _color: Color | undefined;
    private _isHover: boolean = false;
    private _group: Group = new THREE.Group();
    private _mesh: Object3D | undefined;
    private _hoverMesh: Object3D | undefined;

    protected getSlowMo(): number {
        return 0.1;
    }

    protected getColor(): Color {
        return new Color("rgb(64,0,161)");
    }

    protected createMaterial(): Material {
        const color = this.getColor();
        return new THREE.MeshPhysicalMaterial({
            wireframe: false,
            color: color,
            // roughness: 0.1,
            reflectivity: 0.57,
        });
    }

    protected createHoverMesh() {
        const material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: new Color("rgb(219,238,255)"),
        });
        const segments = this.getSegments();
        const geometry = new THREE.SphereGeometry(
            this.config.radius, segments, segments);
        this._hoverMesh = new THREE.Mesh(geometry, material);
    }

    protected getSegments(): number {
        return 12;
    }

    protected create() {
        const material = this.createMaterial();
        material.vertexColors = true;
        const segments = this.getSegments();
        const geometry = new THREE.SphereGeometry(
            this.config.radius, segments, segments);
        this._mesh = new THREE.Mesh(geometry, material);
        this._group.add(this._mesh);
        this.createHoverMesh();
        this._group.position.set(
            this.config.position.x,
            this.config.position.y,
            this.config.position.z
        );
    }

    public get group(): Group {
        return this._group as Group;
    }

    public setHover(isHover: boolean) {
        this._isHover = isHover;
        if (isHover) {
            this.group.add(this._hoverMesh as Mesh);
        } else {
            this.group.remove(this._hoverMesh as Mesh);
        }
    }

    public animate(clock: Clock) {
        const slowMo = this.getSlowMo();
        const elapsedTimeSlowMo = clock.elapsedTime * slowMo;
        const elapsedTime = clock.elapsedTime;
        const orbitRadius = this.config.position.x;
        const x = Math.cos(elapsedTimeSlowMo) * orbitRadius;
        const y = this.config.position.y;
        const z = Math.sin(elapsedTimeSlowMo) * orbitRadius;
        this.group.position.set(x, y, z);
    }
}
