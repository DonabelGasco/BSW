<template>
  <div id="app" class="app">
    <!-- Header with playful design -->
    <header class="site-header">
      <div class="container header-inner">
        <router-link to="/login" class="logo-button">
          <span class="logo-icon">🎓</span>
          OIKOS · BSW
        </router-link>
        <nav class="nav" v-if="$route.path === '/'">
          <a href="#features" class="nav-link">✨ Features</a>
          <a href="#how" class="nav-link">🔧 How it works</a>
          <a href="#contact" class="nav-link">📞 Contact</a>
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
            
            <!-- Success Message -->
            <div v-if="contactSuccess" class="contact-message contact-success">
              ✅ Message sent successfully! We'll get back to you soon.
            </div>
            
            <!-- Error Message -->
            <div v-if="contactError" class="contact-message contact-error">
              ❌ {{ contactError }}
            </div>
            
            <form class="contact-form" @submit.prevent="submitContact">
              <input 
                v-model="contact.name" 
                type="text" 
                placeholder="👤 Your name" 
                required 
                class="form-input"
                :disabled="contactLoading"
              />
              <input 
                v-model="contact.email" 
                type="email" 
                placeholder="📧 Email" 
                required 
                class="form-input"
                :disabled="contactLoading"
              />
              <textarea 
                v-model="contact.message" 
                placeholder="💬 Message" 
                rows="4" 
                required
                class="form-textarea"
                :disabled="contactLoading"
              ></textarea>
              <div class="form-actions">
                <button 
                  class="btn btn-primary" 
                  type="submit"
                  :disabled="contactLoading"
                  :class="{ 'btn-loading': contactLoading }"
                >
                  {{ contactLoading ? '' : '📤 Send' }}
                </button>
                <button 
                  class="btn btn-ghost" 
                  type="button" 
                  @click="clearContact"
                  :disabled="contactLoading"
                >
                  🗑️ Clear
                </button>
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
    <div v-if="signupOpen" class="modal" role="dialog" aria-modal="true" aria-label="Sign up">
      <div class="modal-panel">
        <button class="modal-close" @click="closeSignup" aria-label="Close">❌</button>
        <div class="modal-header">
          <div class="modal-icon">🎉</div>
          <h4>Create a free account</h4>
          <p class="modal-subtitle">Start a demo session in seconds! ⚡</p>
        </div>
        <form @submit.prevent="submitSignup" class="modal-form">
          <input v-model="signup.email" type="email" placeholder="📧 Email" required class="form-input" />
          <input v-model="signup.name" type="text" placeholder="👤 Name" class="form-input" />
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">🚀 Create account</button>
            <button class="btn btn-ghost" type="button" @click="closeSignup">❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const year = new Date().getFullYear()
const signupOpen = ref(false)
const signup = ref({ email: '', name: '' })
const contact = ref({ name: '', email: '', message: '' })
const contactLoading = ref(false)
const contactSuccess = ref(false)
const contactError = ref('')

function openSignup() {
  signupOpen.value = true
}
function closeSignup() {
  signupOpen.value = false
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

async function submitContact() {
  // Validate form
  if (!contact.value.name.trim()) {
    contactError.value = 'Please enter your name'
    return
  }
  if (!contact.value.email.trim()) {
    contactError.value = 'Please enter your email'
    return
  }
  if (!contact.value.message.trim()) {
    contactError.value = 'Please enter a message'
    return
  }

  contactLoading.value = true
  contactError.value = ''
  
  try {
    // Simulate API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Log contact data (replace with actual API call)
    console.log('Contact form submitted:', contact.value)
    
    contactSuccess.value = true
    clearContact()
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      contactSuccess.value = false
    }, 3000)
    
  } catch (error) {
    contactError.value = 'Failed to send message. Please try again.'
  } finally {
    contactLoading.value = false
  }
}

function clearContact() {
  contact.value = { name: '', email: '', message: '' }
  contactError.value = ''
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
  color: #1a202c; /* Dark gray for better readability */
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

/* New logo button styles */
.logo-button {
  font-weight: 900; 
  font-size: 1.8rem;
  letter-spacing: 1px; 
  margin: 0; 
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border: 2px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.logo-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
  border-color: rgba(255, 255, 255, 0.6);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

.logo-button:active {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
  font-size: 2.8rem;
  font-weight: 900;
  color: #1a202c; /* Dark gray for better contrast */
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8); /* White shadow for better visibility */
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.9); /* More opaque white background */
  padding: 1rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.lead { 
  color: #2d3748; /* Darker gray for better contrast */ 
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8); /* White shadow for visibility */
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.9); /* More opaque white background */
  padding: 1rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.quick-features { 
  list-style: none; 
  padding: 0; 
  margin: 0 0 2rem 0; 
  display: grid; 
  gap: 1rem;
}

