<template>
  <div id="app" class="app">
    <!-- Header with playful design -->
    <header class="site-header">
      <div class="container header-inner">
        <h1
          class="logo"
          role="button"
          tabindex="0"
          @click="goHome"
          @keydown.enter="goHome"
          aria-label="Go to home"
        >
          <span class="logo-icon">🎓</span>
          OIKOS · BSW
        </h1>
        <nav class="nav" v-if="$route.path === '/'">
          <a href="#features" class="nav-link">✨ Features</a>
          <a href="#how" class="nav-link">🔧 How it works</a>
          <a href="#contact" class="nav-link">📞 Contact</a>
          <router-link to="/login" class="nav-link">🔐 Log in</router-link>
          <button class="btn btn-primary" @click="openSignup">
            🚀 Get Started
          </button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <!-- Router view for other pages -->
      <router-view />

      <!-- Landing page content - only show on root route -->
      <div v-if="$route.path === '/'" class="landing-content">
        <!-- Animated background shapes matching Login.vue -->
        <div class="floating-shapes">
          <div class="animated-shape shape-1"></div>
          <div class="animated-shape shape-2"></div>
          <div class="animated-shape shape-3"></div>
          <div class="animated-shape shape-4"></div>
          <div class="animated-shape shape-5"></div>
          <div class="shape shape-emoji-1">🌟</div>
          <div class="shape shape-emoji-2">🎈</div>
          <div class="shape shape-emoji-3">🎨</div>
          <div class="shape shape-emoji-4">🦋</div>
          <div class="shape shape-emoji-5">🌈</div>
        </div>

        <!-- Hero Section -->
        <section class="hero">
          <div class="container hero-grid">
            <div class="hero-copy">
              <h2 class="hero-title">
                🌟 Basic sight‑work progressive learning assistance
              </h2>
              <p class="lead">
                Adaptive practice, gentle progression, and clear progress insights — designed to help learners build confidence
                with short, focused sight‑work sessions! 🎯
              </p>

              <ul class="quick-features">
                <li>🎮 Adaptive difficulty that adjusts to each learner</li>
                <li>⚡ Short practice bursts to build automaticity</li>
                <li>🎵 Visual and audio cues for multimodal learning</li>
              </ul>

              <div class="hero-actions">
                <button class="btn btn-primary btn-large" @click="openSignup">
                  🚀 Start free
                </button>
                <a class="btn btn-ghost btn-large" href="#how">
                  🔍 How it works
                </a>
              </div>
            </div>

            <div class="hero-preview" aria-hidden="true">
              <div class="card-preview">
                <div class="card-header">
                  <strong>🎯 Session</strong>
                  <span class="small-muted">⏰ 5 min • Level 1</span>
                </div>
                <div class="card-body">
                  <div class="tile tile-1">see</div>
                  <div class="tile tile-2">run</div>
                  <div class="tile tile-3">jump</div>
                  <div class="tile tile-4">play</div>
                </div>
                <div class="card-footer">
                  <div class="progress">
                    <div class="progress-bar" :style="{ width: '36%' }"></div>
                  </div>
                  <small class="small-muted">✨ 36% complete</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="container features">
          <h3 class="section-title">🎁 What it offers</h3>
          <div class="features-grid">
            <article class="feature feature-1">
              <div class="feature-icon">🧠</div>
              <h4>Adaptive learning</h4>
              <p>Content adjusts automatically to keep practice challenging but achievable.</p>
            </article>

            <article class="feature feature-2">
              <div class="feature-icon">⏰</div>
              <h4>Short focused sessions</h4>
              <p>Designed for attention spans of early learners — 3–7 minute bursts with immediate feedback.</p>
            </article>

            <article class="feature feature-3">
              <div class="feature-icon">📊</div>
              <h4>Progress tracking</h4>
              <p>Clear, actionable metrics for caregivers and teachers to guide next steps.</p>
            </article>

            <article class="feature feature-4">
              <div class="feature-icon">🎵</div>
              <h4>Multimodal cues</h4>
              <p>Combine visual and audio prompts to support different learning styles.</p>
            </article>
          </div>
        </section>

        <!-- How it works Section -->
        <section id="how" class="how container">
          <h3 class="section-title">🔧 How it works</h3>
          <ol class="how-steps">
            <li class="step-item">
              <span class="step-icon">🎯</span>
              <strong>Assess:</strong> Short warm-up to set starting level.
            </li>
            <li class="step-item">
              <span class="step-icon">🎮</span>
              <strong>Practice:</strong> Timed bursts with spaced repetition and immediate feedback.
            </li>
            <li class="step-item">
              <span class="step-icon">📈</span>
              <strong>Review:</strong> Simple progress cards and suggested next sessions.
            </li>
          </ol>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="container contact">
          <div class="contact-card">
            <h3 class="section-title">📞 Get in touch</h3>
            <p class="contact-subtitle">Questions, feedback, or to request a classroom pilot! 🏫</p>
            <form class="contact-form" @submit.prevent="submitContact">
              <input v-model="contact.name" type="text" placeholder="👤 Your name" required class="form-input" />
              <input v-model="contact.email" type="email" placeholder="📧 Email" required class="form-input" />
              <textarea v-model="contact.message" placeholder="💬 Message" rows="3" class="form-textarea"></textarea>
              <div class="form-actions">
                <button class="btn btn-primary" type="submit">📤 Send</button>
                <button class="btn btn-ghost" type="button" @click="clearContact">🗑️ Clear</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer" v-if="$route.path === '/'">
      <div class="container">
        <small>© <span>{{ year }}</span> OIKOS · BSW — Built for learners 💝</small>
      </div>
    </footer>

    <!-- Signup Modal -->
    <transition name="modal-fade">
      <div v-if="signupOpen" class="modal" role="dialog" aria-modal="true" aria-label="Sign up">
        <div class="modal-panel modal-panel-large">
          <button class="modal-close" @click="closeSignup" aria-label="Close">❌</button>
          <div class="signup-modal-inner">
            <!-- Render Signup main card inside modal; Signup supports inModal prop -->
            <Signup :inModal="true" @close="closeSignup" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Signup from './views/auth/Signup.vue'

