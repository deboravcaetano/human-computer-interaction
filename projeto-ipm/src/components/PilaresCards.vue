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
            <img :src="pilarImage" :alt="pilar" class="pilar-img"/>
            <h2 class="pilar-title">{{ title }}</h2>
        </div>
    </div>

</template>


<style scoped>

.exterior-card {
    background-color: rgb(241, 238, 238);
    border-radius: 10px;
    padding: 13px;
    height: 162px;
    width: 339px;
    margin: 10px;
    border: 1px solid #d1d1d1aa;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.18);
}


.interior-card {
    background-color: rgb(218, 218, 229);
    border-radius: 8px;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding: 25px;
    gap: 10px;
}


.pilar-img {
    height: 35px;
    width: auto;
}


.pilar-title {
    color: rgb(41, 41, 41); 
    font-size: 1.3rem; 
    font-weight: bold;
    font-family: var(--font-primary);
    margin-top: 10px;
}

</style>