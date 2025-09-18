// 新增：处理弹窗逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 获取弹窗和按钮元素
    const rulesModal = document.getElementById('rules-modal');
    const startBtn = document.getElementById('start-btn');
    
    // 给开始按钮添加点击事件
    startBtn.addEventListener('click', () => {
        // 隐藏规则弹窗
        rulesModal.style.display = 'none';
        
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
        document.getElementById('rules-modal').style.display = 'none';
        initGame();   // 你的游戏初始化函数
});

function initGame() {
    // 这里写 Three.js 初始化、模型加载、animate() 启动
}
    });
});
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';

// 初始化场景核心组件
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//初始化透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置渲染器
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 灯光设置
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048,2048);
directionalLight.shadow.camera.near = 0.5; // 阴影相机近裁面
directionalLight.shadow.camera.far = 50; // 阴影相机远裁面（覆盖场景内所有物体）
directionalLight.shadow.camera.left = -30; // 阴影相机左边界
directionalLight.shadow.camera.right = 30; // 右边界
directionalLight.shadow.camera.top = 30; // 上边界
directionalLight.shadow.camera.bottom = -30; // 下边界
scene.add(directionalLight);

// 控制器和辅助工具
const controls = new OrbitControls(camera, renderer.domElement);
const gui = new GUI();
const loader = new GLTFLoader();

// 基础材质
const solidColorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

// 定义所有立方体的位置（按原顺序排列）
const cubePositions = [
    // 第一行 (z=9)
    { x: 9, z: 9 }, { x: 7, z: 9 }, { x: 5, z: 9 }, { x: 3, z: 9 }, { x: 1, z: 9 },
    { x: -1, z: 9 }, { x: -3, z: 9 }, { x: -5, z: 9 }, { x: -7, z: 9 }, { x: -9, z: 9 },
    
    // 第二列 (x=-9)
    { x: -9, z: 7 }, { x: -9, z: 5 }, { x: -9, z: 3 }, { x: -9, z: 1 }, { x: -9, z: -1 },
    { x: -9, z: -3 }, { x: -9, z: -5 }, { x: -9, z: -7 }, { x: -9, z: -9 },
    
    // 第三行 (z=-9)
    { x: -7, z: -9 }, { x: -5, z: -9 }, { x: -3, z: -9 }, { x: -1, z: -9 }, { x: 1, z: -9 },
    { x: 3, z: -9 }, { x: 5, z: -9 }, { x: 7, z: -9 }, { x: 9, z: -9 },
    
    // 第四列 (x=9)
    { x: 9, z: -7 }, { x: 9, z: -5 }, { x: 9, z: -3 }, { x: 9, z: -1 }, { x: 9, z: 1 },
    { x: 9, z: 3 }, { x: 9, z: 5 }, { x: 9, z: 7 }
];

// 使用循环创建所有立方体
cubePositions.forEach((pos, index) => {
    // 每个立方体共享相同的几何体
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // 创建材质数组（只有顶面使用纹理）
    const materials = [
        solidColorMaterial, 
        solidColorMaterial, 
        new THREE.MeshLambertMaterial({ 
            map: textureLoader.load(`tie/${index + 1}.jpg`)
        }),
        solidColorMaterial, 
        solidColorMaterial, 
        solidColorMaterial
    ];
    
    // 创建网格并设置属性
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(pos.x, -1, pos.z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
});

// 定义所有球体的位置
const spherePositions = [
    // 第一行 (z=9)
    { x: 7, z: 9 }, { x: 5, z: 9 }, { x: 3, z: 9 }, { x: 1, z: 9 },
    { x: -1, z: 9 }, { x: -3, z: 9 },  { x: -7, z: 9 }, { x: -9, z: 9 },
    
    // 第二列 (x=-9)
    { x: -9, z: 7 }, { x: -9, z: 5 },  { x: -9, z: 1 }, { x: -9, z: -1 },
     { x: -9, z: -5 }, { x: -9, z: -7 }, 
    
    // 第三行 (z=-9)
    { x: -7, z: -9 }, { x: -5, z: -9 }, { x: -3, z: -9 }, { x: -1, z: -9 }, { x: 1, z: -9 },
     { x: 5, z: -9 }, { x: 7, z: -9 }, { x: 9, z: -9 },
    
    // 第四列 (x=9)
    { x: 9, z: -7 }, { x: 9, z: -5 },  { x: 9, z: -1 }, { x: 9, z: 1 },
     { x: 9, z: 5 }, { x: 9, z: 7 }
];

// 使用循环创建所有球体
spherePositions.forEach((pos, index) => {
    // 每个球体共享相同的几何体
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 16);
    
    // 创建材质数组
    const sphereMaterials = 
        new THREE.MeshLambertMaterial({ 
                map: textureLoader.load(`tie/37.jpg`)});
    
    // 创建网格并设置属性
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterials);
    sphere.position.set(pos.x, 0.5, pos.z);
    sphere.castShadow = true;
    scene.add(sphere);
});