const year = new Date().getFullYear()
const signupOpen = ref(false)
const signup = ref({ email: '', name: '' })
const contact = ref({ name: '', email: '', message: '' })

function openSignup() {
  signupOpen.value = true
}
function closeSignup() {
  signupOpen.value = false
}

// Router helper for logo click
const router = useRouter()
function goHome() {
  router.push('/')
}
function signupSubmitData(payload) {
  // placeholder: integrate with your backend or auth provider
  console.log('signup', payload)
}
function submitSignup() {
  signupSubmitData({ ...signup.value })
  signupOpen.value = false
  signup.value = { email: '', name: '' }
  alert('Thanks — check your email to continue.')
}

function submitContact() {
  // placeholder: send contact data
  console.log('contact', contact.value)
  clearContact()
  alert('Thanks — we will reply soon.')
}
function clearContact() {
  contact.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
/* Color variables matching Login.vue style */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --success-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  --card-bg: rgba(255, 255, 255, 0.95);
  --shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 30px 60px rgba(0, 0, 0, 0.15);
}

* { box-sizing: border-box; }

.app { 
  /* Same animated gradient background as Login.vue */
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 25%, #6c5ce7 50%, #a29bfe 75%, #fd79a8 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  color: #1a202c; 
  min-height: 100vh; 
  font-family: 'Comic Sans MS', cursive, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* Fix header container alignment */
.site-header { 
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #a8edea 50%, #fed6e3 75%, #ffecd2 100%);
  backdrop-filter: blur(20px);
  border-bottom: 3px solid rgba(255, 255, 255, 0.5);
  position: sticky; 
  top: 0; 
  z-index: 20;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3);
  width: 100%;
}

