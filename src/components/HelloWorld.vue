<template>
  <div ref="el" id="canvas"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";
import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {Color, LinearSRGBColorSpace, Mesh, Vector2, Vector3} from "three";
import {Earth} from "@/planet";
import {Sun} from "@/planet/sun";
import {AbstractPlanet} from "@/planet/abstract-planet";
import {Object3D} from "three/src/core/Object3D";

const el = ref(null);

onMounted(() => {
  const mouse = {
    position: new Vector2(),
    leftPressed: false,
  };
  const canvas = el.value as unknown as HTMLElement;
  const renderer = new WebGPURenderer({
    antialias: true,
  });

  renderer.outputColorSpace = LinearSRGBColorSpace;

  const sizes = { width: window.innerWidth - 20, height: window.innerHeight - 20};

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const sceneColor = new THREE.Color("rgb(210,213,212)");
  scene.background = sceneColor;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1500, 1500, 10, 10),
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("rgb(66,155,124)"),
      transparent: true,
      opacity: 0.9,
    })
  );
  plane.castShadow = true;
  plane.position.y = -50;
  plane.rotation.x = -0.5 * Math.PI;
  scene.add(plane);

  const sunPlanet = new Sun({
    radius: 20,
    position: new Vector3(),
  });

  const earthPlanet = new Earth({
    radius: 5,
    position: new THREE.Vector3(100, 0, 0),
  });

  const planets = [sunPlanet, earthPlanet];
  scene.add(...planets.map(x => x.group));
  //
  // const sunLight = new THREE.SpotLight(0xffffff, 300, 100, 9.2);
  // sunLight.position.set(0, y, 0);
  // // sunLight.target.add(sun);
  // scene.add(sunLight);

  const arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(),
      new THREE.Vector3(),
      0.5,
      0xffff00
  );
  scene.add(arrowHelper);

  const light = new THREE.DirectionalLight(new Color("rgb(171,171,171)"), 1);
  light.position.set(0, 100, 0);
  scene.add(light);

  const pointLight = new THREE.PointLight(new Color("rgb(255,255,255)"), 1 * 10, 1000, 0.1);
  pointLight.position.set(0, 200, 0);
  scene.add(pointLight);

  //
  // const lightHelper = new THREE.PointLightHelper(light, 2);
  // scene.add(lightHelper);

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  canvas.appendChild(renderer.domElement);

  const maxY = Math.max(...planets.map(x => Math.abs(x.group.position.y))) + 1;
  const maxX = Math.max(...planets.map(x => Math.abs(x.group.position.x))) + 1;
  const maxZ = Math.max(...planets.map(x => Math.abs(x.group.position.z))) + 1;
  const d = (maxY + maxX + maxZ) * 1.5;
  camera.position.set(d, d / 2, d / 2);
  camera.lookAt(0, 0, 0);

  let focusPlanet: AbstractPlanet | undefined;
  const clock = new THREE.Clock();
  const setHover = () => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse.position, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    planets.forEach(x => x.setHover(false));
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const planet = planets.find(x => x.group === intersect.object.parent);
      planet?.setHover(true);
    }
  }
  function getThirdPersonCameraPosition(character: Object3D, lookAt: Vector3): Vector3 {
    const offset = 50;
    if (character.position.distanceTo(new Vector3()) === 0) {
      return new Vector3(offset, offset, offset);
    }
    const vector = new Vector3();
    vector.subVectors(lookAt, character.position);
    return vector.setLength(-offset).add(character.position);
  }
  const tick = () => {
    if (focusPlanet) {
      const lookAt = new Vector3();
      const thirdPerson = getThirdPersonCameraPosition(focusPlanet.group, lookAt);
      camera.position.copy(thirdPerson);
      camera.lookAt(lookAt);
    }
    pointLight.position.copy(sunPlanet.group.position)
    setHover();
    clock.getElapsedTime();
    // labelRender.render(scene, camera);
    planets.forEach(planet => planet.animate(clock));
    renderer.render(scene, camera);
  };
  function animate() {
    requestAnimationFrame(animate);
    tick();
  }
  animate();
  renderer.domElement.addEventListener("mousedown", onMouseDown, false);
  renderer.domElement.addEventListener("mouseup", onMouseUp, false);
  renderer.domElement.addEventListener("mousemove", onMouseMove, false);
  renderer.domElement.addEventListener("dblclick", onDblClick, false);
  function onMouseDown(event: MouseEvent) {
    mouse.leftPressed = true;
  }
  function onMouseUp(event: MouseEvent) {
    mouse.leftPressed = false;
  }
  function onMouseMove(event: MouseEvent) {
    mouse.position.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    );
    if (mouse.leftPressed) {
      focusPlanet = undefined;
    }
  }
  function onDblClick(event: MouseEvent) {
    const mouse = new THREE.Vector2();
    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    );
    const raycasterClick = new THREE.Raycaster();
    raycasterClick.setFromCamera(mouse, camera);
    const intersects = raycasterClick.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const planet = planets.find(x => x.group === intersect.object.parent);
      if (planet) {
        focusPlanet = planet;
      } else {
        focusPlanet = undefined;
      }
    } else {
      focusPlanet = undefined;
    }
  }
});

</script>
