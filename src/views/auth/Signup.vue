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
          <h2 class="form-title"> Create Your Account!</h2>
          <p class="form-subtitle">Let's get you started on an awesome adventure!</p>
        </div>

        <!-- Form Content -->
        <div class="form-content">
          <!-- Account Exists Error -->
          <div v-if="accountExistsError" class="account-exists-error">
            <div class="error-icon-wrapper">
              <div class="error-emoji">⚠️</div>
            </div>
            <div class="error-content">
              <h3 class="error-title">Oops! Account Already Exists</h3>
              <p class="error-message">{{ accountExistsMessage }}</p>
              <div class="error-actions">
                <button @click="goToLogin" class="login-redirect-btn">
                  ← Go to Login
                </button>
                <button @click="clearAccountError" class="try-again-btn">
                  Try Different Email
                </button>
              </div>
            </div>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="registration-form">
            <!-- Avatar Selection -->
            <div class="form-group">
              <label class="form-label">Pick Your Cool Avatar!</label>
              
              <div v-if="loadingAvatars" class="avatar-loading">
                <div class="spinner-large"></div>
                <p>Loading awesome avatars...</p>
              </div>

              <div v-else-if="avatars.length === 0" class="avatar-empty">
                <p>No avatars available</p>
              </div>

              <div v-else class="avatar-grid">
                <div 
                  v-for="avatar in avatars" 
                  :key="avatar.id"
                  @click="selectAvatar(avatar)"
                  class="avatar-option"
                  :class="{ 'selected': selectedAvatar && selectedAvatar.id === avatar.id }"
                >
                  <img :src="avatar.imageUrl" :alt="'Avatar ' + avatar.id" />
                  <div class="avatar-check">
                    ✓
                  </div>
                </div>
              </div>

              <div v-if="showErrors && !selectedAvatar" class="error-message">
                Please pick an avatar!
              </div>
            </div>

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

            <!-- Birthday -->
            <div class="form-group">
              <label for="birthday" class="form-label">Birthday</label>
              <div class="input-wrapper">
                <div class="input-emoji">🎂</div>
                <input 
                  id="birthday"
                  v-model="birthday" 
                  type="date" 
                  class="form-input"
                  :class="{'error': showErrors && !isValidBirthday}"
                  :max="maxDate"
                  autocomplete="bday"
                />
              </div>
              <div v-if="showErrors && !birthday" class="error-message">
                Tell us when you were born! 🎂
              </div>
              <div v-else-if="showErrors && !isValidBirthday" class="error-message">
                You need to be at least 13 years old!
              </div>
            </div>

            <!-- Password Fields Row -->
            <div class="password-row">
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
                    autocomplete="new-password"
                  />
                  <button 
                    type="button"
                    @click="togglePasswordVisibility('password')" 
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

              <!-- Confirm Password -->
              <div class="form-group">
                <label for="confirmPassword" class="form-label">Confirm</label>
                <div class="input-wrapper">
                  <div class="input-emoji">🔐</div>
                  <input 
                    id="confirmPassword"
                    v-model="confirmPassword" 
                    :type="confirmPasswordVisible ? 'text' : 'password'" 
                    class="form-input password-input"
                    :class="{'error': showErrors && !isPasswordMatch}"
                    placeholder="Confirm your password"
                    autocomplete="new-password"
                  />
                  <button 
                    type="button"
                    @click="togglePasswordVisibility('confirmPassword')" 
                    class="password-toggle"
                    aria-label="Toggle confirm password visibility"
                  >
                    {{ confirmPasswordVisible ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <div v-if="showErrors && !confirmPassword" class="error-message">
                  Confirm it! 
                </div>
                <div v-else-if="showErrors && confirmPassword && !isPasswordMatch" class="error-message">
                  Passwords don't match! 
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="pendingRegistration"
              class="submit-button"
              :class="{'loading': pendingRegistration}"
            >
              <span v-if="!pendingRegistration" class="button-content">
                Create My Account!
              </span>
              <span v-else class="button-content">
                <div class="spinner"></div>
                Creating Account...
              </span>
            </button>
          </form>

          <!-- Modals -->
          <transition name="modal-fade">
            <div v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
              <div class="modal-content" @click.stop>
                <div class="modal-emoji">⚠️</div>
                <h3 class="modal-title">Password Too Short!</h3>
                <p class="modal-message">Your password needs to be at least 8 characters long. Make it strong! 💪</p>
                <button @click="showPasswordModal = false" class="modal-button primary">
                  Got it! 👍
                </button>
              </div>
            </div>
          </transition>

          <transition name="modal-fade">
            <div v-if="showPasswordMismatchModal" class="modal-overlay" @click="showPasswordMismatchModal = false">
              <div class="modal-content" @click.stop>
                <div class="modal-emoji">🤔</div>
                <h3 class="modal-title">Passwords Don't Match!</h3>
                <p class="modal-message">Make sure both passwords are exactly the same. Try again! 🔐</p>
                <button @click="showPasswordMismatchModal = false" class="modal-button primary">
                  Got it! 👍
                </button>
              </div>
            </div>
          </transition>

          <!-- Login Link -->
          <p class="login-link">
            Already have an account? 
            <a href="/login" class="login-link-text">
              Sign in here!
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'SignupForm',
  data() {
    return {
      avatars: [],
      selectedAvatar: null,
      loadingAvatars: false,
      email: '',
      birthday: '',
      password: '',
      confirmPassword: '',
      passwordVisible: false,
      confirmPasswordVisible: false,
      showPasswordModal: false,
      showPasswordMismatchModal: false,
      showAccountExistsModal: false,
      showErrors: false,
      lastAttemptTime: null,
      attemptCount: 0,
      accountExistsError: false,
      accountExistsMessage: '',
      pendingRegistration: false,
    };
  },
  computed: {
    maxDate() {
      const today = new Date();
      today.setFullYear(today.getFullYear() - 13);
      return today.toISOString().split('T')[0];
    },
    isValidEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return this.email && emailRegex.test(this.email);
    },
    isValidBirthday() {
      if (!this.birthday) return false;
      const birthDate = new Date(this.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 13;
      }
      return age >= 13;
    },
    isValidPassword() {
      return this.password && this.password.length >= 8;
    },
    isPasswordMatch() {
      return this.confirmPassword && this.password === this.confirmPassword;
    },
    formIsValid() {
      return this.selectedAvatar &&
             this.isValidEmail && 
             this.isValidBirthday &&
             this.password && 
             this.confirmPassword &&
             this.isPasswordMatch;
    }
  },
  mounted() {
    this.fetchAvatars();
  },
  methods: {
    async fetchAvatars() {
      this.loadingAvatars = true;
      try {
        const querySnapshot = await getDocs(collection(db, 'avatar'));
        this.avatars = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching avatars:', error);
        alert('Failed to load avatars. Please refresh the page.');
      } finally {
        this.loadingAvatars = false;
      }
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    togglePasswordVisibility(field) {
      if (field === 'password') {
        this.passwordVisible = !this.passwordVisible;
      } else if (field === 'confirmPassword') {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
      }
    },
    checkRateLimit() {
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;
      
      if (this.lastAttemptTime && (now - this.lastAttemptTime > hourInMs)) {
        this.attemptCount = 0;
      }
      
      if (this.attemptCount >= 5) {
        return false;
      }
      
      this.lastAttemptTime = now;
      this.attemptCount++;
      
      return true;
    },
    async handleSubmit() {
      if (this.password && this.password.length < 8) {
        this.showPasswordModal = true;
        return;
      }

      if (this.password && this.confirmPassword && !this.isPasswordMatch) {
        this.showPasswordMismatchModal = true;
        return;
      }

      this.showErrors = true;
      
      if (!this.formIsValid) {
        return;
      }

      await this.registerUser();
    },
    async registerUser() {
      this.pendingRegistration = true;

      try {
        await addDoc(collection(db, 'users'), {
          email: this.email,
          birthday: this.birthday,
          avatar: {
            id: this.selectedAvatar.id,
            imageUrl: this.selectedAvatar.imageUrl
          },
          role: 'user',
          createdAt: serverTimestamp()
        });
        
        alert("🎉 Account created successfully! Welcome aboard!");
        this.clearFormData();
        
        // Redirect to user index page
        this.$router.push('/');
      } catch (error) {
        console.error("Registration error:", error);
        alert("Oops! Something went wrong. Please try again!");
      } finally {
        this.pendingRegistration = false;
      }
    },
    clearFormData() {
      this.selectedAvatar = null;
      this.email = "";
      this.birthday = "";
      this.password = "";
      this.confirmPassword = "";
      this.passwordVisible = false;
      this.confirmPasswordVisible = false;
      this.showPasswordModal = false;
      this.showErrors = false;
    },
    clearAccountError() {
      this.accountExistsError = false;
      this.accountExistsMessage = '';
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
  max-width: 480px;
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

.registration-form {
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

/* <CHANGE> Password fields in one row on larger screens */
.password-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Avatar Selection */
.avatar-loading,
.avatar-empty {
  text-align: center;
  padding: 1.5rem 1rem;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid #FFE5B4;
  border-top-color: #FF6B9D;
  border-radius: 50%;
  margin: 0 auto 0.75rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.avatar-option {
  position: relative;
  aspect-ratio: 1;
  border: 3px solid #FFD700;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #FFF8DC;
  box-shadow: 0 3px 10px rgba(255, 107, 157, 0.15);
}

.avatar-option:hover {
  border-color: #FF6B9D;
  transform: scale(1.08) rotate(1deg);
  box-shadow: 0 6px 16px rgba(255, 107, 157, 0.3);
}

.avatar-option.selected {
  border-color: #FF6B9D;
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.25), 0 6px 16px rgba(255, 107, 157, 0.3);
  transform: scale(1.03);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-check {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #FF6B9D, #C44569);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  border: 2px solid white;
}

.avatar-option.selected .avatar-check {
  opacity: 1;
  transform: scale(1);
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

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  border-radius: 1.2rem;
  padding: 2rem;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: modalSlideUp 0.4s ease-out;
  border: 3px solid #FFD700;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-emoji {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  animation: bounce 1s ease-in-out infinite;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #FF6B9D;
  margin-bottom: 0.6rem;
}

.modal-message {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 1.25rem;
  line-height: 1.5;
  font-weight: 500;
}

.modal-button {
  width: 100%;
  padding: 0.8rem 1.25rem;
  border: none;
  border-radius: 0.8rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-button.primary {
  background: linear-gradient(135deg, #FF6B9D, #C44569);
  color: white;
  border: 2px solid #FFD700;
}

.modal-button.primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.3);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: translateY(30px) scale(0.9);
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

/* Account Exists Error */
.account-exists-error {
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

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-redirect-btn {
  width: 100%;
  padding: 0.8rem 1.25rem;
  background: linear-gradient(135deg, #FF6B9D, #C44569);
  color: white;
  border: 2px solid #FFD700;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.login-redirect-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.3);
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

/* Login Link */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
}

.login-link-text {
  color: #FF6B9D;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.2s;
}

.login-link-text:hover {
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

  .registration-form {
    gap: 1rem;
  }

  /* <CHANGE> Stack password fields on mobile */
  .password-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .avatar-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
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

  .avatar-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
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

  .modal-content {
    padding: 1.25rem;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-message {
    font-size: 0.85rem;
  }
}
</style>