.quick-features li {
  color: #2d3748; /* Dark gray for better contrast */
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.95); /* Almost opaque white background */
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8); /* Stronger white border */
  backdrop-filter: blur(10px);
  text-shadow: none; /* Remove text shadow for better clarity */
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
  color: #2d3748; /* Dark gray for better contrast */
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8); /* White shadow for visibility */
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
  color: #1a202c; /* Dark gray for better readability */
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9); /* Strong white shadow */
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  display: block;
  width: fit-content;
  background: rgba(255, 255, 255, 0.95); /* Almost opaque white background */
  border: 3px solid rgba(255, 255, 255, 0.8);
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
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  color: #1a202c; /* Dark gray for better contrast */
  background: rgba(255, 255, 255, 0.95); /* Almost opaque white background */
}

.feature h4 {
  color: #1a202c; /* Dark gray for better contrast */
  font-weight: 800;
  margin: 1rem 0;
}

.feature p {
  color: #2d3748; /* Slightly lighter gray for body text */
  font-weight: 600;
}

.step-item {
  background: rgba(255, 255, 255, 0.95); /* Almost opaque white background */
  margin: 1.5rem 0;
  padding: 1.8rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c; /* Dark gray for better contrast */
  text-shadow: none; /* Remove text shadow for better clarity */
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 3px solid rgba(102, 126, 234, 0.3); /* Light indigo border */
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

/* Fix contact section sizing and centering */
.contact { 
  padding: 3rem 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  margin: 1.5rem auto;
  max-width: calc(100% - 3rem);
  width: calc(100vw - 3rem);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact .container {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.contact-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  width: 100%;
  max-width: 500px;
  border: 4px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
  margin: 0 auto; /* Center the card */
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
  color: #1a202c; /* Dark gray for better contrast */
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9); /* Strong white shadow */
  background: rgba(255, 255, 255, 0.95); /* Almost opaque white background */
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  font-size: 2rem;
  margin: 0 auto 1rem auto;
  padding: 0.8rem 1.5rem;
  width: fit-content;
  position: relative;
  z-index: 2;
  text-align: center;
  line-height: 1.2;
  border-radius: 15px;
}

.contact-subtitle {
  color: #1a202c; /* Dark gray for better contrast */
  text-align: center;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8); /* White shadow for visibility */
  font-size: 1rem;
  position: relative;
  z-index: 2;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.9); /* White background for readability */
  padding: 0.8rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.6);
}

/* Footer text visibility */
.site-footer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 2px solid rgba(255, 255, 255, 0.5);
  padding: 1rem 0;
}

.site-footer small {
  color: #2d3748; /* Dark gray for better contrast */
  font-weight: 600;
  text-shadow: none;
}

/* Modal text improvements */
.modal-header h4 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a202c; /* Dark text for better contrast */
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9); /* White shadow */
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.modal-subtitle {
  color: #2d3748; /* Dark gray for better contrast */
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
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
  max-width: 450px; /* Reduced width for better proportions */
  border-radius: 25px; 
  padding: 0; /* Remove default padding */
  position: relative;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  margin: 1rem;
  overflow: hidden; /* Ensure content doesn't overflow */
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
  color: #1a202c; /* Dark text for better contrast */
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9); /* White shadow */
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.modal-subtitle {
  color: #2d3748; /* Dark gray for better contrast */
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.modal-form {
  padding: 0 2rem 2rem 2rem; /* No top padding, sides and bottom padding */
  display: grid;
  gap: 1.2rem;
}

/* Modal form inputs - consistent with contact form */
.modal-form .form-input {
  border: 3px solid rgba(255, 255, 255, 0.9);
  padding: 1.2rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.98);
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  color: #1a202c;
}

.modal-form .form-input::placeholder {
  color: #4a5568;
  font-weight: 500;
  opacity: 0.8;
}

