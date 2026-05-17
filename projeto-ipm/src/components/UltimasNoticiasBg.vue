<template>
  <div class="yellow-section">
    <slot></slot>
  </div>
</template>

<style scoped>
.yellow-section {
  width: 100%;
  height: 730px; 
  padding: 0 24px;
  background-color: var(--bg-yellow); 
  position: relative; 
  overflow: hidden; 
  box-sizing: border-box;
  
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: 
    url('@/assets/cloud-1.svg'), 
    url('@/assets/cloud-2.svg'), 
    url('@/assets/cloud-3.svg'), 

    url('@/assets/cloud-1.svg'), 
    url('@/assets/cloud-2.svg'), 
    url('@/assets/cloud-3.svg'), 

    url('@/assets/star.svg'), 
    url('@/assets/star.svg'), 
    url('@/assets/star.svg'), 
    url('@/assets/star.svg'); 
    
  background-repeat: no-repeat;

  background-position: 
    /* Nuvens */
    left 100px bottom -9%,   
    left 28px bottom -5%,      
    left -30px bottom -30px, 

    left 45px top -60px,   
    left 20px top -50px,      
    left -40px top -65px, 

    /* Estrelas */
    right 4% top 36%,
    right 31% top 109%,
    right 26% bottom 15%,
    left 105% top 22%;  
        
  background-size: 
    /* Nuvens */
    100px auto,           
    100px auto,              
    100px auto,  

    150px auto,           
    150px auto,              
    150px auto,  

    /* Estrelas */
    160px 160px,             
    160px 160px,            
    160px 160px,           
    160px 160px;              
}

@media (max-width: 768px) {
  .yellow-section {
    height: auto;
    min-height: 620px;
    padding: 72px 24px;
    background-position: 
      left 20px bottom -5%, left 10px bottom -2%, left -20px bottom -10px, 
      left 20px top -30px, left 10px top -20px, left -20px top -35px, 
      right 4% top 20%, right 20% top 80%, right 15% bottom 10%, left 90% top 15%;
    background-size: 
      80px auto, 80px auto, 80px auto,
      110px auto, 110px auto, 110px auto,
      110px 110px, 110px 110px, 110px 110px, 110px 110px;
  }
}

@media (max-width: 480px) {
  .yellow-section {
    min-height: 560px;
    padding: 56px 16px;
    background-position: 
      left -10px bottom -5%, left -20px bottom -2%, transparent, 
      left -10px top -20px, left -20px top -10px, transparent, 
      right 5% top 15%, transparent, right 10% bottom 5%, transparent;
    background-size: 
      60px auto, 60px auto, 0px,
      80px auto, 80px auto, 0px,
      70px 70px, 0px, 70px 70px, 0px;
  }
}
</style>
