<template>
  <div class="relative min-h-screen overflow-hidden">
    <UniversalBanner />
    
    <!-- Main Container -->

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-2xl mx-auto pt-32 px-5 pb-20">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="meditation-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.871 4.23c2.395-1.79 5.45-2.227 8.29-1.197 2.253.818 4.053 2.618 4.87 4.871 1.03 2.84-.407 5.9-2.197 8.295a14.532 14.532 0 01-2.27 2.466c-1.07.96-2.438 1.54-3.87 1.54s-2.8-.58-3.87-1.54A14.535 14.535 0 014.13 16.2c-1.79-2.395-3.227-5.455-2.197-8.295.817-2.252 2.617-4.052 4.87-4.87z" />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            FOCUS TIMER
          </h1>
        </div>
        <p class="text-gray-300 text-lg">Find your inner peace and concentration</p>
      </div>

      <!-- Enhanced Timer Setup Section -->
      <div class="timer-setup liquid-glass-card mb-8" v-if="!isTimerRunning">
        <div class="setup-content">
          <h3 class="text-xl font-semibold text-white mb-6 text-center">
            <span class="setup-title-text">Set Your Focus Time</span>
          </h3>
          <div class="time-inputs-container">
            <!-- Enhanced Minutes Input -->
            <div class="time-input-group-enhanced">
              <label class="time-label-enhanced">Minutes</label>
              <div class="input-wrapper">
                <input
                  v-model.number="inputMinutes"
                  type="number"
                  min="1"
                  max="180"
                  class="time-input-enhanced"
                  @input="validateTimeInput"
                  placeholder="12"
                />
                <div class="input-glow"></div>
              </div>
            </div>
            
            <!-- Enhanced Separator -->
            <div class="time-separator-enhanced">
              <div class="separator-line"></div>
              <span>:</span>
              <div class="separator-line"></div>
            </div>
            
            <!-- Enhanced Seconds Input -->
            <div class="time-input-group-enhanced">
              <label class="time-label-enhanced">Seconds</label>
              <div class="input-wrapper">
                <input
                  v-model.number="inputSeconds"
                  type="number"
                  min="0"
                  max="59"
                  class="time-input-enhanced"
                  @input="validateTimeInput"
                  placeholder="00"
                />
                <div class="input-glow"></div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Preset Buttons -->
          <div class="preset-buttons-enhanced">
            <button
              v-for="preset in timePresets"
              :key="preset.label"
              @click="setPresetTime(preset.minutes, preset.seconds)"
              class="preset-btn-enhanced"
              :class="{ 'active': inputMinutes === preset.minutes && inputSeconds === preset.seconds }"
            >
              {{ preset.label }}
            </button>
          </div>
          
          <!-- Quick Adjust Buttons -->
          <div class="quick-adjust">
            <button @click="adjustTime(-5)" class="adjust-btn">-5m</button>
            <button @click="adjustTime(-1)" class="adjust-btn">-1m</button>
            <button @click="resetToDefault" class="adjust-btn reset">Reset</button>
            <button @click="adjustTime(1)" class="adjust-btn">+1m</button>
            <button @click="adjustTime(5)" class="adjust-btn">+5m</button>
          </div>
        </div>
      </div>

      <!-- Main Timer Display -->
      <div class="timer-container liquid-glass-card">
        <div class="timer-content">
          <!-- Progress Circle -->
          <div class="progress-container">
            <svg class="progress-ring" width="280" height="280">
              <circle
                class="progress-ring-circle"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                r="120"
                cx="140"
                cy="140"
                transform="rotate(-90 140 140)"
              />
            </svg>
            <div class="timer-display">
              <div class="timer-time" :class="{ 'urgent': totalSeconds <= 60 }">
                {{ formattedTime }}
              </div>
              <div class="timer-status">
                {{ timerStatus }}
              </div>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="timer-controls">
            <button
              v-if="!isTimerRunning && !hasStarted"
              @click="startTimer"
              class="control-btn primary"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Start Focus
            </button>
            
            <button
              v-if="isTimerRunning"
              @click="pauseTimer"
              class="control-btn warning"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
              Pause
            </button>
            
            <button
              v-if="!isTimerRunning && hasStarted"
              @click="resumeTimer"
              class="control-btn primary"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Resume
            </button>
            
            <button
              @click="resetTimer"
              class="control-btn secondary"
              :disabled="!hasStarted"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Motivational Quote -->
      <div class="quote-container liquid-glass-card mt-8" v-if="currentQuote">
        <div class="quote-content">
          <svg class="quote-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <p class="quote-text">{{ currentQuote }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="text-center mt-8">
        <router-link to="/" class="nav-link">
          ← Back to Collection
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';