.header-inner { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  gap: 1rem;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo { 
  font-weight: 900; 
  font-size: 1.8rem;
  letter-spacing: 1px; 
  margin: 0; 
  /* White color with strong shadow for better readability */
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Lighter shadow */
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo[role="button"] {
  cursor: pointer;
}
.logo:focus {
  outline: 3px solid rgba(255, 255, 255, 0.6);
  outline-offset: 4px;
  border-radius: 8px;
}

.logo-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

.nav { 
  display: flex; 
  gap: 1rem; 
  align-items: center;
}

.nav-link { 
  /* White color with shadow for better contrast */
  color: white; 
  text-decoration: none; 
  font-weight: 700;
  font-size: 1rem; /* Slightly smaller */
  padding: 0.5rem 1rem;
  border-radius: 20px; /* Smaller radius */
  transition: all 0.3s ease;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3); /* Lighter shadow */
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}

/* Button styles */
.btn { 
  border: none; 
  padding: 1rem 2rem; 
  border-radius: 25px; 
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary { 
  background: var(--secondary-gradient);
  color: white; 
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px) scale(1.05);
}

.btn-ghost { 
  background: rgba(255, 255, 255, 0.98);
  color: #4338ca; 
  border: 3px solid rgba(67, 56, 202, 0.4);
  font-weight: 800;
}

.btn-ghost:hover {
  background: rgba(67, 56, 202, 0.1);
  transform: translateY(-2px);
}

.btn-large {
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
}

/* Floating shapes animation matching Login.vue */
.floating-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* Animated colored shapes like Login.vue */
.animated-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  animation: bounce 1s infinite;
}

.shape-1 { 
  top: 10%; 
  left: 10%; 
  width: 80px; 
  height: 80px; 
  background: #ffd32a;
  animation-delay: 0s;
}

.shape-2 { 
  top: 32%; 
  right: 20%; 
  width: 64px; 
  height: 64px; 
  background: #74d680;
  animation-delay: 0.2s;
}

.shape-3 { 
  bottom: 20%; 
  left: 25%; 
  width: 96px; 
  height: 96px; 
  background: #fd79a8;
  animation-delay: 0.4s;
}

.shape-4 { 
  top: 60%; 
  right: 15%; 
  width: 72px; 
  height: 72px; 
  background: #a29bfe;
  animation-delay: 0.6s;
}

.shape-5 { 
  bottom: 40%; 
  right: 30%; 
  width: 88px; 
  height: 88px; 
  background: #00cec9;
  animation-delay: 0.8s;
}

/* Emoji shapes */
.shape {
  position: absolute;
  font-size: 2rem;
  animation: float 6s ease-in-out infinite;
}

.shape-emoji-1 { top: 15%; left: 15%; animation-delay: 1s; }
.shape-emoji-2 { top: 25%; right: 10%; animation-delay: 1.5s; }
.shape-emoji-3 { bottom: 35%; left: 15%; animation-delay: 2s; }
.shape-emoji-4 { top: 55%; right: 5%; animation-delay: 2.5s; }
.shape-emoji-5 { bottom: 15%; right: 25%; animation-delay: 3s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Main content */
.main-content {
  position: relative;
  z-index: 2;
  flex: 1;
  width: 100%;
}

.landing-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

/* Hero section */
.hero { 
  padding: 4rem 0;
  width: 100%;
}

.hero-grid { 
  display: grid; 
  grid-template-columns: 1fr 400px; 
  gap: 3rem; 
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title { 
  margin: 0 0 1rem 0; 
  font-size: 2.8rem; /* Slightly smaller */
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); /* Lighter shadow */
  line-height: 1.2;
  background: rgba(0, 0, 0, 0.25); /* Lighter background */
  padding: 1rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.lead { 
  /* White text with strong shadow and background */
  color: white; 
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Lighter shadow */
  margin-bottom: 2rem;
  font-size: 1.1rem; /* Slightly smaller */
  font-weight: 600; /* Reduced from 700 */
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.25); /* Lighter background */
  padding: 1rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.quick-features { 
  list-style: none; 
  padding: 0; 
  margin: 0 0 2rem 0; 
  display: grid; 
  gap: 1rem;
}

.quick-features li {
  color: white;
  font-size: 1rem; /* Slightly smaller */
  font-weight: 600; /* Reduced from 700 */
  padding: 0.8rem; /* Reduced padding */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 12px; /* Smaller radius */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); /* Lighter shadow */
  border: 2px solid rgba(255, 255, 255, 0.4); /* Lighter border */
  backdrop-filter: blur(10px);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3); /* Lighter shadow */
}

