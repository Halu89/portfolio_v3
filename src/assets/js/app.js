import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  SphereGeometry,
  DirectionalLight,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  PlaneGeometry,
  DoubleSide,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import * as dat from 'dat.gui';

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

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new WebGLRenderer({ canvas });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const bgColor = window.getComputedStyle(
    document.querySelector('#hero')
  ).backgroundColor;

  // Renderer
  renderer.setSize(600, 400);

  // Camera
  const fov = 45;
  const aspect = 600 / 400; // the canvas default
  const near = 0.1;
  const far = 30;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 12);
  //Controls
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  // Scene
  const scene = new Scene();
  scene.background = new THREE.Color(bgColor);

  // Light
  // Ambient light to approximate refraction
  scene.add(new THREE.AmbientLight(0x888888));

  const color = 0xffffff;
  const intensity = .6;
  const light = new THREE.SpotLight(color, intensity);
  light.position.y = 12;
  light.castShadow = true;
  light.shadow.camera.far = 100;
  // Augment shadow resolution
  light.shadow.mapSize = new THREE.Vector2(1024, 1024);
  scene.add(light);

  // Visualize shadow
  const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);

  // Objects
  // (Texture + Geometry) -> Material => Add to scene

  // Floor
  // Texture
  const loader = new TextureLoader();
  const planeSize = 20;

  // const texture = loader.load('/resources/images/checker.png');
  // texture.wrapS = RepeatWrapping;
  // texture.wrapT = RepeatWrapping;
  // texture.magFilter = NearestFilter;
  // const repeats = planeSize / 2;
  // texture.repeat.set(repeats, repeats);

  const planeGeo = new PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshLambertMaterial({
    color: new THREE.Color(bgColor),
  });
  const planeMesh = new Mesh(planeGeo, planeMat);
  planeMesh.rotation.x = Math.PI * -0.5; // Set the plane parallel to the ground
  planeMesh.position.y -= 4;
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);

  // Debug
  const gui = new dat.GUI();
  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
  gui.add(light, 'intensity', 0, 2, 0.01);

  loader.setPath('/assets/images/cubefaces/');

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
  const cube = new Mesh(cubeGeo, materials);
  cube.castShadow = true;
  scene.add(cube);

  // Animate
  function render(time) {
    time *= 0.0005; // convert time to seconds

    cube.rotation.x = time;
    cube.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
