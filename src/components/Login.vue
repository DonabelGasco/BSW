<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 via-purple-300 to-pink-200 relative overflow-hidden">
    <!-- Animated background shapes -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
    <div class="absolute top-32 right-20 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
    <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>

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

      <!-- Success message -->
      <transition name="slide-down">
        <div
          v-if="success"
          class="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-xl text-green-800 font-medium flex items-center gap-2"
        >
          <span class="text-2xl">✅</span>
          {{ success }}
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
const success = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const login = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    success.value = 'Login successful! Redirecting...'
    
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
  success.value = ''
  loading.value = true
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    success.value = 'Google login successful! Redirecting...'
    
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
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>