export default {
  name: "MedView",
  components: { UniversalBanner },
  data() {
    return {
      totalSeconds: 12 * 60,
      originalTotalSeconds: 12 * 60,
      inputMinutes: 12,
      inputSeconds: 0,
      interval: null,
      isTimerRunning: false,
      hasStarted: false,
      hasVibrated: false,
      circumference: 2 * Math.PI * 120,
      timePresets: [
        { label: '5 min', minutes: 5, seconds: 0 },
        { label: '10 min', minutes: 10, seconds: 0 },
        { label: '15 min', minutes: 15, seconds: 0 },
        { label: '20 min', minutes: 20, seconds: 0 },
        { label: '25 min', minutes: 25, seconds: 0 },
        { label: '30 min', minutes: 30, seconds: 0 }
      ],
      quotes: [
        "The present moment is the only time over which we have dominion.",
        "Peace comes from within. Do not seek it without.",
        "You should sit in meditation for 20 minutes a day, unless you're too busy; then you should sit for an hour.",
        "The mind is everything. What you think you become.",
        "Silence is not empty, it is full of answers.",
        "Breathe in peace, breathe out stress.",
        "In the stillness of your mind, you will find the answers.",
        "Focus on the journey, not on the destination.",
        "Your current position is not your final destination."
      ],
      currentQuote: null
    };
  },
  computed: {
    formattedTime() {
      const minutes = String(Math.floor(this.totalSeconds / 60)).padStart(2, "0");
      const seconds = String(this.totalSeconds % 60).padStart(2, "0");
      return `${minutes}:${seconds}`;
    },
    strokeDashoffset() {
      const progress = (this.originalTotalSeconds - this.totalSeconds) / this.originalTotalSeconds;
      return this.circumference - (progress * this.circumference);
    },
    timerStatus() {
      if (!this.hasStarted) return 'Ready to start';
      if (this.isTimerRunning) return 'Focusing...';
      if (this.totalSeconds === 0) return 'Complete!';
      return 'Paused';
    }
  },
  mounted() {
    this.selectRandomQuote();
  },
  methods: {
    validateTimeInput() {
      if (this.inputMinutes < 1) this.inputMinutes = 1;
      if (this.inputMinutes > 180) this.inputMinutes = 180;
      if (this.inputSeconds < 0) this.inputSeconds = 0;
      if (this.inputSeconds > 59) this.inputSeconds = 59;
    },
    setPresetTime(minutes, seconds) {
      this.inputMinutes = minutes;
      this.inputSeconds = seconds;
    },
    adjustTime(minutes) {
      this.inputMinutes = Math.max(1, Math.min(180, this.inputMinutes + minutes));
    },
    resetToDefault() {
      this.inputMinutes = 12;
      this.inputSeconds = 0;
    },
    startTimer() {
      // Update total seconds from inputs
      this.totalSeconds = (this.inputMinutes * 60) + this.inputSeconds;
      this.originalTotalSeconds = this.totalSeconds;
      this.hasStarted = true;
      this.isTimerRunning = true;
      this.hasVibrated = false;
      
      this.interval = setInterval(() => {
        if (this.totalSeconds > 0) {
          this.totalSeconds--;
          if (this.totalSeconds === 60 && !this.hasVibrated) {
            this.triggerVibration();
            this.hasVibrated = true;
          }
        } else {
          this.completeTimer();
        }
      }, 1000);
    },
    pauseTimer() {
      this.isTimerRunning = false;
      clearInterval(this.interval);
      this.interval = null;
    },
    resumeTimer() {
      if (!this.isTimerRunning) {
        this.isTimerRunning = true;
        this.interval = setInterval(() => {
          if (this.totalSeconds > 0) {
            this.totalSeconds--;
            if (this.totalSeconds === 60 && !this.hasVibrated) {
              this.triggerVibration();
              this.hasVibrated = true;
            }
          } else {
            this.completeTimer();
          }
        }, 1000);
      }
    },
    resetTimer() {
      this.pauseTimer();
      this.totalSeconds = this.originalTotalSeconds;
      this.hasStarted = false;
      this.isTimerRunning = false;
      this.hasVibrated = false;
    },
    completeTimer() {
      this.stopTimer();
      this.triggerVibration();
      this.selectRandomQuote();
    },
    stopTimer() {
      clearInterval(this.interval);
      this.interval = null;
      this.isTimerRunning = false;
    },
    triggerVibration() {
      if ("vibrate" in navigator) {
        navigator.vibrate([300, 200, 300, 200, 300]);
      }
    },
    selectRandomQuote() {
      this.currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }
  },
  beforeUnmount() {
    this.stopTimer();
  },
};
</script>