// 定义所有事件牌的位置
const allBoxes = []; 
const boxPositions = [
    // 第一行 (z=9)
    { x: -5, z: 9 },
    
    // 第二列 (x=-9)
    { x: -9, z: 3 }, { x: -9, z: -3 },  { x: -9, z: -9 },
    
    // 第三行 (z=-9)
    { x: 3, z: -9 }, 
    
    // 第四列 (x=9)
    { x: 9, z: -3 }, { x: 9, z: 3 }
];

// 使用循环创建所有事件牌
boxPositions.forEach((pos, index) => {
    // 每个事件牌共享相同的几何体
    const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    
    // 创建材质数组
    const boxMaterials = 
        new THREE.MeshLambertMaterial({ 
            map: textureLoader.load(`tie/38.jpg`)
        });
    
    // 创建网格并设置属性
    boxPositions.forEach((pos, index) => { 
        const box = new THREE.Mesh(boxGeometry, boxMaterials);
        box.position.set(pos.x, 0.5, pos.z);
        box.castShadow = true;
        scene.add(box);
        allBoxes.push(box);
    })
});

gui.add({ 掷骰子: () => {
    const dice = Math.floor(Math.random() * 6) + 1;
    console.log('掷出:', dice);
    movePlayer(dice);
}}, '掷骰子');

//棋子
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.7, 1.5, 32),
  new THREE.MeshLambertMaterial({ color: 0x333333 })
);
base.position.y = 0.5; 
base.castShadow = true;

const top = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 32, 16),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
top.position.y = 1.3;   
top.castShadow = true; 

const player = new THREE.Group();
player.add(base);
player.add(top);
scene.add(player);

const start = cubePositions[0];
player.position.set(start.x, 0, start.z);


let currentIndex = 0; // 玩家在 cubePositions 中的索引

// 把 movePlayer 改成异步函数
async function movePlayer(steps) {
  currentIndex = (currentIndex + steps) % cubePositions.length;
  const target = cubePositions[currentIndex];

  // 正常走到目标格子
  player.position.set(target.x, 0, target.z);

  // 如果落在传送点，先停留 800 ms 再瞬移
  const isTopLeft  = target.x === -9 && target.z === 9;
  const isBottomRight = target.x ===  9 && target.z === -9;

  if (isTopLeft || isBottomRight) {
    const to = isTopLeft
        ? cubePositions.find(p => p.x === 9  && p.z === -9)  // 传去右下角
        : cubePositions.find(p => p.x === -9 && p.z === 9);   // 传回左上角

    console.log('💤 传送倒计时...');
    await new Promise(r => setTimeout(r, 800)); // 停留 0.8 秒

    currentIndex = cubePositions.indexOf(to);
    player.position.set(to.x, 0, to.z);
    console.log('🔮 传送完成！');
  }
}

