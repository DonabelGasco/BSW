<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-300 via-pink-200 to-purple-200 overflow-hidden">
    <!-- Floating decorative elements -->
    <div class="fixed top-10 left-10 text-6xl animate-bounce" style="animation-delay: 0s">🎈</div>
    <div class="fixed top-32 right-20 text-5xl animate-bounce" style="animation-delay: 0.5s">⭐</div>
    <div class="fixed bottom-32 left-20 text-6xl animate-bounce" style="animation-delay: 1s">🎨</div>
    <div class="fixed bottom-20 right-10 text-5xl animate-bounce" style="animation-delay: 1.5s">🎪</div>

    <!-- Main content -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <!-- Welcome section -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4 drop-shadow-lg">
          Welcome, {{ userEmail.split('@')[0] }}! 🎉
        </h1>
        <p class="text-2xl md:text-3xl font-bold text-purple-700 mb-2">
          You're in the Fun Zone!
        </p>
        <p class="text-lg md:text-xl text-purple-600">
          Ready for an amazing adventure?
        </p>
      </div>

      <!-- Feature cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl">
        <!-- Card 1 -->
        <div class="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-pink-400">
          <div class="text-5xl mb-4">🎮</div>
          <h2 class="text-2xl font-bold text-pink-600 mb-2">Play Games</h2>
          <p class="text-gray-700 font-semibold">Unlock fun challenges and earn rewards!</p>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-blue-400">
          <div class="text-5xl mb-4">🏆</div>
          <h2 class="text-2xl font-bold text-blue-600 mb-2">Earn Badges</h2>
          <p class="text-gray-700 font-semibold">Collect awesome achievements!</p>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-purple-400">
          <div class="text-5xl mb-4">👥</div>
          <h2 class="text-2xl font-bold text-purple-600 mb-2">Make Friends</h2>
          <p class="text-gray-700 font-semibold">Connect with other adventurers!</p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-6 mb-8">
        <button
          @click="startAdventure"
          class="px-10 py-5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-2xl font-black rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-4 border-pink-600 active:scale-95"
        >
          🚀 Start Adventure!
        </button>
        <button
          @click="logout"
          class="px-10 py-5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-2xl font-black rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-4 border-orange-500 active:scale-95"
        >
          👋 Logout
        </button>
      </div>

      <!-- Fun fact section -->
      <div class="bg-white rounded-3xl p-8 max-w-2xl shadow-2xl border-4 border-yellow-400 text-center">
        <p class="text-lg md:text-xl font-bold text-gray-800 mb-4">
          💡 Did you know?
        </p>
        <p class="text-gray-700 text-lg font-semibold">
          Every time you complete a challenge, you help save the digital forest! 🌳
        </p>
      </div>
    </div>

    <!-- Celebration animation on mount -->
    <div v-if="showCelebration" class="fixed inset-0 pointer-events-none">
      <div v-for="i in 20" :key="i" class="absolute animate-ping" :style="{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }">
        ✨
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const auth = getAuth()
const router = useRouter()
const userEmail = ref('')
const showCelebration = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email
      showCelebration.value = true
      setTimeout(() => {
        showCelebration.value = false
      }, 2000)
    } else {
      router.push('/login')
    }
  })
})

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (err) {
    console.error(err.message)
  }
}

const startAdventure = () => {
  // Navigate to adventure/game section
  router.push('/adventure')
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

button:active {
  transform: scale(0.95);
}
</style>