<style scoped>


.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float var(--delay, 0s) linear infinite;
}

@keyframes float {
  0% {
    opacity: 0;
    transform: translateY(0px) translateX(0px) scale(1);
  }
  25% {
    opacity: 1;
    transform: translateY(-20px) translateX(15px) scale(1.2);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-35px) translateX(-10px) scale(0.8);
  }
  75% {
    opacity: 1;
    transform: translateY(-15px) translateX(20px) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(0px) translateX(0px) scale(1);
  }
}

.bg-gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  top: 60%;
  right: 15%;
  animation-delay: 7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
  bottom: 20%;
  left: 30%;
  animation-delay: 14s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(40px, -40px) scale(1.1) rotate(90deg); }
  50% { transform: translate(-30px, 30px) scale(0.9) rotate(180deg); }
  75% { transform: translate(25px, 15px) scale(1.05) rotate(270deg); }
}

/* Floating Elements */
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
  animation: floatElement 12s ease-in-out infinite;
}

@keyframes floatElement {
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-30px) translateX(20px) rotate(90deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) translateX(-15px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-25px) translateX(25px) rotate(270deg);
    opacity: 0.7;
  }
}

/* Liquid Glass Components */
.liquid-glass-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.liquid-glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-5px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Meditation Icon */
.meditation-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6));
  }
}

/* Enhanced Timer Setup Section */
.timer-setup {
  padding: 32px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.setup-content {
  text-align: center;
}

.setup-title-text {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 22px;
  font-weight: 700;
}

/* Enhanced Time Inputs Container */
.time-inputs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin: 32px 0;
}

/* Enhanced Time Input Groups */
.time-input-group-enhanced {
  text-align: center;
  position: relative;
}

.time-label-enhanced {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 12px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.input-wrapper {
  position: relative;
  display: inline-block;
}

.time-input-enhanced {
  width: 100px;
  height: 70px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: white;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Monaco', 'Menlo', monospace;
  letter-spacing: 2px;
}

.time-input-enhanced:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow:
    0 0 0 4px rgba(59, 130, 246, 0.1),
    0 0 20px rgba(59, 130, 246, 0.3);
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.time-input-enhanced::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
}

/* Input Glow Effect */
.input-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.time-input-enhanced:focus + .input-glow {
  opacity: 1;
}

/* Enhanced Separator */
.time-separator-enhanced {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 32px;
  font-weight: 300;
  margin-top: 20px;
}

.separator-line {
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 2px;
}

