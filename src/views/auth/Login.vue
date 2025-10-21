<template>
  <div class="page-container">
    <div class="form-wrapper">
      <!-- Main Card -->
      <div class="form-card">
        <!-- Header -->
        <div class="form-header">
          <div class="form-header-bg"></div> 
          <div class="logo-circle">
            <svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 class="form-title">Welcome Back!</h2>
          <p class="form-subtitle">We missed you! Let's continue the adventure!</p>
        </div>

        <!-- Form Content -->
        <div class="form-content">
          <!-- Login Error -->
          <div v-if="loginError" class="login-error">
            <div class="error-icon-wrapper">
              <div class="error-emoji">😢</div>
            </div>
            <div class="error-content">
              <h3 class="error-title">Login Failed!</h3>
              <p class="error-message">{{ errorMessage }}</p>
              <button @click="clearError" class="try-again-btn">
                Try Again
              </button>
            </div>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="login-form">
            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <div class="input-wrapper">
                <div class="input-emoji">📧</div>
                <input 
                  id="email"
                  v-model="email" 
                  type="email" 
                  class="form-input"
                  :class="{'error': showErrors && !isValidEmail}"
                  placeholder="Enter your email" 
                  autocomplete="email"
                />
              </div>
              <div v-if="showErrors && !email" class="error-message">
                We need your email! 📧
              </div>
              <div v-else-if="showErrors && !isValidEmail" class="error-message">
                That doesn't look like a real email!
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="input-wrapper">
                <div class="input-emoji">🔐</div>
                <input 
                  id="password"
                  v-model="password" 
                  :type="passwordVisible ? 'text' : 'password'" 
                  class="form-input password-input"
                  :class="{'error': showErrors && !isValidPassword}"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
                <button 
                  type="button"
                  @click="passwordVisible = !passwordVisible" 
                  class="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {{ passwordVisible ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              
              <div v-if="showErrors && !password" class="error-message">
                You need a password! 
              </div>
              <div v-else-if="showErrors && password && password.length < 8" class="error-message">
                At least 8 characters! 
              </div>
            </div>

            <!-- Forgot Password Link -->
            <div class="forgot-password">
              <a href="/forgot-password" class="forgot-link">
                Forgot password?
              </a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="pendingLogin"
              class="submit-button"
              :class="{'loading': pendingLogin}"
            >
              <span v-if="!pendingLogin" class="button-content">
                Let's Go! 🚀
              </span>
              <span v-else class="button-content">
                <div class="spinner"></div>
                Logging in...
              </span>
            </button>
          </form>

          <!-- Signup Link -->
          <p class="signup-link">
            Don't have an account? 
            <a href="/signup" class="signup-link-text">
              Create one here!
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      passwordVisible: false,
      showErrors: false,
      pendingLogin: false,
      loginError: false,
      errorMessage: '',
    };
  },
  computed: {
    isValidEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return this.email && emailRegex.test(this.email);
    },
    isValidPassword() {
      return this.password && this.password.length >= 8;
    },
    formIsValid() {
      return this.isValidEmail && this.isValidPassword;
    }
  },
  methods: {
    async handleSubmit() {
      this.showErrors = true;
      
      if (!this.formIsValid) {
        return;
      }

      await this.loginUser();
    },
    async loginUser() {
      this.pendingLogin = true;
      this.loginError = false;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        
        // Get user data from Firestore to check role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role || 'user'; // Default to 'user' if no role
          
          alert("🎉 Welcome back! Login successful!");
          
          // Redirect based on role
          if (userRole === 'admin') {
            this.$router.push('/admindash');
          } else {
            this.$router.push('/user');
          }
        } else {
          // User authenticated but no Firestore document
          alert("🎉 Welcome back! Login successful!");
          this.$router.push('/user');
        }
      } catch (error) {
        console.error("Login error:", error);
        this.loginError = true;
        
        // Handle different error types
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = "No account found with this email. Want to create one?";
        } else if (error.code === 'auth/wrong-password') {
          this.errorMessage = "Wrong password! Please try again.";
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = "Invalid email format. Please check and try again.";
        } else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = "Too many failed attempts. Please try again later.";
        } else {
          this.errorMessage = "Oops! Email or password is incorrect. Please try again!";
        }
      } finally {
        this.pendingLogin = false;
      }
    },
    clearError() {
      this.loginError = false;
      this.errorMessage = '';
    },
  }
};
</script>

