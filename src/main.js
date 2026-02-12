import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// --- SETUP ---
gsap.registerPlugin(ScrollTrigger)

const canvas = document.querySelector('#webgl')
const scene = new THREE.Scene()
scene.background = null
scene.fog = new THREE.FogExp2(0x00050a, 0.02)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.toneMapping = THREE.ACESFilmicToneMapping

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const mainLight = new THREE.DirectionalLight(0xffffff, 1)
mainLight.position.set(5, 10, 7)
scene.add(mainLight)

const pointLight = new THREE.PointLight(0x00f0ff, 2, 20)
pointLight.position.set(0, 5, 0)
scene.add(pointLight)

// --- OBJECTS FOR EACH SECTION ---

// 1. HERO - Abstract Rocks / Meteors
const heroGroup = new THREE.Group()
scene.add(heroGroup)
const rockGeo = new THREE.DodecahedronGeometry(1, 0)
const rockMat = new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.8, flatShading: true })

for (let i = 0; i < 8; i++) {
  const rock = new THREE.Mesh(rockGeo, rockMat)
  rock.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 2)
  rock.scale.setScalar(Math.random() * 0.8 + 0.2)
  rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
  heroGroup.add(rock)
}

// 2. ARENA / 3. PANDORA - Connecting Abstract Lines/Grid
const arenaGroup = new THREE.Group()
arenaGroup.position.set(0, -30, 0)
scene.add(arenaGroup)

const gridHelper = new THREE.GridHelper(40, 40, 0xbd00ff, 0x222222)
gridHelper.rotation.x = Math.PI / 2.5
arenaGroup.add(gridHelper)

// 4. FOREST - Spores (Green)
const forestGroup = new THREE.Group()
forestGroup.position.set(0, -60, 0)
scene.add(forestGroup)

const sporeGeo = new THREE.BufferGeometry()
const sporeCount = 1500
const sporePos = new Float32Array(sporeCount * 3)
for (let i = 0; i < sporeCount * 3; i++) sporePos[i] = (Math.random() - 0.5) * 30
sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePos, 3))
const sporeMat = new THREE.PointsMaterial({ size: 0.08, color: 0x00ffaa, transparent: true, blending: THREE.AdditiveBlending })
const spores = new THREE.Points(sporeGeo, sporeMat)
forestGroup.add(spores)

// 5. WATER - Bubbles (Blue)
const waterGroup = new THREE.Group()
waterGroup.position.set(0, -90, 0)
scene.add(waterGroup)

const bubbleGeo = new THREE.SphereGeometry(0.15, 8, 8)
const bubbleMat = new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, transmission: 0.9, roughness: 0, transparent: true })
const bubblesData = []
for (let i = 0; i < 40; i++) {
  const b = new THREE.Mesh(bubbleGeo, bubbleMat)
  b.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10)
  b.scale.setScalar(Math.random() * 1 + 0.5)
  waterGroup.add(b)
  bubblesData.push({ mesh: b, speed: Math.random() * 0.03 + 0.01 })
}

// 6. FIRE - Embers (PANDORA - Blue)
const fireGroup = new THREE.Group()
fireGroup.position.set(0, -120, 0)
scene.add(fireGroup)

const emberGeo = new THREE.BufferGeometry()
const emberCount = 1000
const emberPos = new Float32Array(emberCount * 3)
for (let i = 0; i < emberCount * 3; i++) emberPos[i] = (Math.random() - 0.5) * 25
emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3))
const emberMat = new THREE.PointsMaterial({ size: 0.1, color: 0x00f0ff, blending: THREE.AdditiveBlending })
const embers = new THREE.Points(emberGeo, emberMat)
fireGroup.add(embers)

// 7-12. UNIVERSE
const universeGroup = new THREE.Group()
universeGroup.position.set(0, -200, 0)
scene.add(universeGroup)

const starGeo = new THREE.BufferGeometry()
const starCount = 3000
const starPos = new Float32Array(starCount * 3)
for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 60
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
const starMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6 })
const stars = new THREE.Points(starGeo, starMat)
universeGroup.add(stars)