/* Enhanced Preset Buttons */
.preset-buttons-enhanced {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.preset-btn-enhanced {
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.preset-btn-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.preset-btn-enhanced:hover::before {
  left: 100%;
}

.preset-btn-enhanced:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.preset-btn-enhanced.active {
  background: rgba(59, 130, 246, 0.2);
  color: rgb(147, 197, 253);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

/* Quick Adjust Buttons */
.quick-adjust {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.adjust-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.adjust-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.adjust-btn.reset {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: rgb(252, 165, 165);
}

.adjust-btn.reset:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

/* Timer Container */
.timer-container {
  padding: 32px;
  text-align: center;
}

.timer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* Progress Ring */
.progress-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 4;
  transition: stroke-dashoffset 0.5s ease-in-out;
}

.progress-ring-circle {
  stroke: url(#gradient);
  filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.3));
}

.timer-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.timer-time {
  font-size: 48px;
  font-weight: 700;
  color: white;
  font-family: 'Monaco', 'Menlo', monospace;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  margin-bottom: 8px;
}

.timer-time.urgent {
  color: #f87171;
  animation: urgentPulse 1s ease-in-out infinite;
}

@keyframes urgentPulse {
  0%, 100% {
    text-shadow: 0 0 20px rgba(248, 113, 113, 0.5);
  }
  50% {
    text-shadow: 0 0 30px rgba(248, 113, 113, 0.8);
  }
}

.timer-status {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 1px;
}

/* Control Buttons */
.timer-controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.control-btn:hover::before {
  left: 100%;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.control-btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.control-btn.primary {
  background: rgba(59, 130, 246, 0.2);
  color: rgb(147, 197, 253);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.control-btn.primary:not(:disabled):hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.control-btn.warning {
  background: rgba(251, 191, 36, 0.2);
  color: rgb(253, 224, 71);
  border: 1px solid rgba(251, 191, 36, 0.3);
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.2);
}

.control-btn.warning:not(:disabled):hover {
  background: rgba(251, 191, 36, 0.3);
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
}

.control-btn.secondary {
  background: rgba(107, 114, 128, 0.2);
  color: rgb(209, 213, 219);
  border: 1px solid rgba(107, 114, 128, 0.3);
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.2);
}

.control-btn.secondary:not(:disabled):hover {
  background: rgba(107, 114, 128, 0.3);
  border-color: rgba(107, 114, 128, 0.5);
  box-shadow: 0 8px 25px rgba(107, 114, 128, 0.3);
}

/* Quote Container */
.quote-container {
  padding: 24px;
  text-align: center;
}

.quote-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.quote-icon {
  width: 32px;
  height: 32px;
  color: rgba(59, 130, 246, 0.6);
  opacity: 0.8;
}

.quote-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  line-height: 1.6;
  max-width: 400px;
  margin: 0;
}

/* Navigation Link */
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: rgb(96, 165, 250);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.15);
  color: rgb(147, 197, 253);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .timer-container {
    padding: 24px;
  }
  
  .timer-time {
    font-size: 36px;
  }
  
  .timer-controls {
    gap: 12px;
  }
  
  .control-btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .preset-buttons {
    gap: 6px;
  }
  
  .preset-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .progress-ring {
    width: 240px;
    height: 240px;
  }
  
  .progress-ring-circle {
    r: 100;
    cx: 120;
    cy: 120;
    transform: rotate(-90 120 120);
  }
  
  .timer-display {
    transform: translate(-50%, -50%);
  }
  
  .time-inputs {
    gap: 12px;
  }
  
  .time-input {
    width: 70px;
    height: 50px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .timer-container {
    padding: 20px;
  }
  
  .timer-time {
    font-size: 32px;
  }
  
  .timer-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .control-btn {
    width: 100%;
    justify-content: center;
  }
  
  .progress-ring {
    width: 200px;
    height: 200px;
  }
  
  .progress-ring-circle {
    r: 80;
    cx: 100;
    cy: 100;
    transform: rotate(-90 100 100);
  }
  
  .time-inputs {
    gap: 8px;
  }
  
  .time-input {
    width: 60px;
    height: 45px;
    font-size: 18px;
  }
}
</style>