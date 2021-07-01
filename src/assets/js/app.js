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

  // Light
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.AmbientLight(color, intensity);

  scene.add(light);

  // Floor
  // Texture
  const loader = new TextureLoader();
  const planeSize = 20;

  const texture = loader.load('/resources/images/checker.png');
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.magFilter = NearestFilter;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);

  // Mesh
  const floorColor = document.querySelector("#hero").style
  
  console.log(floorColor);
  const planeGeo = new PlaneGeometry(planeSize, planeSize);
  const planeMat = new MeshBasicMaterial({ color: 0x555555 });
  const mesh = new Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -0.5;
  mesh.position.y -= 4;
  scene.add(mesh);

  // Debug
  const gui = new dat.GUI();
  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
  gui.add(light, 'intensity', 0, 2, 0.01);

  // Objects

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