// --- ANIMATION LOOP ---
const clock = new THREE.Clock()

function animate() {
  const t = clock.getElapsedTime()

  // 1. Hero
  heroGroup.rotation.y = t * 0.05
  heroGroup.children.forEach((r, i) => {
    r.position.y += Math.sin(t + i) * 0.002
    r.rotation.x += 0.002
  })

  // 2. Arena
  gridHelper.position.z = (t * 2) % 5
  gridHelper.rotation.z = Math.sin(t * 0.1) * 0.1

  // 4. Forest
  spores.rotation.y = t * 0.03
  spores.position.y = Math.sin(t * 0.2) * 0.5

  // 5. Water
  bubblesData.forEach(d => {
    d.mesh.position.y += d.speed
    if (d.mesh.position.y > 8) d.mesh.position.y = -8
  })
  waterGroup.rotation.y = Math.sin(t * 0.1) * 0.1

  // 6. Fire
  embers.rotation.x = t * 0.05
  embers.position.y = Math.cos(t * 0.3) * 0.5

  // 7-12 Universe
  stars.rotation.y = -t * 0.02

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

// --- SCROLL ANIMATION ---
let currentSection = 0
// We removed color shifting for a consistent global background
const checkpoints = [
  { id: 'hero', y: 0 },
  { id: 'about', y: -25 },
  { id: 'tracks', y: -45 },
  { id: 'timeline', y: -65 },
  { id: 'faq', y: -90 },
  { id: 'prizepool', y: -115 },
  { id: 'contact', y: -140 },
  { id: 'join', y: -165 }
]

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight
  const progress = scrollY / maxScroll

  // Camera Movement
  const targetY = progress * -165 // Match total depth
  gsap.to(camera.position, {
    y: targetY,
    duration: 1,
    ease: 'power2.out'
  })

  // Determine current section for potential other effects
  // (Logic simplifed as we don't need background colors anymore)
})

// Section Animations (Fog, Text, Nav Dots)
checkpoints.forEach((cp, i) => {
  const nextCp = checkpoints[i + 1]

  // Fog Color Transition - Removed as per instruction

  // Content Fade In
  gsap.fromTo(`#${cp.id} .content-wrapper, #${cp.id} .content`,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: `#${cp.id}`,
        start: "top 70%",
        end: "top 40%",
        toggleActions: "play reverse play reverse",
        scrub: 1
      }
    }
  )

  // Active Dot Spy
  ScrollTrigger.create({
    trigger: `#${cp.id}`,
    start: 'top center',
    end: 'bottom center',
    onToggle: (self) => {
      if (self.isActive) {
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'))
        const activeDot = document.querySelector(`.dot[href="#${cp.id}"]`)
        if (activeDot) activeDot.classList.add('active')
      }
    }
  })
})

// --- TRACKS ART-STYLE ANIMATION ---
const isMobile = window.innerWidth <= 767;
const tracksStart = isMobile ? 'top 20%' : 'top top';

const tracksMaskTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '#tracks',
    start: tracksStart,
    end: 'bottom center',
    scrub: 1.5,
    pin: true,
    anticipatePin: 1
  }
})

tracksMaskTimeline
  .to('.will-fade', {
    opacity: 0,
    stagger: 0.2,
    ease: 'power1.inOut'
  })
  .to('.masked-img-tracks', {
    scale: 1.3,
    webkitMaskSize: '400%',
    maskSize: '400%',
    duration: 1,
    ease: 'power1.inOut'
  })
  .to('#tracks-masked-content', {
    opacity: 1,
    duration: 1,
    ease: 'power1.inOut'
  })

// Timeline Milestone Scroll Animations
const timelineMilestones = document.querySelectorAll('.timeline-milestone')
timelineMilestones.forEach((milestone, index) => {
  gsap.fromTo(milestone,
    {
      opacity: 0,
      y: 50
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: milestone,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play reverse play reverse',
        scrub: 0.5
      }
    }
  )
})