.hero-actions { 
  display: flex; 
  gap: 1rem; 
  margin-top: 1rem;
}

.hero-preview { 
  display: flex; 
  justify-content: center;
}

.card-preview { 
  width: 100%; 
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a8edea 100%);
  border-radius: 25px; 
  box-shadow: 0 20px 40px rgba(255, 105, 180, 0.4);
  padding: 2rem; 
  border: 4px solid rgba(255, 255, 255, 0.8);
}

.card-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 800;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.card-body { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 1rem;
  margin-bottom: 1rem;
}

.tile { 
  padding: 1rem; 
  border-radius: 15px; 
  text-align: center; 
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.tile:hover {
  transform: scale(1.05);
}

.tile-1 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
.tile-2 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
.tile-3 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
.tile-4 { background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); }

.progress { 
  height: 12px; 
  background: rgba(102, 126, 234, 0.2);
  border-radius: 999px; 
  overflow: hidden; 
  margin-bottom: 0.5rem;
}

.progress-bar { 
  height: 100%; 
  background: var(--accent-gradient);
  transition: width 400ms ease;
}

/* Features section */
.features { 
  padding: 4rem 0;
  width: 100%;
}

.features .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  justify-items: center;
}

/* Fix section title centering */
.section-title { 
  margin: 0 auto 3rem auto;
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #feca57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  display: block;
  width: fit-content;
  border: 3px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Enhanced feature cards with unique colors */
.feature-1 { 
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  border: 4px solid rgba(255, 107, 157, 0.6);
}

.feature-2 { 
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border: 4px solid rgba(78, 205, 196, 0.6);
}

.feature-3 { 
  background: linear-gradient(135deg, #45b7d1 0%, #96c93d 100%);
  border: 4px solid rgba(69, 183, 209, 0.6);
}

.feature-4 { 
  background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
  border: 4px solid rgba(243, 156, 18, 0.6);
}

/* Enhanced feature card sizing and content */
.feature { 
  border-radius: 25px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-height: 260px; /* Reduced from 280px */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); /* Adjusted shadow */
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

/* Fix step items alignment */
.step-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 1.5rem 0; /* Reduced from 2rem */
  padding: 1.8rem; /* Reduced from 2.5rem */
  border-radius: 20px; /* Reduced from 25px */
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2); /* Lighter shadow */
  font-size: 1.1rem; /* Reduced from 1.3rem */
  font-weight: 600; /* Reduced from 700 */
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3); /* Lighter shadow for clarity */
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Reduced from 2rem */
  border: 3px solid rgba(255, 255, 255, 0.6); /* Thinner border */
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  counter-increment: step-counter;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.step-item::before {
  content: counter(step-counter);
  position: absolute;
  left: -12px; /* Reduced from -15px */
  top: -12px; /* Reduced from -15px */
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  width: 40px; /* Reduced from 50px */
  height: 40px; /* Reduced from 50px */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800; /* Reduced from 900 */
  font-size: 1.2rem; /* Reduced from 1.5rem */
  border: 3px solid white; /* Thinner border */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Lighter shadow */
}

.step-item:hover {
  transform: translateX(10px) scale(1.01); /* Reduced effects */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Lighter shadow */
}

.step-icon {
  font-size: 2.5rem; /* Reduced from 3rem */
  animation: bounce 2s infinite;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2)); /* Lighter shadow */
}

/* Fix contact section sizing */
.contact { 
  padding: 3rem 0; /* Reduced from 4rem */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px; /* Reduced from 30px */
  margin: 1.5rem auto; /* Reduced from 2rem */
  max-width: calc(100% - 3rem); /* Reduced width */
  width: calc(100vw - 3rem);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08); /* Lighter shadow */
}

 .contact .container, .container.contact {
  max-width: 700px; /* Reduced from 1200px */
  margin: 0 auto;
  padding: 0 1.5rem; /* Reduced padding */
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  border-radius: 25px; /* Reduced from 30px */
  padding: 2.5rem; /* Reduced from 3rem */
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3); /* Lighter shadow */
  width: 100%;
  max-width: 500px; /* Reduced from 600px */
  border: 4px solid rgba(255, 255, 255, 0.7); /* Thinner border */
  backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
}

