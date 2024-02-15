<template>
  <div ref="sceneRoot" id="scene"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";
import {
  Color,
  LinearSRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {Earth} from "@/planet";
import {Sun} from "@/planet/sun";
import {Object3D} from "three/src/core/Object3D";
import {F22Plane} from "@/plane";
import {Word} from "@/scene/main";

const sceneRoot = ref(null);

onMounted(async () => {
  const canvas = sceneRoot.value as unknown as HTMLElement;
  const word = new Word(canvas);

  word.render();


  //
  // const mouse = {
  //   position: new Vector2(),
  //   leftPressed: false,
  // };
  //
  // const renderer = new WebGLRenderer({
  //   antialias: true,
  // });
  //
  // renderer.outputColorSpace = LinearSRGBColorSpace;
  //
  // const sizes = { width: window.innerWidth - 20, height: window.innerHeight - 20};
  //
  // renderer.setSize(sizes.width, sizes.height);
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //
  // const scene = new THREE.Scene();
  // const sceneColor = new THREE.Color("rgb(210,213,212)");
  // scene.background = sceneColor;
  //
  // const plane = new THREE.Mesh(
  //   new THREE.PlaneGeometry(1500, 1500, 10, 10),
  //   new THREE.MeshPhysicalMaterial({
  //     color: new THREE.Color("rgb(66,155,124)"),
  //     transparent: true,
  //     opacity: 0.9,
  //   })
  // );
  // plane.castShadow = true;
  // plane.position.y = -50;
  // plane.rotation.x = -0.5 * Math.PI;
  // scene.add(plane);
  //
  // const sunPlanet = new Sun({
  //   radius: 20,
  //   position: new Vector3(150, 150, 150),
  // });
  //
  // const earthPlanet = new Earth({
  //   radius: 5,
  //   position: new THREE.Vector3(100, 0, 0),
  // });
  //
  // const planets = [sunPlanet, earthPlanet];
  // scene.add(...planets.map(x => x.group));
  // //
  // // const sunLight = new THREE.SpotLight(0xffffff, 300, 100, 9.2);
  // // sunLight.position.set(0, y, 0);
  // // // sunLight.target.add(sun);
  // // scene.add(sunLight);
  //
  // const arrowHelper = new THREE.ArrowHelper(
  //     new THREE.Vector3(),
  //     new THREE.Vector3(),
  //     0.5,
  //     0xffff00
  // );
  // scene.add(arrowHelper);
  //
  // const light = new THREE.DirectionalLight(new Color("rgb(171,171,171)"), 1);
  // light.position.set(0, 100, 0);
  // scene.add(light);
  //
  // const pointLight = new THREE.PointLight(new Color("rgb(255,255,255)"), 1 * 10, 1000, 0.1);
  // pointLight.position.set(0, 200, 0);
  // scene.add(pointLight);
  //
  // //
  // // const lightHelper = new THREE.PointLightHelper(light, 2);
  // // scene.add(lightHelper);
  //
  // const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1);
  //
  // // // todo: Sound
  // // const listener = new THREE.AudioListener();
  // // camera.add(listener);
  // // const sound = new THREE.Audio(listener);
  // // const audioLoader = new THREE.AudioLoader();
  // // audioLoader.load( 'models/thrusters_loopwav-14699.mp3', function(buffer) {
  // //   sound.setBuffer(buffer);
  // //   sound.setLoop(true);
  // //   sound.setVolume(0.5);
  // //   sound.play();
  // // });
  //
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  //
  // const f22Factory = new F22Plane();
  // const f22 = await f22Factory.build(renderer, renderer.domElement);
  //
  // scene.add(f22.mesh);
  //
  // // const controls = new OrbitControls(camera, renderer.domElement);
  // // controls.update();
  //
  // canvas.appendChild(renderer.domElement);
  //
  // f22.focus(camera, scene);
  //
  // let focusPlanet: Object3D | undefined;
  // const clock = new THREE.Clock();
  // const setHover = () => {
  //   const raycaster = new THREE.Raycaster();
  //   raycaster.setFromCamera(mouse.position, camera);
  //   const intersects = raycaster.intersectObjects(scene.children, true);
  //   planets.forEach(x => x.setHover(false));
  //   if (intersects.length > 0) {
  //     const intersect = intersects[0];
  //     const planet = planets.find(x => x.group === intersect.object.parent);
  //     planet?.setHover(true);
  //   }
  // }
  //
  // const tick = () => {
  //   if (focusPlanet) {
  //     const lookAt = new Vector3();
  //     camera.lookAt(lookAt);
  //   }
  //   pointLight.position.copy(sunPlanet.group.position)
  //   setHover();
  //   clock.getElapsedTime();
  //
  //   f22.animate(clock);
  //
  //   planets.forEach(planet => planet.animate(clock));
  //   renderer.render(scene, camera);
  // };
  // let keysPressed: any = {};
  // function animate() {
  //   f22.keydown(Object.keys(keysPressed));
  //   requestAnimationFrame(animate);
  //   tick();
  // }
  // animate();
  // // renderer.domElement.addEventListener("mousedown", onMouseDown, false);
  // // renderer.domElement.addEventListener("mouseup", onMouseUp, false);
  // // renderer.domElement.addEventListener("mousemove", onMouseMove, false);
  // // renderer.domElement.addEventListener("dblclick", onDblClick, false);
  // document.addEventListener("keydown", (event: KeyboardEvent) => {
  //   keysPressed[event.key] = true;
  // }, false);
  // document.addEventListener("keyup", (event: KeyboardEvent) => {
  //   delete keysPressed[event.key];
  // }, false);
  // function onMouseDown(event: MouseEvent) {
  //   mouse.leftPressed = true;
  // }
  // function onMouseUp(event: MouseEvent) {
  //   mouse.leftPressed = false;
  // }
  // function onMouseMove(event: MouseEvent) {
  //   mouse.position.set(
  //       (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
  //       -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  //   );
  //   if (mouse.leftPressed) {
  //     focusPlanet = undefined;
  //   }
  // }
  // function onDblClick(event: MouseEvent) {
  //   const mouse = new THREE.Vector2();
  //   mouse.set(
  //       (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
  //       -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  //   );
  //   const raycasterClick = new THREE.Raycaster();
  //   raycasterClick.setFromCamera(mouse, camera);
  //   const intersects = raycasterClick.intersectObjects(scene.children, true);
  //   if (intersects.length > 0) {
  //     const intersect = intersects[0];
  //     const planet = planets.find(x => x.group === intersect.object.parent);
  //     if (planet) {
  //       focusPlanet = planet.group;
  //     } else {
  //       focusPlanet = undefined;
  //     }
  //   } else {
  //     focusPlanet = undefined;
  //   }
  // }
});

</script>