// Mouse Parallax
const cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', (e) => {
  cursor.x = (e.clientX / window.innerWidth - 0.5) * 2
  cursor.y = -(e.clientY / window.innerHeight - 0.5) * 2

  gsap.to(camera.position, {
    x: cursor.x * 2,
    duration: 1
  })

  gsap.to(heroGroup.rotation, { x: cursor.y * 0.1, y: cursor.x * 0.1, duration: 1 })
  gsap.to(arenaGroup.rotation, { x: Math.PI / 2.5 + cursor.y * 0.05, duration: 1 })
})

// Smooth Scroll (Lenis)
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// Navigation Click Handler (Smooth Scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const targetId = this.getAttribute('href')
    lenis.scrollTo(targetId, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  })
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// FAQ Toggle
const faqItems = document.querySelectorAll('.faq-item')

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question')
  question.addEventListener('click', () => {
    // Toggle current item
    const isActive = item.classList.contains('active')

    // Close all other items (accordion behavior)
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active')
        otherItem.querySelector('.faq-answer').style.maxHeight = null
      }
    })

    if (isActive) {
      item.classList.remove('active')
      item.querySelector('.faq-answer').style.maxHeight = null
    } else {
      item.classList.add('active')
      const answer = item.querySelector('.faq-answer')
      answer.style.maxHeight = answer.scrollHeight + "px"
    }
  })
})

// FAQ Access Trigger
const faqTrigger = document.getElementById('faqTrigger')
const faqContent = document.getElementById('faqContent')
const faqTriggerContainer = document.querySelector('.faq-trigger-container')

if (faqTrigger && faqContent) {
  faqTrigger.addEventListener('click', () => {
    faqContent.classList.toggle('visible')
    faqTriggerContainer.classList.toggle('active')
  })
}

// Track Toggle Function (Senior/Junior)
window.switchTrack = function (e, track) {
  e.preventDefault();
  e.stopPropagation();

  const junior = document.getElementById('junior-track');
  const senior = document.getElementById('senior-track');
  const container = document.getElementById('prize-tab-container');
  const buttons = container.querySelectorAll('.tab-btn');

  // 1. Fix Button Highlights - Remove active from all buttons first
  buttons.forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active to the clicked button - use the button that was clicked
  const clickedButton = e.currentTarget || e.target;
  if (clickedButton && clickedButton.classList.contains('tab-btn')) {
    clickedButton.classList.add('active');
  } else {
    // Fallback: find button by track text content
    buttons.forEach(btn => {
      const btnText = btn.textContent.trim().toLowerCase();
      if ((track === 'junior' && btnText.includes('junior')) ||
        (track === 'senior' && btnText.includes('senior'))) {
        btn.classList.add('active');
      }
    });
  }

  // 2. Fix Sliding UI Background & Track Visibility
  if (track === 'junior') {
    container.classList.remove('senior-active');

    // Hide senior, show junior
    senior.classList.remove('active-track');
    junior.classList.add('active-track');

    // Small GSAP pop for the cards
    gsap.fromTo("#junior-track .prize-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }
    );
  } else {
    container.classList.add('senior-active');

    // Hide junior, show senior
    junior.classList.remove('active-track');
    senior.classList.add('active-track');

    gsap.fromTo("#senior-track .prize-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }
    );
  }

  // 3. Recalculate ScrollTrigger positions
  ScrollTrigger.refresh();
};

// --- COUNTDOWN TIMER TO FEBRUARY 14, 2026 ---
function updateCountdown() {
  // Target date: February 14, 2026 at 9:00 AM IST
  const targetDate = new Date('2026-02-14T09:00:00+05:30').getTime();

  function tick() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // Event has started
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      document.querySelector('.countdown-title').textContent = 'EVENT IS LIVE!';
      return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update display with padding
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  // Initial call
  tick();

  // Update every second
  setInterval(tick, 1000);
}

// Start countdown when page loads
updateCountdown();