// 1. 预置表
const colorPresets = {
  不死鸟: '#ff0000',
  贤者: '#00c853',
  捷风: '#29b6f6',
  芮娜: '#7c4dff',
  奇乐: '#ffea00',
  暮蝶: '#ff6090'
};
// 2. 初始键名
const pieceOptions = { 配色: '不死鸟' };
// 3. 球体材质（保存为全局变量，方便后面引用）
const topMat = new THREE.MeshStandardMaterial({
  color: colorPresets[pieceOptions.配色],
  metalness: 0.3,
  roughness: 0.4
});
top.material = topMat;   // 你的球体网格叫 top
// 4. 下拉列表（只能选预置颜色）
gui.add(pieceOptions, '配色', Object.keys(colorPresets))
   .name('球体颜色')
   .onChange((key) => {
      // 关键：直接改材质的颜色对象
      topMat.color.set(colorPresets[key]);
   });

//索道
const zhuzi1Geometry = new THREE.CylinderGeometry(0.05, 0.05, 5);
const zhuzi1Material = new THREE.MeshLambertMaterial({ color:'#444945'});
const zhuzi1 = new THREE.Mesh(zhuzi1Geometry,zhuzi1Material);
zhuzi1.position.set(-8, 0.5, 8);
zhuzi1.castShadow = true;
scene.add(zhuzi1);
const zhuzi2Geometry = new THREE.CylinderGeometry(0.05, 0.05, 5);
const zhuzi2Material = new THREE.MeshLambertMaterial({ color:'#444945'});
const zhuzi2 = new THREE.Mesh(zhuzi2Geometry,zhuzi2Material);
zhuzi2.position.set(8, 0.5, -8);
zhuzi2.castShadow = true;
scene.add(zhuzi2);
const shengziGeometry = new THREE.CylinderGeometry(0.01, 0.01, 22.7);
const shengziMaterial = new THREE.MeshLambertMaterial({ color:'#e2d73a'});
const shengzi = new THREE.Mesh(shengziGeometry,shengziMaterial);
shengzi.rotation.x = -Math.PI / 2;
shengzi.rotation.z = -Math.PI / 4;
shengzi.position.set(0, 2.5, 0);
shengzi.castShadow = true;
scene.add(shengzi);


// 地面平面
const planeGeometry = new THREE.PlaneGeometry(40, 40);
const planeMaterial = new THREE.MeshLambertMaterial({ map: textureLoader.load(`tie/39.jpg`) });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);

// 模型加载
let mixer;
loader.load(
    'models1/scene.gltf',
    (gltf) => {
        console.log('模型加载成功!');
        const models1 = gltf.scene;
        models1.scale.set(3, 3, 3);
        models1.position.set(-2, -2, -2);
        models1.rotation.y = -Math.PI / 2;
        models1.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        mixer = new AnimationMixer(models1);
        gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
        });
        scene.add(gltf.scene);
    },
    undefined,
    (error) => {
        console.error('模型加载失败:', error);
    }
);

let mixer2;
loader.load(
    'models2/scene.gltf',
    (gltf) => {
        console.log('模型加载成功!');
        const models2 = gltf.scene;
        models2.scale.set(0.02, 0.02, 0.02);
        models2.position.set(-3, -2, 7);
        models2.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        mixer2 = new AnimationMixer(models2);
        gltf.animations.forEach((clip) => {
            const action = mixer2.clipAction(clip);
            action.play();
        });
        scene.add(gltf.scene);
    },
    undefined,
    (error) => {
        console.error('模型加载失败:', error);
    }
);

// 相机位置
camera.position.z = 5;

// 标准化鼠标坐标
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 动画循环
let currentIntersect = null;
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

   // 遍历所有 box 并旋转
   allBoxes.forEach(box => {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
  });
    
    // 更新动画混合器
    if (mixer) mixer.update(delta);
    
    controls.update();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    currentIntersect = intersects[0] || null;
    renderer.render(scene, camera);
}

animate();
