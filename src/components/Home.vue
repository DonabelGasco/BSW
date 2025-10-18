<template>
  <div class="home">
    <h1>Welcome, {{ userEmail }}</h1>
    <p>You are now logged in.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "vue-router"

const auth = getAuth()
const router = useRouter()
const userEmail = ref("")

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email
    } else {
      router.push("/login")
    }
  })
})

const logout = async () => {
  try {
    await signOut(auth)
    router.push("/login")
  } catch (err) {
    console.error(err.message)
  }
}
</script>

<style scoped>
.home {
  max-width: 400px;
  margin: 80px auto;
  text-align: center;
}
button {
  padding: 8px 12px;
  margin-top: 12px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>