/* Fix contact card shimmer effect */
.contact-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%); /* Lighter effect */
  animation: shimmer 4s ease-in-out infinite; /* Slower animation */
}

/* Fix contact title sizing and clarity */
.contact-card .section-title {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4); /* Lighter shadow for clarity */
  background: none;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  font-size: 2rem; /* Reduced from 2.5rem */
  margin: 0 auto 1rem auto;
  padding: 0;
  width: fit-content;
  position: relative;
  z-index: 2;
  text-align: center;
  line-height: 1.2; /* Improve line spacing */
}

.contact-subtitle {
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  font-weight: 600; /* Reduced from 700 */
  margin-bottom: 1.5rem; /* Reduced from 2rem */
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3); /* Lighter shadow */
  font-size: 1rem; /* Reduced from 1.2rem */
  position: relative;
  z-index: 2;
  line-height: 1.4; /* Improve line spacing */
}

.contact-form { 
  display: grid; 
  gap: 1.2rem; /* Reduced from 1.5rem */
  position: relative;
  z-index: 2;
}

.form-input, .form-textarea {
  border: 2px solid rgba(255, 255, 255, 0.7); /* Thinner border */
  padding: 1rem; /* Reduced from 1.2rem */
  border-radius: 12px; /* Reduced from 15px */
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem; /* Reduced from 1.1rem */
  font-weight: 500; /* Reduced from 600 */
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Lighter shadow */
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2); /* Lighter glow */
  background: white;
  transform: scale(1.01); /* Reduced scale */
}

.form-actions { 
  display: flex; 
  gap: 1rem; 
  margin-top: 0.5rem; /* Reduced margin */
}

.form-actions .btn {
  flex: 1;
  padding: 0.9rem 1.5rem; /* Reduced padding */
  font-size: 1rem; /* Reduced from 1.2rem */
  font-weight: 700; /* Reduced from 800 */
  border-radius: 12px; /* Reduced from 15px */
  transition: all 0.3s ease;
}

.form-actions .btn:hover {
  transform: translateY(-2px) scale(1.02); /* Reduced effects */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* Lighter shadow */
}

/* Fix how section sizing */
.how { 
  padding: 3rem 0; /* Reduced from 4rem */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px; /* Reduced from 30px */
  margin: 1.5rem auto; /* Reduced from 2rem */
  max-width: calc(100% - 3rem); /* Reduced width */
  width: calc(100vw - 3rem);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08); /* Lighter shadow */
}

.how .container {
  max-width: 900px; /* Reduced from 1200px */
  margin: 0 auto;
  padding: 0 1.5rem; /* Reduced padding */
}

.how-steps { 
  list-style: none;
  padding: 0; 
  max-width: 800px; /* Reduced from 900px */
  margin: 0 auto;
  counter-reset: step-counter;
}

/* Fix step items sizing and text clarity */
.step-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 1.5rem 0; /* Reduced from 2rem */
  padding: 1.8rem; /* Reduced from 2.5rem */
  border-radius: 20px; /* Reduced from 25px */
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2); /* Lighter shadow */
  font-size: 1.1rem; /* Reduced from 1.3rem */
  font-weight: 600; /* Reduced from 700 */
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3); /* Lighter shadow for clarity */
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Reduced from 2rem */
  border: 3px solid rgba(255, 255, 255, 0.6); /* Thinner border */
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  counter-increment: step-counter;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.step-item::before {
  content: counter(step-counter);
  position: absolute;
  left: -12px; /* Reduced from -15px */
  top: -12px; /* Reduced from -15px */
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  width: 40px; /* Reduced from 50px */
  height: 40px; /* Reduced from 50px */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800; /* Reduced from 900 */
  font-size: 1.2rem; /* Reduced from 1.5rem */
  border: 3px solid white; /* Thinner border */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Lighter shadow */
}

