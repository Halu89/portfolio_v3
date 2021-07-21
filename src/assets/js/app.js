import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  TextureLoader,
  PlaneGeometry,
  ShadowMaterial,
  PCFSoftShadowMap,
  Color,
  Vector2,
  AmbientLight,
  SpotLight,
} from 'three';
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import SpinControls from './SpinControls';
import styledNav from "./styledNav"
class ColorGUIHelper {
  constructor(object, prop) {
    (this.object = object), (this.prop = prop);
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

let scene, renderer, camera, control;
let cube;
let interacting = false;
let direction = 1;
const canvas = document.querySelector('#c');

init();
render();

function init() {
  // window.addEventListener('resize', onWindowResize); // FIXME cube vertical oscillation speeds up on window resize.


  //Transparent canvas
  renderer = new WebGLRenderer({ canvas, alpha: true });
  renderer.shadowMap.enabled = true;
  // Add Anti-aliasing to the shadow
  renderer.shadowMap.type = PCFSoftShadowMap;

  // Renderer
  renderer.setSize(600, 400); //TODO : Dynamically adjust

  // Camera
  {
    const fov = 45;
    const aspect = getAspect(canvas);
    const near = 0.1;
    const far = 30;
    camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(3, 5, 12);
    camera.lookAt(0, 0, 0);
  }

  // Scene
  scene = new Scene();

  // Lights
  // Ambient light to approximate refraction
  scene.add(new AmbientLight(0xffffff, 0.8));

  // Spotlight casting a shadow
  const color = 0xffffff;
  const intensity = 0.6;
  const light = new SpotLight(color, intensity);
  light.position.y = 12;
  light.castShadow = true;
  light.shadow.camera.far = 100;
  // Augment shadow resolution
  light.shadow.mapSize = new Vector2(1024, 1024);
  scene.add(light);

  // Objects
  // (Material + Geometry) -> Mesh => Add to scene

  // Floor
  {
    const planeSize = 20;
    const planeGeo = new PlaneGeometry(planeSize, planeSize);
    const planeMat = new ShadowMaterial({ opacity: 0.2 }); // Only receive shadows
    const planeMesh = new Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI * -0.5; // Set the plane parallel to the ground
    planeMesh.position.y -= 4;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);
  }

  // Cube
  {
    // Not using CubeTextureLoader because of weird texture stretching
    const loader = new TextureLoader();
    loader.setPath('/assets/images/cubefaces/');

    // Load the 6 cube faces and put them in an array
    const materials = [
      'html.png',
      'js.png',
      'mongo.png',
      'node.png',
      'react.png',
      'sass.png',
    ].map(img => new MeshPhongMaterial({ map: loader.load(img) }));

    const cubeLength = 3;
    const cubeGeo = new BoxGeometry(cubeLength, cubeLength, cubeLength);
    cube = new Mesh(cubeGeo, materials);
    cube.castShadow = true;
    scene.add(cube);
  }

  //Controls
  {
    control = new SpinControls(cube, 3, camera, canvas);
    // FIXME Breaks when damping enabled
    control.enableDamping = false;

    // control.setMode('rotate');
    // // Hide controls
    // control.showX = false;
    // control.showY = false;
    // control.showZ = false;

    // Stop rotation if interacting grabbing the cube
    control.addEventListener('start', () => {
      console.log('interacting');
      interacting = true;
    });
    control.addEventListener('end', () => {
      console.log('stop interacting');
      interacting = false;
    });

    // control.attach(cube);
    // scene.add(control);
  }

  // Debug

  // Visualize light
  // const cameraHelper = new CameraHelper(light.shadow.camera);
  // scene.add(cameraHelper);

  // const gui = new dat.GUI();
  // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
  // gui.add(light, 'intensity', 0, 2, 0.01);

  requestAnimationFrame(render);
}

function onWindowResize() {
  camera.aspect = getAspect(canvas);
  camera.updateProjectionMatrix();
  render();
}

function getAspect(domElement) {
  const { height, width } = window.getComputedStyle(domElement);

  // Remove the unit
  const re = new RegExp(/\d+\.?\d+/);
  const h = Number(height.match(re));
  const w = Number(width.match(re));

  return w / h;
}

// Animate
function render(time) {
  time *= 0.0005; // convert time to seconds
  control.update();
  let speed = 0.005;
  if (!interacting) {
    const k = 5;
    const interval = 3;

    if (Math.floor(k * time) % (k * interval) === 0) {
      // Accelerate rotation for interval/k seconds every interval seconds.
      speed *= 15;
    }
    cube.rotation.x += speed;
    cube.rotation.y += 2 * speed;

    // Oscillate with -2 < y < 2;
    if (cube.position.y > 2) {
      direction = -1;
    }
    if (cube.position.y < -2) {
      direction = 1;
    }
    cube.position.y +=
      direction * 0.01 * (1 + Math.abs(Math.abs(cube.position.y) - 2));
  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
