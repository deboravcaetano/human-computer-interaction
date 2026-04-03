<template>
  <div class="yellow-section">
    </div>
</template>

<style scoped>
.yellow-section {
  width: 100%;
  height: 730px; 
  background-color: var(--bg-yellow); 
  position: relative; 
  overflow: hidden; 
  
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


</style>