.step-item:hover {
  transform: translateX(10px) scale(1.01); /* Reduced effects */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Lighter shadow */
}

.step-icon {
  font-size: 2.5rem; /* Reduced from 3rem */
  animation: bounce 2s infinite;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2)); /* Lighter shadow */
}

/* Fix contact section sizing */
.contact { 
  padding: 3rem 0; /* Reduced from 4rem */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px; /* Reduced from 30px */
  margin: 1.5rem auto; /* Reduced from 2rem */
  max-width: calc(100% - 3rem); /* Reduced width */
  width: calc(100vw - 3rem);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08); /* Lighter shadow */
}

.contact .container {
  max-width: 700px; /* Reduced from 1200px */
  margin: 0 auto;
  padding: 0 1.5rem; /* Reduced padding */
  display: flex;
  justify-content: center;
}

.contact-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  border-radius: 25px; /* Reduced from 30px */
  padding: 2.5rem; /* Reduced from 3rem */
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3); /* Lighter shadow */
  width: 100%;
  max-width: 500px; /* Reduced from 600px */
  border: 4px solid rgba(255, 255, 255, 0.7); /* Thinner border */
  backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
}

/* Fix contact card shimmer effect */
.contact-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%); /* Lighter effect */
  animation: shimmer 4s ease-in-out infinite; /* Slower animation */
}

/* Fix contact title sizing and clarity */
.contact-card .section-title {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4); /* Lighter shadow for clarity */
  background: none;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  font-size: 2rem; /* Reduced from 2.5rem */
  margin: 0 auto 1rem auto;
  padding: 0;
  width: fit-content;
  position: relative;
  z-index: 2;
  text-align: center;
  line-height: 1.2; /* Improve line spacing */
}

.contact-subtitle {
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  font-weight: 600; /* Reduced from 700 */
  margin-bottom: 1.5rem; /* Reduced from 2rem */
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3); /* Lighter shadow */
  font-size: 1rem; /* Reduced from 1.2rem */
  position: relative;
  z-index: 2;
  line-height: 1.4; /* Improve line spacing */
}

.contact-form { 
  display: grid; 
  gap: 1.2rem; /* Reduced from 1.5rem */
  position: relative;
  z-index: 2;
}

.form-input, .form-textarea {
  border: 2px solid rgba(255, 255, 255, 0.7); /* Thinner border */
  padding: 1rem; /* Reduced from 1.2rem */
  border-radius: 12px; /* Reduced from 15px */
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem; /* Reduced from 1.1rem */
  font-weight: 500; /* Reduced from 600 */
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Lighter shadow */
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2); /* Lighter glow */
  background: white;
  transform: scale(1.01); /* Reduced scale */
}

.form-actions { 
  display: flex; 
  gap: 1rem; 
  margin-top: 0.5rem; /* Reduced margin */
}

.form-actions .btn {
  flex: 1;
  padding: 0.9rem 1.5rem; /* Reduced padding */
  font-size: 1rem; /* Reduced from 1.2rem */
  font-weight: 700; /* Reduced from 800 */
  border-radius: 12px; /* Reduced from 15px */
  transition: all 0.3s ease;
}

.form-actions .btn:hover {
  transform: translateY(-2px) scale(1.02); /* Reduced effects */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* Lighter shadow */
}

/* Center modal properly */
.modal { 
  position: fixed; 
  inset: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  z-index: 50;
  padding: 1rem;
}

.modal-panel { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  width: 100%; 
  max-width: 720px; /* allow wider modal for embedded signup */
  border-radius: 25px; 
  padding: 0; /* Remove default padding */
  position: relative;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  margin: 1rem;
  overflow: visible; /* allow internal scrolling for modal content */
  max-height: 90vh;
}

