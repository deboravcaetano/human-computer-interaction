<script>
import europeFlag from '@/assets/europe-flag.svg';
export default {
  name: 'AppLogo',
  data() {
    return {
      flagSrc: europeFlag
    }
  }
}
</script>

<template>
  <div class="logo-container">
    <div class="background-bars">
      <div class="bar" style="height: 70%;"></div>
      <div class="bar" style="height: 60%;"></div>
      <div class="bar" style="height: 70%;"></div>
      <div class="bar" style="height: 80%;"></div>
      <div class="bar" style="height: 95%;"></div>
      <div class="bar" style="height: 90%;"></div>
      <div class="bar" style="height: 100%;"></div>
      <div class="bar" style="height: 79%;"></div>
      <div class="bar" style="height: 100%;"></div>
      <div class="bar" style="height: 70%;"></div>
      <div class="bar" style="height: 75%;"></div>
      <div class="bar" style="height: 70%;"></div>
    </div>
    <div class="flag-card">
      <img :src="flagSrc" alt="EU Flag" class="flag-img" />
    </div>
  </div>
</template>

<style scoped>

.logo-container {
  position: relative;
  width: 140px;
  height: 100px;
  display: flex;
  align-items: flex-end; 
  background-color: white;
}

.background-bars {
  position: absolute;
  bottom: 0;        
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  z-index: 1;
}

.bar {
  width: 10px;
  background-color: #EFEFEF;
}

.flag-card {
  position: absolute;
  bottom: 0;       
  margin-left: 44px;        
  z-index: 2;
  width: 90px;
  height: 60px;
  background-color: #003399;
  border-radius: 3px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.flag-img {
  width: 80%;
  height: auto;
}

</style>