<script>

export default {
    name: 'PilaresCard',
    props: {
        title: {
            type: String,
            required: true
        },
        pilar: {
            type: String,
            required: true

        },
        percentage: {
            type: Number,
            default: 50.0
        }
    },
    computed: {
        pilarImage() {
            const fileName = this.pilar.toLowerCase();
            
            return new URL(`../assets/pilares/pilar-${fileName}.svg`, import.meta.url).href;
        }
    }
}



</script>

<template>
    <div class="exterior-card">
        <div class="interior-card">
            <div class="card-header">
                <img :src="pilarImage" :alt="pilar" class="pilar-img"/>
                <h2 class="pilar-title">{{ title }}</h2>
            </div>
            <div class="progress-section">
                <span class="percentage">{{ percentage.toString().replace('.', ',') }}%</span>
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

.exterior-card {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 10px;
    height: 140px;
    width: 320px;
    margin: 10px;
    border: 1px solid #e0e0e0;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.exterior-card:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.interior-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
justify-content: flex-start;
gap: 22px;
    padding: 15px 20px;
    box-sizing: border-box;
}

.card-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
}

.pilar-img {
height: 25px;
    width: auto;
}

.pilar-title {
    color: rgb(0, 0, 0); 
font-size: 1rem; 
    font-weight: bold;
    font-family: var(--font-primary);
    margin: 0;
    line-height: 1.2;
}

.progress-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.percentage {
    font-family: var(--font-primary);
    font-size: 0.75rem;
    color: #999;
    font-weight: bold;
    margin-bottom: -2px; /* Pull text slightly closer to the bar */
}

.progress-bar {
    width: 100%;
    height: 6px;
    background-color: #d8d8d8;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #1a2a5e; /* Match the dark blue */
    border-radius: 3px;
}


</style>