/* Inner wrapper for modal content: allow internal scrolling without expanding modal */
.signup-modal-inner {
  width: 100%;
  max-height: calc(90vh - 40px);
  overflow: auto;
  background: transparent;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-close { 
  position: absolute; 
  right: 1rem; 
  top: 1rem; 
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem; 
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-header {
  text-align: center;
  padding: 2rem 2rem 1rem 2rem; /* Top, sides, bottom padding */
  position: relative;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
  display: block;
}

.modal-header h4 {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
}

.modal-form {
  padding: 0 2rem 2rem 2rem; /* No top padding, sides and bottom padding */
  display: grid;
  gap: 1.2rem;
}

/* Modal form inputs - consistent with contact form */
.modal-form .form-input {
  border: 2px solid rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  box-sizing: border-box;
}

.modal-form .form-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
  background: white;
  transform: scale(1.01);
}

.modal-form .form-input::placeholder {
  color: #666;
  font-weight: 500;
}

/* Modal form actions - better spacing */
.modal-form .form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.modal-form .form-actions .btn {
  flex: 1;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-form .form-actions .btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Ensure modal buttons have proper colors */
.modal-form .form-actions .btn-primary {
  background: var(--secondary-gradient);
  color: white;
  border: none;
}

.modal-form .form-actions .btn-ghost {
  background: rgba(255, 255, 255, 0.95);
  color: #4338ca;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.modal-form .form-actions .btn-ghost:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(67, 56, 202, 0.3);
}

/* Responsive modal adjustments */
@media (max-width: 600px) {
  .modal-panel {
    max-width: 95%;
    margin: 0.5rem;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
  
  .modal-header h4 {
    font-size: 1.6rem;
  }
  
  .modal-form {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
  
  .modal-form .form-actions {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .modal-form .form-actions .btn {
    width: 100%;
  }
  
  .modal-close {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

/* Enhanced section spacing */
.features { 
  padding: 4rem 0;
  margin: 2rem 0;
}

.hero { 
  padding: 4rem 0;
}

/* Additional animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.feature-icon:hover {
  animation: pulse 1s infinite;
}

/* Responsive improvements */
@media (max-width: 1200px) {
  .container {
    padding: 0 1.5rem;
  }
  
  .header-inner {
    padding: 1rem 1.5rem;
  }
  
  .hero-grid {
    padding: 0 1.5rem;
  }
  
  .how,
  .contact {
    width: calc(100vw - 3rem);
    margin: 1.5rem auto;
  }
}

@media (max-width: 900px) {
  .container {
    padding: 0 1rem;
  }
  
  .header-inner {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .hero-grid { 
    grid-template-columns: 1fr; 
    text-align: center;
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .hero-preview { 
    order: -1; 
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0;
  }
  
  .feature {
    max-width: 100%;
    min-height: 250px;
    padding: 1.5rem;
  }
  
  .how,
  .contact {
    width: calc(100vw - 2rem);
    margin: 1rem auto;
    padding: 3rem 0;
  }
  
  .how .container,
  .contact .container {
    padding: 0 1rem;
  }
  
  .step-item {
    padding: 2rem;
    font-size: 1.1rem;
    gap: 1.5rem;
    margin: 1.5rem 0;
  }
  
  .contact-card {
    padding: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
    padding: 0.6rem 1rem;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .header-inner {
    padding: 0.5rem;
  }
  
  .hero {
    padding: 2rem 0;
  }
  
  .hero-grid {
    padding: 0 0.5rem;
  }
  
  .features,
  .how,
  .contact {
    padding: 2rem 0;
  }
  
  .how,
  .contact {
    margin: 0.5rem auto;
    border-radius: 20px;
    width: calc(100vw - 1rem);
  }
  
  .how .container,
  .contact .container {
    padding: 0 0.5rem;
  }
  
  .contact-card {
    padding: 1.5rem;
    border-radius: 20px;
  }
  
  .step-item {
    padding: 1.5rem;
    font-size: 1rem;
    gap: 1rem;
    flex-direction: column;
    text-align: center;
  }
  
  .step-item::before {
    position: static;
    margin-bottom: 1rem;
  }
  
  .nav {
    gap: 0.25rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  
  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}

/* Ensure all sections have proper spacing */
.hero + .features {
  margin-top: 0;
}

.features + .how {
  margin-top: 0;
}

.how + .contact {
  margin-top: 0;
}
</style>