// 正确导入所需模块
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

// 处理弹窗逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 延迟确保DOM完全加载
    setTimeout(() => {
        // 获取弹窗和按钮元素
        const rulesModal = document.getElementById('rules-modal');
        const startBtn = document.getElementById('start-btn');
        
        // 检查元素是否存在
        if (!rulesModal) {
            console.error('错误: 未找到ID为"rules-modal"的弹窗元素');
        }
        
        if (!startBtn) {
            console.error('错误: 未找到ID为"start-btn"的按钮元素');
        }
        
        // 绑定点击事件
        if (rulesModal && startBtn) {
            startBtn.addEventListener('click', () => {
                rulesModal.style.display = 'none';
                initGame();
            });
        }
    }, 100);
});

// 游戏初始化函数
function initGame() {
    // 初始化场景核心组件
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 初始化透视相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 设置渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // 灯光设置
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);

    // 控制器和辅助工具 - 现在OrbitControls应该能正确加载
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    const gui = new GUI();
    const loader = new GLTFLoader();

    // 基础材质
    const solidColorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    // 定义所有立方体的位置（按顺序排列）
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

    // 创建所有立方体
    cubePositions.forEach((pos, index) => {
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

    // 创建所有球体
    spherePositions.forEach((pos) => {
        const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 16);
        const sphereMaterials = new THREE.MeshLambertMaterial({ 
            map: textureLoader.load(`tie/37.jpg`)
        });
        
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

    // 创建所有事件牌
    boxPositions.forEach((pos) => {
        const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const boxMaterials = new THREE.MeshLambertMaterial({ 
            map: textureLoader.load(`tie/38.jpg`)
        });
        
        const box = new THREE.Mesh(boxGeometry, boxMaterials);
        box.position.set(pos.x, 0.5, pos.z);
        box.castShadow = true;
        scene.add(box);
        allBoxes.push(box);
    });

    // 添加掷骰子控制
    gui.add({ 掷骰子: () => {
        const dice = Math.floor(Math.random() * 6) + 1;
        console.log('掷出:', dice);
        movePlayer(dice);
    }}, '掷骰子');

    // 创建玩家棋子
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.7, 1.5, 32),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    base.position.y = 0.5; 
    base.castShadow = true;

    const playerTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 16),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    playerTop.position.y = 1.3;   
    playerTop.castShadow = true; 

    const player = new THREE.Group();
    player.add(base);
    player.add(playerTop);
    scene.add(player);

    // 设置玩家初始位置
    const start = cubePositions[0];
    player.position.set(start.x, 0, start.z);
    let currentIndex = 0;

    // 玩家移动函数
    async function movePlayer(steps) {
        currentIndex = (currentIndex + steps) % cubePositions.length;
        const target = cubePositions[currentIndex];

        // 移动到目标格子
        player.position.set(target.x, 0, target.z);

        // 处理传送点逻辑
        const isTopLeft = target.x === -9 && target.z === 9;
        const isBottomRight = target.x === 9 && target.z === -9;

        if (isTopLeft || isBottomRight) {
            const to = isTopLeft
                ? cubePositions.find(p => p.x === 9 && p.z === -9)
                : cubePositions.find(p => p.x === -9 && p.z === 9);

            console.log('💤 传送倒计时...');
            await new Promise(r => setTimeout(r, 800));
            currentIndex = cubePositions.indexOf(to);
            player.position.set(to.x, 0, to.z);
            console.log('🔮 传送完成！');
        }
    }

    // 设置球体颜色选择器
    const colorPresets = {
        不死鸟: '#ff0000',
        贤者: '#00c853',
        捷风: '#29b6f6',
        芮娜: '#7c4dff',
        奇乐: '#ffea00',
        暮蝶: '#ff6090'
    };
    
    const pieceOptions = { 配色: '不死鸟' };
    const topMat = new THREE.MeshStandardMaterial({
        color: colorPresets[pieceOptions.配色],
        metalness: 0.3,
        roughness: 0.4
    });
    playerTop.material = topMat;
    
    gui.add(pieceOptions, '配色', Object.keys(colorPresets))
       .name('球体颜色')
       .onChange((key) => {
           topMat.color.set(colorPresets[key]);
       });

    // 创建索道
    const zhuzi1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 5),
        new THREE.MeshLambertMaterial({ color: '#444945' })
    );
    zhuzi1.position.set(-8, 0.5, 8);
    zhuzi1.castShadow = true;
    scene.add(zhuzi1);

    const zhuzi2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 5),
        new THREE.MeshLambertMaterial({ color: '#444945' })
    );
    zhuzi2.position.set(8, 0.5, -8);
    zhuzi2.castShadow = true;
    scene.add(zhuzi2);

    const shengzi = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 22.7),
        new THREE.MeshLambertMaterial({ color: '#e2d73a' })
    );
    shengzi.rotation.x = -Math.PI / 2;
    shengzi.rotation.z = -Math.PI / 4;
    shengzi.position.set(0, 2.5, 0);
    shengzi.castShadow = true;
    scene.add(shengzi);

    // 创建地面
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshLambertMaterial({ 
            map: textureLoader.load(`tie/39.jpg`) 
        })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // 加载模型1
    let mixer;
    loader.load(
        'models1/scene.gltf',
        (gltf) => {
            console.log('模型1加载成功!');
            const model = gltf.scene;
            model.scale.set(3, 3, 3);
            model.position.set(-2, -2, -2);
            model.rotation.y = -Math.PI / 2;
            model.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                    child.castShadow = true;
                }
            });
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.play();
            });
            scene.add(model);
        },
        undefined,
        (error) => {
            console.error('模型1加载失败:', error);
        }
    );

    // 加载模型2
    let mixer2;
    loader.load(
        'models2/scene.gltf',
        (gltf) => {
            console.log('模型2加载成功!');
            const model = gltf.scene;
            model.scale.set(0.02, 0.02, 0.02);
            model.position.set(-3, -2, 7);
            model.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                    child.castShadow = true;
                }
            });
            mixer2 = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                const action = mixer2.clipAction(clip);
                action.play();
            });
            scene.add(model);
        },
        undefined,
        (error) => {
            console.error('模型2加载失败:', error);
        }
    );

    // 设置相机位置
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);

    // 处理窗口大小变化
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 处理鼠标移动事件
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 动画循环
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        // 旋转所有事件牌
        allBoxes.forEach(box => {
            box.rotation.x += 0.01;
            box.rotation.y += 0.01;
        });
        
        // 更新动画混合器
        if (mixer) mixer.update(delta);
        if (mixer2) mixer2.update(delta);
        
        controls.update();
        renderer.render(scene, camera);
    }

    // 启动动画循环
    animate();
}
    