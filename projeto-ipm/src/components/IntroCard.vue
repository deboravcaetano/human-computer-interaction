<script>
    export default {
        name: 'IntroCard',
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
                default: '120px'
            },
            width: {
                type: String,
                default: '100%'
            }
        }
    }
</script>

<template>
    <div class="intro-card" :style="{ height: height, width: width }">
        <div class="intro-card-content"> 
            <h2 class="title">{{ title }}</h2>
            <p class="description">{{ description }}</p>
        </div>
    </div>
</template>

<style scoped>
    .intro-card{
        background-color: var(--bg-blue);
        padding: 16px;        
        min-height: 120px; 
    }

    .intro-card-content{
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .description {
        font-family: var(--font-primary);
        font-size: 17px;
        color: white;
        padding-left: 25px;
        max-width: 600px;
        padding-top: 7px;
    }

    .title {
        font-family: var(--font-secondary);
        font-size: 28px;
        font-weight: bold;
        color: var(--bg-yellow);
        padding-left: 25px;
        padding-top: 130px;
        max-width: 600px;
        line-height: 0.9;
    }

</style>