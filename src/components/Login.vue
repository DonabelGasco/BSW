<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // ✅ Redirect to home page after successful login
    router.push('/home')
  } catch (err) {
    // Firebase returns detailed errors, but we can show a friendly message
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
</script>

<style scoped>
.auth-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>