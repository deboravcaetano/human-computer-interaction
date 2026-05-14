<script>
export default {
  name: 'InfoCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    height: {
      type: String,
      default: '130px'
    },
    width: {
      type: String,
      default: '340px'  
    },
    backgroundColor: {
      type: String,
      default: '#fafafa' 
    },
    borderColor: {
      type: String,
      default: '#e4e4e4'
    }
  }
}
</script>

<template>
  <div class="info-card">
    <div class="info-card-content"> 
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.info-card {
  width: v-bind(width);
  height: v-bind(height);
  box-sizing: border-box;
  background-color: v-bind(backgroundColor);
  border: 1px solid v-bind(borderColor);
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12); 
  border-radius: 16px; 
  padding: 24px 32px; 
  display: flex; 
  align-items: center;
  transition: all 0.3s ease; 
  
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.2);
}

.info-card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: auto;
}

.info-card-content h2 {
  font-size: clamp(16px, 2.5vw, 20px); 
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #666;
  margin: 0;
  line-height: 1.2;
}

.info-card-content p {
  font-size: clamp(28px, 6vw, 40px); 
  font-family: 'Inter', sans-serif;
  font-weight: 800; 
  color: #101d42;
  margin: 0;
  line-height: 1.1;
}

@media (max-width: 768px) {
  .info-card {
    width: 100% !important; 
    max-width: 340px;
    padding: 20px 24px;
  }
}
</style>