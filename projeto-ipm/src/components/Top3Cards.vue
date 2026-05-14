<script>
export default {
    name: 'Top3Card',
    props: {
        country: { type: String, required: true }, 
        position: { type: Number, required: true },
        progress: { type: Number, required: true },
        projects: { type: Number, required: true },
        total: { type: String, required: true } 
    },
    computed: {
        countryImage() {
            const fileName = this.country.toLowerCase();
            
            return new URL(`../assets/flags/${fileName}-flag.svg`, import.meta.url).href;
        }
    }
}
</script>

<template>
    <div class="card-container">
        <div class="card-header">
            <img :src="countryImage" :alt="country" class="flag" />
            <h2 class="country-title">{{ position }}º {{ country }}</h2>
        </div>

        <div class="card-body">
            <div class="data-row">
                <span class="label">Progresso do plano:</span>
                <span class="value">{{ progress }}%</span>
            </div>
            <div class="data-row">
                <span class="label">Projetos ativos:</span>
                <span class="value">{{ projects }}</span>
            </div>
            <div class="data-row">
                <span class="label">Total recebido:</span>
                <span class="value">€{{ total }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-container {
  background-color: var(--bg-blue-dark, #1a365d);
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  min-height: 220px;
  color: white;
  font-family: 'Roboto', sans-serif;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

@media (max-width: 1024px) {
  .card-container {
    width: 340px;
    padding: 20px;
  }
}


@media (max-width: 768px) {
  .card-container {
    width: 320px;
    min-height: 200px;
  }
  
  .card-header {
    padding: 10px 16px;
  }
  
  .flag {
    width: 40px;
    height: 28px;
  }
  
  .country-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .card-container {
    width: 100%;
    max-width: 340px;
    padding: 20px;
  }
  
  .flag {
    width: 36px;
    height: 24px;
    margin-right: 12px;
  }
  
  .country-title {
    font-size: 1rem;
  }
  
  .value {
    font-size: 1rem;
  }
}

.card-header {
  background-color: #283C74;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-sizing: border-box;
}

.flag {
  width: 48px;
  height: 32px;
  margin-right: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.country-title {
  color: var(--bg-yellow, #FFD700); 
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #0B85FF; 
  font-weight: 600;
  font-size: 0.95rem;
}

.value {
  color: #0B85FF;
  font-weight: 700;
  font-size: 1.1rem;
}
</style>