.modal-form .form-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.3);
  background: white;
  transform: scale(1.02);
}

/* Enhanced contact form styling with better visibility */
.contact-form { 
  display: grid; 
  gap: 1.2rem;
  position: relative;
  z-index: 2;
}

.form-input, .form-textarea {
  border: 3px solid rgba(255, 255, 255, 0.9);
  padding: 1.2rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.98);
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  color: #1a202c;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #4a5568;
  font-weight: 500;
  opacity: 0.8;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.3);
  background: white;
  transform: scale(1.02);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
}

.form-actions { 
  display: flex; 
  gap: 1rem; 
  margin-top: 1rem;
}

.form-actions .btn {
  flex: 1;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.form-actions .btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.form-actions .btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Enhanced modal form inputs */
.modal-form .form-input {
  border: 3px solid rgba(255, 255, 255, 0.9);
  padding: 1.2rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.98);
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  color: #1a202c;
}

.modal-form .form-input::placeholder {
  color: #4a5568;
  font-weight: 500;
  opacity: 0.8;
}

.modal-form .form-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.3);
  background: white;
  transform: scale(1.02);
}

/* Reduced size of "How it works" step cards */
.how { 
  padding: 2rem 0; /* Reduced from 3rem */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px; /* Reduced from 25px */
  margin: 1rem auto; /* Reduced from 1.5rem */
  max-width: calc(100% - 2rem); /* Reduced width */
  width: calc(100vw - 2rem);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06); /* Lighter shadow */
}

.how .container {
  max-width: 700px; /* Reduced from 900px */
  margin: 0 auto;
  padding: 0 1rem; /* Reduced padding */
}

.how-steps { 
  list-style: none;
  padding: 0; 
  max-width: 600px; /* Reduced from 800px */
  margin: 0 auto;
  counter-reset: step-counter;
}

.step-item {
  background: rgba(255, 255, 255, 0.95); /* Almost opaque white background */
  margin: 1rem 0; /* Reduced from 1.5rem */
  padding: 1.2rem 1.5rem; /* Reduced padding significantly */
  border-radius: 15px; /* Reduced from 20px */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Lighter shadow */
  font-size: 0.95rem; /* Reduced from 1.1rem */
  font-weight: 600;
  color: #1a202c;
  text-shadow: none;
  display: flex;
  align-items: center;
  gap: 1rem; /* Reduced from 1.5rem */
  border: 2px solid rgba(102, 126, 234, 0.2); /* Thinner border */
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
  left: -8px; /* Reduced from -12px */
  top: -8px; /* Reduced from -12px */
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  width: 30px; /* Reduced from 40px */
  height: 30px; /* Reduced from 40px */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700; /* Reduced from 800 */
  font-size: 0.9rem; /* Reduced from 1.2rem */
  border: 2px solid white; /* Thinner border */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Lighter shadow */
}

.step-item:hover {
  transform: translateX(5px) scale(1.005); /* Reduced effects */
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12); /* Lighter shadow */
}

.step-icon {
  font-size: 1.8rem; /* Reduced from 2.5rem */
  animation: bounce 2s infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)); /* Lighter shadow */
}

/* Responsive adjustments for step items */
@media (max-width: 900px) {
  .how {
    width: calc(100vw - 1.5rem);
    margin: 0.8rem auto;
    padding: 2rem 0;
  }
  
  .step-item {
    padding: 1rem 1.2rem; /* Reduced padding for mobile */
    font-size: 0.9rem;
    gap: 0.8rem;
    margin: 0.8rem 0;
  }
  
  .step-icon {
    font-size: 1.5rem; /* Smaller icon on mobile */
  }
}

@media (max-width: 600px) {
  .how {
    margin: 0.5rem auto;
    border-radius: 15px;
    width: calc(100vw - 1rem);
    padding: 1.5rem 0; /* Reduced padding */
  }
  
  .step-item {
    padding: 0.8rem 1rem; /* Further reduced padding */
    font-size: 0.85rem;
    gap: 0.6rem;
    flex-direction: column;
    text-align: center;
  }
  
  .step-item::before {
    position: static;
    margin-bottom: 0.5rem;
    width: 25px; /* Smaller counter */
    height: 25px;
    font-size: 0.8rem;
  }
  
  .step-icon {
    font-size: 1.3rem; /* Even smaller on mobile */
  }
}
</style>