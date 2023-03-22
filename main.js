import * as THREE from 'three'

import { OrbitControls } from 'OrbitControls'
// import { degToRad, radToDeg } from 'three/src/math/MathUtils'

let G = 1

let sunMass = 5

class Astro {
    constructor(name, mass, pos, velo) {
        this.name = name
        this.mesh
        this.velo = velo
        this.mass = mass
        this.pos = pos
        this.sunDist = this.calcSunDist()
        this.f = (G * sunMass * this.mass) / (this.sunDist * this.sunDist)
        this.draw()
    }
    draw() {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.mass, 100, 100),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/' + this.name + '-texture.jpg') })
        )
        scene.add(this.mesh)
        this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    }
    calcSunDist() {
        let dist = (Math.pow(this.pos.x - 0, 2) +
            Math.pow(this.pos.y - 0, 2) +
            Math.pow(this.pos.z - 0, 2)) ** (1 / 2)

        return dist
    }
    update() {
        this.mesh.position.x += this.velo.x
        this.mesh.position.y += this.velo.y
        this.mesh.position.z += this.velo.z

        this.mesh.rotation.x += this.velo.x / 10
        this.mesh.rotation.y += this.velo.y / 10
        this.mesh.rotation.z += this.velo.z / 10
    }
    applyForce() {
        if (this.mesh.position.x > 0) {
            this.velo.x -= this.f / this.mass
        } else {
            this.velo.x += this.f / this.mass
        }
        if (this.mesh.position.y > 0) {
            this.velo.y -= this.f / this.mass
        } else {
            this.velo.y += this.f / this.mass
        }
        if (this.mesh.position.z > 0) {
            this.velo.z -= this.f / this.mass
        } else {
            this.velo.z += this.f / this.mass
        }

    }


}


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
})

renderer.setSize(window.innerWidth, window.innerHeight)
scene.background = new THREE.TextureLoader().load('images/galaxy-texture.jpg')



// let grid = new THREE.GridHelper(200, 20);
// scene.add(grid)

let sun = new Astro("sun", sunMass, cords(0, 0, 0), cords(0, 0, 0))

let planets = []
let planetsNames = [
    "earth",
    "jupter",
    "mars",
    "mercury",
    "neptune",
    "saturn",
    "uranus",
    "venus"
]

for (let i = 0; i < 10; i++) {
    let astro = new Astro(
        planetsNames[Math.floor(Math.random() * planetsNames.length)],
        (Math.random() * 2) + 1,
        random(),
        cords(0, 0, 0)
    )
    planets.push(astro)
}




camera.position.set(0, 0, 150)

function random() {
    let pos = cords(
        (Math.random() * 50) + 10,
        (Math.random() * 50) + 10,
        (Math.random() * 50) + 10
    )
    return pos
}

function cords(x, y, z) {
    let position = {
        x: x,
        y: y,
        z: z
    }

    return position
}

function animate() {
    requestAnimationFrame(animate)

    planets.forEach(astro => {
        astro.update()
        astro.applyForce()
    });

    sun.mesh.rotation.x += 0.01
    sun.mesh.rotation.y += 0.01



    renderer.render(scene, camera)
}

const controls = new OrbitControls(camera, renderer.domElement)
animate()