<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 via-purple-300 to-pink-200 relative overflow-hidden">
    <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <span v-if="toast.type === 'success'">✅</span>
            <span v-else-if="toast.type === 'error'">❌</span>
            <span v-else-if="toast.type === 'warning'">⚠️</span>
            <span v-else-if="toast.type === 'info'">ℹ️</span>
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
        </div>
      </transition-group>
    </div>

    <!-- Login Card -->
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🎓</div>
        <h2 class="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Welcome Back!
        </h2>
        <p class="text-gray-600 font-medium">Log in to continue learning</p>
      </div>

      <!-- Email/Password Login Form -->
      <form @submit.prevent="login" class="space-y-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg font-medium transition-all duration-200 placeholder-gray-400"
        />

        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            required
            class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg font-medium transition-all duration-200 placeholder-gray-400"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="w-5 h-5 rounded-lg border-2 border-purple-300 cursor-pointer accent-purple-500"
          />
          <span class="text-gray-700 font-medium">Remember me</span>
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Google Sign-In Button -->
      <div class="mt-6 pt-6 border-t-2 border-gray-200">
        <button
          @click="loginWithGoogle"
          :disabled="loading"
          class="w-full py-3 px-4 bg-white border-2 border-gray-300 text-gray-800 font-bold text-lg rounded-xl hover:bg-gray-50 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
        >
          <span class="text-2xl">🔐</span>
          Sign in with Google
        </button>
      </div>

      <!-- Forgot Password Link -->
      <div class="text-center mt-4">
        <a href="#" class="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
          Forgot password?
        </a>
      </div>

      <!-- Error message -->
      <transition name="slide-down">
        <div
          v-if="error"
          class="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-800 font-medium flex items-center gap-2"
        >
          <span class="text-2xl">❌</span>
          {{ error }}
        </div>
      </transition>
    </div>

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="text-6xl animate-bounce">🎓</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

// Toast notification system
const toasts = ref([])
let toastId = 0

const showToast = (message, type = 'success', duration = 3000) => {
  const id = ++toastId
  const toast = {
    id,
    message,
    type,
    duration,
    visible: true
  }
  
  toasts.value.push(toast)
  
  // Auto remove after duration
  setTimeout(() => {
    removeToast(id)
  }, duration)
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    
    // Show toast notification instead of success message
    showToast('🎉 Login successful! Redirecting...', 'success', 2000)
    
    // Store remember me preference
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
    }
    
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (err) {
    if (err.code === 'auth/invalid-email') {
      error.value = 'Invalid email format.'
    } else if (err.code === 'auth/user-not-found') {
      error.value = 'No account found with that email.'
    } else if (err.code === 'auth/wrong-password') {
      error.value = 'Incorrect password.'
    } else {
      error.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const loginWithGoogle = async () => {
  error.value = ''
  loading.value = true
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    
    // Show toast notification for Google login
    showToast('🎉 Google login successful! Redirecting...', 'success', 2000)
    
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
    }
    
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = 'Sign-in cancelled.'
    } else if (err.code === 'auth/popup-blocked') {
      error.value = 'Pop-up was blocked. Please allow pop-ups and try again.'
    } else {
      error.value = 'Google sign-in failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Toast Notification Styles */
.toast-container {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  pointer-events: all;
  min-width: 300px;
  max-width: 400px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.toast:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.toast-success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.toast-error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.toast-warning {
  background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.toast-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  animation: bounce 2s infinite;
}

.toast-message {
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
}

.toast-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-100%) scale(0.8);
}

.toast-move {
  transition: transform 0.4s ease;
}

/* Responsive toast */
@media (max-width: 640px) {
  .toast-container {
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
  
  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>