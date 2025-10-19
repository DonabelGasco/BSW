<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 via-purple-300 to-pink-200 relative overflow-hidden">
    <!-- Animated background shapes -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
    <div class="absolute top-32 right-20 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
    <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
    <div class="absolute top-1/2 right-10 w-18 h-18 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
    <div class="absolute bottom-32 right-1/3 w-14 h-14 bg-purple-300 rounded-full opacity-20 animate-bounce"></div>

    <!-- Floating emoji shapes -->
    <div class="absolute top-16 right-1/4 text-4xl animate-float" style="animation-delay: 0s">🎨</div>
    <div class="absolute bottom-40 left-16 text-4xl animate-float" style="animation-delay: 1s">🌟</div>
    <div class="absolute top-1/3 left-20 text-4xl animate-float" style="animation-delay: 2s">🎈</div>
    <div class="absolute bottom-1/4 right-20 text-4xl animate-float" style="animation-delay: 3s">🦋</div>

    <!-- Signup Card -->
    <div class="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm relative z-10 border-4 border-purple-200">
      <div class="text-center mb-6">
        <div class="text-5xl mb-3 animate-bounce">🎉</div>
        <h2 class="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Join the Fun!
        </h2>
        <p class="text-gray-600 font-semibold text-base">Create your account to start learning</p>
      </div>

      <!-- Signup Form -->
      <form @submit.prevent="signup" class="space-y-4">
        <div class="space-y-3">
          <input
            v-model="email"
            type="email"
            placeholder="📧 Your email address"
            required
            class="w-full px-3 py-3 rounded-xl border-3 border-purple-200 focus:border-purple-500 focus:outline-none text-base font-semibold transition-all duration-200 placeholder-gray-500 bg-purple-50 focus:bg-white"
          />

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="🔒 Create a strong password"
              required
              class="w-full px-3 py-3 rounded-xl border-3 border-purple-200 focus:border-purple-500 focus:outline-none text-base font-semibold transition-all duration-200 placeholder-gray-500 bg-purple-50 focus:bg-white"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl hover:scale-110 transition-transform duration-200"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>

          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="🔒 Confirm your password"
              required
              class="w-full px-3 py-3 rounded-xl border-3 border-purple-200 focus:border-purple-500 focus:outline-none text-base font-semibold transition-all duration-200 placeholder-gray-500 bg-purple-50 focus:bg-white"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl hover:scale-110 transition-transform duration-200"
            >
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <label class="flex items-start gap-2 cursor-pointer">
          <input
            v-model="agreeToTerms"
            type="checkbox"
            required
            class="w-4 h-4 rounded-lg border-2 border-purple-300 cursor-pointer accent-purple-500 mt-0.5 flex-shrink-0"
          />
          <span class="text-gray-700 font-medium text-xs leading-relaxed">
            I agree to the <a href="#" class="text-purple-600 font-bold hover:text-purple-800 transition-colors">Terms & Conditions</a> and <a href="#" class="text-purple-600 font-bold hover:text-purple-800 transition-colors">Privacy Policy</a>
          </span>
        </label>

        <!-- Create Account Button -->
        <button
          type="submit"
          :disabled="loading || !agreeToTerms"
          class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-3 border-purple-600"
        >
          {{ loading ? '🔄 Creating Account...' : '🚀 Create My Account!' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="mt-6 pt-4 border-t-3 border-purple-200">
        <p class="text-center text-gray-600 font-semibold mb-3 text-sm">Already have an account?</p>
        <router-link
          to="/login"
          class="w-full block text-center py-2.5 px-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-base rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 border-3 border-blue-600"
        >
          🔐 Sign In Instead
        </router-link>
      </div>

      <!-- Error message -->
      <transition name="slide-down">
        <div
          v-if="error"
          class="mt-4 p-3 bg-red-100 border-3 border-red-400 rounded-xl text-red-800 font-semibold flex items-center gap-2 text-sm"
        >
          <span class="text-xl">❌</span>
          <span>{{ error }}</span>
        </div>
      </transition>

      <!-- Success message -->
      <transition name="slide-down">
        <div
          v-if="success"
          class="mt-4 p-3 bg-green-100 border-3 border-green-400 rounded-xl text-green-800 font-semibold flex items-center gap-2 text-sm"
        >
          <span class="text-xl">✅</span>
          <span>{{ success }}</span>
        </div>
      </transition>
    </div>

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="text-6xl animate-bounce">🎉</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeToTerms = ref(false)

const signup = async () => {
  error.value = ''
  success.value = ''

  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match!'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long!'
    return
  }

  if (!agreeToTerms.value) {
    error.value = 'Please agree to the Terms & Conditions to continue!'
    return
  }

  loading.value = true

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    success.value = 'Account created successfully! Welcome aboard! 🎉'
    
    // Clear form
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    agreeToTerms.value = false
    
    // Redirect to login after success
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already registered. Try logging in instead!'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address!'
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password is too weak. Please choose a stronger password!'
    } else {
      error.value = 'Something went wrong. Please try again!'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Custom border width */
.border-3 {
  border-width: 3px;
}

/* Bounce animation */
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

/* Float animation for emoji shapes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* Slide down animation for messages */
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

/* Fade animation for loading overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Focus states */
input:focus {
  transform: scale(1.02);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: scale(1.05);
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Link styles */
a {
  transition: all 0.2s ease;
}

a:hover {
  text-decoration: underline;
}
</style>