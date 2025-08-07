class Character3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;
        this.isAnimating = false;
        
        this.waterStage = document.getElementById('water-stage');
        this.container = document.getElementById('character-container');
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Get canvas element
        const canvas = document.getElementById('character-canvas');
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            canvas.clientWidth / canvas.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 1, 3);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add ground plane for shadow receiving
        this.setupGround();
        
        // Add lights
        this.setupLights();
        
        // Load model
        this.loadModel();
        
        // Start render loop
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupGround() {
        // Creating ground plane to receive shadows
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            transparent: true,
            opacity: 0.5
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to lie flat
        ground.position.y = -0.01; // Slightly below character
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    setupLights() {
        // Ambient light (reduced intensity to make shadows more visible)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light with enhanced shadow settings
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        
        // Optimize shadow camera
        directionalLight.shadow.camera.left = -5;
        directionalLight.shadow.camera.right = 5;
        directionalLight.shadow.camera.top = 5;
        directionalLight.shadow.camera.bottom = -5;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 20;
        directionalLight.shadow.mapSize.width = 2048; // Higher resolution for sharper shadows
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.bias = -0.001; // Prevent shadow acne
        
        this.scene.add(directionalLight);
        
        // Optional: Add helper to debug shadow camera
        // const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
        // this.scene.add(helper);
        
        // Point light for character highlighting
        const pointLight = new THREE.PointLight(0xffaa00, 0.5, 10);
        pointLight.position.set(0, 2, 2);
        this.scene.add(pointLight);
    }

    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            './model/puppet_handRaise.glb',
            (gltf) => {
                console.log('Model loaded successfully');
                
                this.model = gltf.scene;
                this.model.scale.set(1, 1, 1);
                this.model.position.set(0, 0, 0);
                
                // Enable shadows for all meshes in the model
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        // Ensure material supports shadows
                        if (child.material) {
                            child.material.needsUpdate = true;
                        }
                    }
                });
                
                this.scene.add(this.model);
                
                // Setup animations if available
                if (gltf.animations && gltf.animations.length > 0) {
                    this.mixer = new THREE.AnimationMixer(this.model);
                    
                    gltf.animations.forEach((clip) => {
                        const action = this.mixer.clipAction(clip);
                        this.animations[clip.name] = action;
                        console.log('Animation loaded:', clip.name);
                    });
                }
                
                // Model is ready
                this.onModelLoaded();
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading model:', error);
                // Fallback: create a simple cube as placeholder
                this.createFallbackModel();
            }
        );
    }

    createFallbackModel() {
        console.log('Creating fallback model');
        const geometry = new THREE.BoxGeometry(0.5, 1, 0.3);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.set(0, 0.5, 0);
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.scene.add(this.model);
        this.onModelLoaded();
    }

    onModelLoaded() {
        console.log('Character model ready');
        // Initial idle pose
        this.resetPose();
    }

    setupEventListeners() {
        // Listen to key events from the game
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Listen to game events
        document.addEventListener('keySuccess', () => this.showSuccessAnimation());
        document.addEventListener('keyFailed', () => this.showFailureAnimation());
        document.addEventListener('sequenceSuccess', () => this.showCompletionAnimation());
    }

    handleKeyPress(event) {
        if (!this.model || this.isAnimating) return;
        
        const key = event.key.toLowerCase();
        if (!['w', 'a', 's', 'd'].includes(key)) return;

        this.performMovement(key);
        this.createWaterRipple();
    }

    performMovement(key) {
        if (!this.model) return;
        
        this.isAnimating = true;
        
        // Reset previous animation
        this.resetPose();
        
        switch(key) {
            case 'w':
                this.jumpAnimation();
                break;
            case 'a':
                this.moveLeftAnimation();
                break;
            case 's':
                this.bowAnimation();
                break;
            case 'd':
                this.moveRightAnimation();
                break;
        }

        // Reset animation after delay
        setTimeout(() => {
            this.resetPose();
            this.isAnimating = false;
        }, 600);
    }

    jumpAnimation() {
        if (this.animations['jump'] || this.animations['handRaise']) {
            // Use GLB animation if available
            const action = this.animations['jump'] || this.animations['handRaise'];
            action.reset().play();
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
        } else {
            // Manual animation
            const jumpTween = {
                y: this.model.position.y,
                rotation: this.model.rotation.z
            };
            
            // Jump up
            const animateUp = () => {
                jumpTween.y += 0.02;
                jumpTween.rotation += 0.02;
                this.model.position.y = jumpTween.y;
                this.model.rotation.z = Math.sin(jumpTween.rotation) * 0.1;
                
                if (jumpTween.y < 0.5) {
                    requestAnimationFrame(animateUp);
                } else {
                    // Jump down
                    const animateDown = () => {
                        jumpTween.y -= 0.02;
                        this.model.position.y = jumpTween.y;
                        
                        if (jumpTween.y > 0) {
                            requestAnimationFrame(animateDown);
                        }
                    };
                    animateDown();
                }
            };
            animateUp();
        }
    }

    moveLeftAnimation() {
        if (this.animations['turnLeft']) {
            const action = this.animations['turnLeft'];
            action.reset().play();
        } else {
            // Manual turn left
            const startRotation = this.model.rotation.y;
            const targetRotation = startRotation - Math.PI / 4;
            
            const animate = () => {
                this.model.rotation.y += (targetRotation - this.model.rotation.y) * 0.1;
                if (Math.abs(this.model.rotation.y - targetRotation) > 0.01) {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }

    moveRightAnimation() {
        if (this.animations['turnRight']) {
            const action = this.animations['turnRight'];
            action.reset().play();
        } else {
            // Manual turn right
            const startRotation = this.model.rotation.y;
            const targetRotation = startRotation + Math.PI / 4;
            
            const animate = () => {
                this.model.rotation.y += (targetRotation - this.model.rotation.y) * 0.1;
                if (Math.abs(this.model.rotation.y - targetRotation) > 0.01) {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }

    bowAnimation() {
        if (this.animations['bow']) {
            const action = this.animations['bow'];
            action.reset().play();
        } else {
            // Manual bow
            const startRotation = this.model.rotation.x;
            const targetRotation = startRotation + Math.PI / 8;
            
            const animate = () => {
                this.model.rotation.x += (targetRotation - this.model.rotation.x) * 0.1;
                if (Math.abs(this.model.rotation.x - targetRotation) > 0.01) {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }

    showSuccessAnimation() {
       
    }

    showFailureAnimation() {
        
    }

    showCompletionAnimation() {
        if (!this.model) return;
        
        // Golden glow + celebration spin
        this.model.traverse((child) => {
            if (child.isMesh && child.material) {
                const originalEmissive = child.material.emissive?.clone();
                child.material.emissive = new THREE.Color(0xffd700);
                
                // Celebration spin
                const originalRotation = this.model.rotation.clone();
                let spinTime = 0;
                const spinAnimation = () => {
                    spinTime += 0.05;
                    this.model.rotation.y = originalRotation.y + spinTime * 2;
                    this.model.position.y = Math.sin(spinTime * 5) * 0.1;
                    
                    if (spinTime < 1.2) {
                        requestAnimationFrame(spinAnimation);
                    } else {
                        this.model.rotation.copy(originalRotation);
                        this.model.position.y = 0;
                        if (originalEmissive) {
                            child.material.emissive = originalEmissive;
                        } else {
                            child.material.emissive = new THREE.Color(0x000000);
                        }
                    }
                };
                spinAnimation();
            }
        });
    }

    createWaterRipple() {
        const ripple = document.createElement('div');
        ripple.className = 'water-ripple';
        
        // Position ripple at character's base
        const rect = this.container.getBoundingClientRect();
        const stageRect = this.waterStage.getBoundingClientRect();
        
        const x = rect.left - stageRect.left + rect.width / 2;
        const y = rect.top - stageRect.top + rect.height - 20;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        this.waterStage.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }

    resetPose() {
        if (!this.model) return;
        
        // Stop all animations
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        // Reset to idle pose
        this.model.position.set(0, 0, 0);
        this.model.rotation.set(0, 0, 0);
        this.model.scale.set(1, 1, 1);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update mixer for animations
        if (this.mixer) {
            this.mixer.update(0.016); // 60fps
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const canvas = document.getElementById('character-canvas');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
}

// Initialize character when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.character3D = new Character3D();
});