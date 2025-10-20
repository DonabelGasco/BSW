<template>
  <div class="admin-container">
    <div class="admin-card">
      <div class="header">
        <h1>Avatar Management</h1>
        <p class="subtitle">Upload and manage avatar images</p>
      </div>
      
      <div class="upload-section">
        <form @submit.prevent="handleUpload" class="upload-form">
          <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
            <input
              type="file"
              id="imageFile"
              @change="handleFileSelect"
              accept="image/*"
              class="file-input"
              required
            />
            <label for="imageFile" class="file-label">
              <div v-if="!previewUrl" class="upload-placeholder">
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="upload-text">Click to upload or drag and drop</p>
                <p class="upload-hint">PNG, JPG, GIF up to 1MB</p>
              </div>
              <div v-else class="preview">
                <img :src="previewUrl" alt="Preview" />
                <button type="button" @click.prevent="clearImage" class="clear-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </label>
          </div>

          <button type="submit" :disabled="uploading || !selectedFile" class="btn-upload">
            <span v-if="!uploading">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Upload Avatar
            </span>
            <span v-else class="loading-text">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
              </svg>
              Uploading...
            </span>
          </button>
        </form>

        <div v-if="message" :class="['message', messageType]">
          <svg v-if="messageType === 'success'" class="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ message }}
        </div>
      </div>

      <div class="avatars-section">
        <div class="section-header">
          <h2>Uploaded Avatars</h2>
          <span class="count-badge">{{ avatars.length }}</span>
        </div>
        
        <div v-if="loading" class="loading-state">
          <svg class="spinner-large" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
          </svg>
          <p>Loading avatars...</p>
        </div>
        <div v-else-if="avatars.length === 0" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <polyline points="21 15 16 10 5 21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>No avatars uploaded yet</p>
        </div>
        <div v-else class="avatars-grid">
          <div v-for="avatar in avatars" :key="avatar.id" class="avatar-card">
            <div class="avatar-image-wrapper">
              <img :src="avatar.imageUrl" alt="Avatar" />
            </div>
            <button @click="deleteAvatar(avatar.id)" class="btn-delete" title="Delete avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'AdminAvatarUpload',
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      uploading: false,
      message: '',
      messageType: '',
      avatars: [],
      loading: false
    };
  },
  mounted() {
    this.fetchAvatars();
  },
  beforeUnmount() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file);
      }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.processFile(file);
      }
    },
    processFile(file) {
      if (!file.type.startsWith('image/')) {
        this.showMessage('Please select a valid image file', 'error');
        return;
      }
      
      if (file.size > 1 * 1024 * 1024) {
        this.showMessage('Image size must be less than 1MB', 'error');
        return;
      }

      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
      }
      
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    clearImage() {
      this.selectedFile = null;
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
      }
      const fileInput = document.getElementById('imageFile');
      if (fileInput) {
        fileInput.value = '';
      }
    },
    async handleUpload() {
      if (!this.selectedFile) {
        this.showMessage('Please select an image', 'error');
        return;
      }

      this.uploading = true;
      this.message = '';

      try {
        const base64Image = await this.convertToBase64(this.selectedFile);

        await addDoc(collection(db, 'avatar'), {
          imageUrl: base64Image,
          createdAt: serverTimestamp()
        });

        this.showMessage('Avatar uploaded successfully!', 'success');
        this.resetForm();
        await this.fetchAvatars();
      } catch (error) {
        console.error('Error uploading avatar:', error);
        this.showMessage('Error uploading avatar: ' + (error.message || 'Unknown error'), 'error');
      } finally {
        this.uploading = false;
      }
    },
    convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async fetchAvatars() {
      this.loading = true;
      try {
        const querySnapshot = await getDocs(collection(db, 'avatar'));
        this.avatars = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching avatars:', error);
        this.showMessage('Error loading avatars', 'error');
      } finally {
        this.loading = false;
      }
    },
    async deleteAvatar(avatarId) {
      if (!confirm('Are you sure you want to delete this avatar?')) return;

      try {
        await deleteDoc(doc(db, 'avatar', avatarId));
        this.showMessage('Avatar deleted successfully!', 'success');
        await this.fetchAvatars();
      } catch (error) {
        console.error('Error deleting avatar:', error);
        this.showMessage('Error deleting avatar: ' + error.message, 'error');
      }
    },
    resetForm() {
      this.clearImage();
    },
    showMessage(msg, type) {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-container {
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@media (min-width: 768px) {
  .admin-container {
    padding: 40px 20px;
  }
}

.admin-card {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-top: 200px;
}

@media (min-width: 768px) {
  .admin-card {
    padding: 40px;
  }
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

@media (min-width: 768px) {
  .header h1 {
    font-size: 36px;
  }
}

.subtitle {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

@media (min-width: 768px) {
  .subtitle {
    font-size: 16px;
  }
}

.upload-section {
  margin-bottom: 48px;
}

.upload-form {
  max-width: 600px;
  margin: 0 auto;
}

.upload-area {
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.file-label {
  display: block;
  cursor: pointer;
}

.upload-placeholder {
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.upload-placeholder:hover {
  border-color: #667eea;
  background: #edf2f7;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #667eea;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.upload-hint {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f7fafc;
  padding: 16px;
}

.preview img {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

.clear-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.clear-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

.btn-upload {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-upload:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  margin-top: 20px;
  padding: 14px 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.success {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.message.error {
  background: #fed7d7;
  color: #742a2a;
  border: 1px solid #fc8181;
}

.message-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.avatars-section {
  margin-top: 48px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

@media (min-width: 768px) {
  .section-header h2 {
    font-size: 28px;
  }
}

.count-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.spinner-large {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #667eea;
  animation: spin 1s linear infinite;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #cbd5e0;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

@media (min-width: 640px) {
  .avatars-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .avatars-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
  }
}

.avatar-card {
  position: relative;
  background: #f7fafc;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  aspect-ratio: 1;
}

.avatar-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.avatar-card:hover .btn-delete {
  opacity: 1;
}

.avatar-image-wrapper {
  width: 100%;
  height: 100%;
  padding: 12px;
}

.avatar-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.btn-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.btn-delete:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1);
}

.btn-delete svg {
  width: 18px;
  height: 18px;
  color: white;
}

@media (max-width: 767px) {
  .btn-delete {
    opacity: 1;
    background: rgba(239, 68, 68, 0.85);
  }
}
</style>