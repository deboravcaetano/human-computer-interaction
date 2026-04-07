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
    background-color: var(--bg-blue-dark);
    border-radius: 10px;
    padding: 20px;
    width: 400px; 
    height: 234px;
    color: white;
    font-family: sans-serif;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.card-header {
    background-color: #283C74;
    display: flex;
    align-items: center;
    width: 370px;           
    height: 38px;          
    
    padding: 0 10px;      
    border-radius: 5px;
    margin-bottom: 40px;   
    box-sizing: border-box; /* Garante que o padding não aumente o width/height */
}

.flag {
    width: 67px;           
    height: 45px;           
    margin-right: 15px;
    border-radius: 2px;
}

.country-title {
    color: var(--bg-yellow); 
    font-size: 1.3rem;     
    margin-left: 30px;
    font-weight: bold;
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.data-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.label {
    color: #0B85FF; 
    font-weight: bold;
}

.value {
    color: #0B85FF;
    font-weight: bold;
    font-size: 1rem;
}
</style>