<style scoped>
/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFD89B 0%, #e7da4c 25%, #FFB347 50%, #FF6B9D 75%, #C44569 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.form-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
  border: 3px solid #FFD700;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.form-header {
  position: relative;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  color: white;
  overflow: hidden;
}

.form-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #ffffff 100%);
  z-index: 0;
}

.logo-circle {
  position: relative;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  z-index: 1;
  border: 3px solid #FFD700;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.logo-icon {
  width: 40px;
  height: 40px;
  color: #FF6B9D;
}

.form-title {
  position: relative;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
  z-index: 1;
  letter-spacing: 0.3px;
}

.form-subtitle {
  position: relative;
  font-size: 0.95rem;
  opacity: 0.95;
  z-index: 1;
  font-weight: 500;
}

/* Form Content */
.form-content {
  padding: 1.75rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #FF6B9D;
  margin-bottom: 0.2rem;
  letter-spacing: 0.3px;
}

/* Input Styles */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-emoji {
  position: absolute;
  left: 0.75rem;
  font-size: 1.25rem;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 3rem;
  border: 2px solid #FFD700;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: #FFFACD;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #FF6B9D;
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.15);
  background: white;
}

.form-input.error {
  border-color: #FF4757;
  background: #FFE5E5;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.15);
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.password-toggle:hover {
  transform: scale(1.15);
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #FF4757;
  font-size: 0.85rem;
  margin-top: 0.2rem;
  font-weight: 600;
}

/* Forgot Password */
.forgot-password {
  text-align: right;
  margin-top: -0.5rem;
}

.forgot-link {
  color: #FF6B9D;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.forgot-link:hover {
  color: #C44569;
  text-decoration: underline;
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #FF6B9D, #C44569);
  color: white;
  border: 2px solid #FFD700;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.4rem;
  letter-spacing: 0.4px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 25px rgba(255, 107, 157, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Login Error */
.login-error {
  background: linear-gradient(135deg, #FFE5E5, #FFD4D4);
  border: 2px solid #FF4757;
  border-radius: 1.2rem;
  padding: 1.75rem;
  text-align: center;
  margin-bottom: 1rem;
}

.error-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.error-emoji {
  font-size: 2.5rem;
  animation: bounce 1s ease-in-out infinite;
}

.error-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #FF4757;
  margin-bottom: 0.4rem;
}

.error-content .error-message {
  color: #C41E3A;
  font-size: 0.9rem;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.try-again-btn {
  width: 100%;
  padding: 0.8rem 1.25rem;
  background: white;
  color: #FF6B9D;
  border: 2px solid #FF6B9D;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.try-again-btn:hover {
  background: #FFF0F5;
  transform: translateY(-2px);
}

/* Signup Link */
.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
}

.signup-link-text {
  color: #FF6B9D;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.2s;
}

.signup-link-text:hover {
  color: #C44569;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 640px) {
  .page-container {
    padding: 0.5rem;
  }

  .form-wrapper {
    max-width: 100%;
  }

  .form-header {
    padding: 1.5rem 1.25rem 1.25rem;
  }

  .logo-circle {
    width: 70px;
    height: 70px;
  }

  .logo-icon {
    width: 35px;
    height: 35px;
  }

  .form-title {
    font-size: 1.3rem;
  }

  .form-subtitle {
    font-size: 0.85rem;
  }

  .form-content {
    padding: 1.25rem;
  }

  .login-form {
    gap: 1rem;
  }

  .form-input {
    padding: 0.7rem 0.7rem 0.7rem 2.75rem;
    font-size: 0.85rem;
  }

  .input-emoji {
    font-size: 1.1rem;
    left: 0.6rem;
  }

  .submit-button {
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .error-message {
    font-size: 0.8rem;
  }
}

@media (max-width: 380px) {
  .form-header {
    padding: 1.25rem 1rem 1rem;
  }

  .form-content {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.1rem;
  }

  .form-subtitle {
    font-size: 0.8rem;
  }

  .form-input {
    font-size: 0.8rem;
    padding: 0.65rem 0.65rem 0.65rem 2.5rem;
  }

  .submit-button {
    font-size: 0.85rem;
    padding: 0.75rem 0.9rem;
  }
}
</style>