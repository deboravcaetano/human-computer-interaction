<script>
export default {
  name: 'Top3Card',
  props: {
    country: { type: String, required: true },
    position: { type: Number, required: true },
    progress: { type: Number, required: true },
    projects: { type: Number, required: true },
    total: { type: [String, Number], required: true }
  },
  computed: {
    countryImage() {
      const fileName = this.country
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

      return new URL(`../assets/flags/${fileName}-flag.svg`, import.meta.url).href;
    },
    progressSafe() {
      return Math.max(0, Math.min(100, Number(this.progress) || 0));
    },
    accentClass() {
      if (this.position === 1) return 'accent-gold';
      if (this.position === 2) return 'accent-silver';
      if (this.position === 3) return 'accent-bronze';
      return 'accent-default';
    }
  }
}
</script>

<template>
  <div class="card-container">
    <div :class="['accent-bar', accentClass]"></div>

    <div class="card-content">
      <div class="card-head">
        <div class="position">{{ position }}º</div>

        <div class="country-wrap">
          <img :src="countryImage" :alt="country" class="flag" />
          <div class="country-copy">
            <h2 class="country-title">{{ country }}</h2>
            <p class="country-subtitle">Execução do plano</p>
          </div>
        </div>
      </div>

      <div class="progress-block">
        <div class="progress-meta">
          <span class="progress-label">Progresso</span>
          <span class="progress-value">{{ progressSafe }}%</span>
        </div>

        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${progressSafe}%` }"
          ></div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Projetos ativos</span>
          <span class="stat-value">{{ projects }}</span>
        </div>

        <div class="stat-item">
          <span class="stat-label">Total recebido</span>
          <span class="stat-value">€{{ total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(15, 38, 92, 0.08);
  box-shadow: 0 10px 28px rgba(15, 38, 92, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 34px rgba(15, 38, 92, 0.12);
}

.accent-bar {
  width: 8px;
  flex-shrink: 0;
}

.accent-gold {
  background: #d7a400;
}

.accent-silver {
  background: #aeb6c5;
}

.accent-bronze {
  background: #b66b3d;
}

.accent-default {
  background: #0f2f7a;
}

.card-content {
  flex: 1;
  padding: 22px;
  color: #0b1f4b;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

.card-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.position {
  min-width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #eef3fb;
  color: #0f2f7a;
  font-weight: 800;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.country-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.flag {
  width: 50px;
  height: 34px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid rgba(15, 38, 92, 0.08);
}

.country-copy {
  min-width: 0;
}

.country-title {
  color: #0b1f4b;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 4px 0;
  line-height: 1.1;
}

.country-subtitle {
  margin: 0;
  color: #66738f;
  font-size: 0.9rem;
}

.progress-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.progress-label {
  color: #66738f;
  font-weight: 600;
  font-size: 0.9rem;
}

.progress-value {
  color: #0b1f4b;
  font-weight: 800;
  font-size: 1.15rem;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 47, 122, 0.10);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #0f2f7a;
  transition: width 0.5s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-item {
  padding: 14px;
  border-radius: 14px;
  background: #f8faff;
  border: 1px solid rgba(15, 47, 122, 0.06);
}

.stat-label {
  display: block;
  color: #66738f;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  color: #0b1f4b;
  font-size: 1.05rem;
  font-weight: 800;
}

@media (max-width: 768px) {
  .card-content {
    padding: 18px;
  }

  .country-title {
    font-size: 1.15rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-head {
    align-items: center;
  }

  .flag {
    width: 46px;
    height: 30px;
  }
}
</style>