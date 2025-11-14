import Vue from 'vue';
import ToastNotification from '../components/ToastNotification.vue';

class ToastService {
  constructor() {
    this.container = null;
    this.toastApp = null;
    this.init();
  }

  init() {
    // Create container for toast notifications
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.container);

    // Create Vue app for toast notifications
    this.toastApp = new Vue({
      components: { ToastNotification },
      data() {
        return {
          toast: {
            visible: false,
            message: '',
            type: 'info',
            position: 'top-right'
          }
        };
      },
      methods: {
        showToast(message, type = 'info', duration = 4000, position = 'top-right') {
          this.toast = {
            visible: true,
            message,
            type,
            position
          };

          // Auto hide after duration
          setTimeout(() => {
            this.hideToast();
          }, duration);
        },
        hideToast() {
          this.toast.visible = false;
        }
      },
      template: `
        <div>
          <ToastNotification
            v-if="toast.visible"
            :visible="toast.visible"
            :message="toast.message"
            :type="toast.type"
            :position="toast.position"
            @hide="hideToast"
          />
        </div>
      `
    }).$mount(this.container);
  }

  show(message, type = 'info', duration = 4000, position = 'top-right') {
    if (this.toastApp) {
      this.toastApp.showToast(message, type, duration, position);
    }
  }

  success(message, duration = 4000) {
    this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = 4000) {
    this.show(message, 'info', duration);
  }
}

// Create singleton instance
const toastService = new ToastService();

export default toastService;