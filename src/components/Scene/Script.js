import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { gsap } from "gsap";

//Global variables
let currentRef = null;
const loadingManager = new THREE.LoadingManager(() => {
  castShadows();
});
const gltfLoader = new GLTFLoader(loadingManager);
const gui = new dat.GUI({ width: 600 });
const timeline = new gsap.timeline({
  defaults: {
    duration: 1,
  },
});

//Cast and recieve shadows
const castShadows = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.envMapIntensity = 0.38;
    }
  });
};

//Drones parts
const droneParts = {
  motor: new THREE.Group(),
  helices: new THREE.Group(),
  base: new THREE.Group(),
  camara: new THREE.Group(),
};

//Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color("#393939");
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(-7, 5, 12);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setPixelRatio(2);

//Plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.ShadowMaterial({
    opacity: 0.3,
  })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.75;
scene.add(plane);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//Loader

//Animate the scene
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  const movement = Math.sin(elapsedTime);
  droneParts.base.position.y = movement * 0.05;
  droneParts.motor.position.y = movement * 0.05;
  droneParts.helices.position.y = movement * 0.05;
  droneParts.camara.position.y = movement * 0.05;

  try {
    for (let i = 0; i < droneParts.helices.children.length; i++) {
      droneParts.helices.children[i].rotation.y = elapsedTime;
    }
  } catch (error) {}

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//cube
const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
//scene.add(cube);

//Lights
const light1 = new THREE.DirectionalLight("#fcfcfc", 8);
light1.position.set(0, 6, 1);
light1.castShadow = true;
light1.shadow.mapSize.set(2048, 2048);
light1.shadow.bias = -0.000131;
scene.add(light1);

const al = new THREE.AmbientLight("#208080", 0.61);
scene.add(al);

const envMap = new THREE.CubeTextureLoader().load([
  "./envmap/px.png",
  "./envmap/nx.png",
  "./envmap/py.png",
  "./envmap/ny.png",
  "./envmap/pz.png",
  "./envmap/nz.png",
]);
scene.environment = envMap;

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  gui.destroy();
  scene.dispose();
  currentRef.removeChild(renderer.domElement);
};

//Load Groups
export const loadGroups = () => {
  scene.add(droneParts.motor);
  scene.add(droneParts.camara);
  scene.add(droneParts.helices);
  scene.add(droneParts.base);
};

//Load Models
export const loadModels = (rute, group) => {
  gltfLoader.load(rute, (gltf) => {
    while (gltf.scene.children.length) {
      droneParts[group].add(gltf.scene.children[0]);
    }
  });
};

//Remove Models
export const removeModels = (rute, group) => {
  //Get reference
  const oldModels = new THREE.Group();
  while (droneParts[group].children.length) {
    oldModels.add(droneParts[group].children[0]);
  }

  //Remove child
  while (droneParts[group].children.length) {
    droneParts[group].remove(droneParts[group].children[0]);
  }

  //Dispose models
  oldModels.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.dispose();
      child.geometry.dispose();
    }
  });

  loadModels(rute, group);
};

//Debugger
const cubeForDebbuging = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.1, 0.1),
  new THREE.MeshBasicMaterial({ color: "red" })
);
//scene.add(cubeForDebbuging);
//Target
gui
  .add(cubeForDebbuging.position, "x")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("target x")
  .onChange(() => {
    orbitControls.target.x = cubeForDebbuging.position.x;
  });
gui
  .add(cubeForDebbuging.position, "y")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("target y")
  .onChange(() => {
    orbitControls.target.y = cubeForDebbuging.position.y;
  });
gui
  .add(cubeForDebbuging.position, "z")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("target z")
  .onChange(() => {
    orbitControls.target.z = cubeForDebbuging.position.z;
  });
gui.add(camera.position, "x").min(-10).max(10).step(0.0001).name("cam x");

gui.add(camera.position, "y").min(-10).max(10).step(0.0001).name("cam y");

gui.add(camera.position, "z").min(-10).max(10).step(0.0001).name("cam z");

export const gsapAnimation = (targetPost, camPos, zoom) => {
  timeline
    .to(orbitControls.target, {
      x: targetPost.x,
      y: targetPost.y,
      z: targetPost.z,
    })
    .to(
      camera.position,
      {
        x: camPos.x,
        y: camPos.y,
        z: camPos.z,
      },
      "-=1.0"
    )
    .to(
      camera,
      {
        zoom: zoom,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      },
      "-=1.0"
    );
};
//Reset animation

export const resetAnimation = () => {
  gsapAnimation({ x: 0, y: 0, z: 0 }, { x: -7, y: 5, z: 12 }, 1);
};
