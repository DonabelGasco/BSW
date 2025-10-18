<template>
  <div class="auth-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Create Account</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const email = ref('')
const password = ref('')
const error = ref('')

const signup = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    alert('Account created successfully!')
    email.value = ''
    password.value = ''
    error.value = ''
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.auth-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
button {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
}
p {
  color: red;
}
</style>