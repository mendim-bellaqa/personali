<template>
  <transition name="toast-fade" appear>
    <div 
      v-if="visible" 
      :class="['toast', `toast-${type}`, position]"
      @click="hide"
    >
      <div class="toast-content">
        <span class="toast-icon">
          {{ icon }}
        </span>
        <span class="toast-message">{{ message }}</span>
        <button @click.stop="hide" class="toast-close">×</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastNotification',
  data() {
    return {
      visible: false,
      message: '',
      type: 'info',
      position: 'top-right',
      duration: 4000,
      timer: null
    };
  },
  computed: {
    icon() {
      switch (this.type) {
        case 'success':
          return '✅';
        case 'error':
        case 'danger':
          return '❌';
        case 'warning':
          return '⚠️';
        default:
          return 'ℹ️';
      }
    }
  },
  methods: {
    show(message, type = 'info', duration = 4000) {
      this.message = message;
      this.type = type;
      this.duration = duration;
      this.visible = true;
      
      if (this.timer) {
        clearTimeout(this.timer);
      }
      
      if (duration > 0) {
        this.timer = setTimeout(() => {
          this.hide();
        }, duration);
      }
    },
    hide() {
      this.visible = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }
};
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast {
  position: fixed;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.toast::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 3s ease-in-out infinite;
}

.toast:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

/* Position classes */
.top-right {
  top: 20px;
  right: 20px;
}

.top-left {
  top: 20px;
  left: 20px;
}

.bottom-right {
  bottom: 20px;
  right: 20px;
}

.bottom-left {
  bottom: 20px;
  left: 20px;
}

.top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

/* Type styles */
.toast-success {
  border-left: 4px solid #10b981;
}

.toast-success::before {
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6), transparent);
}

.toast-error,
.toast-danger {
  border-left: 4px solid #ef4444;
}

.toast-error::before,
.toast-danger::before {
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.6), transparent);
}

.toast-warning {
  border-left: 4px solid #fbbf24;
}

.toast-warning::before {
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.6), transparent);
}

.toast-info {
  border-left: 4px solid #3b82f6;
}

.toast-info::before {
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
}

/* Responsive design */
@media (max-width: 768px) {
  .toast {
    max-width: calc(100vw - 40px);
  }
  
  .top-right,
  .top-left {
    top: 10px;
  }
  
  .bottom-right,
  .bottom-left {
    bottom: 10px;
  }
  
  .top-center {
    top: 10px;
  }
  
  .bottom-center {
    bottom: 10px;
  }
}
</style>