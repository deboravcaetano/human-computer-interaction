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
    <div class="info-card">
        <div class="info-card-content"> 
            <h2>{{ title }}</h2>
            <p>{{ description }}</p>
        </div>
    </div>
</template>

<style scoped>
    .info-card {
        height: v-bind(height);
        width: v-bind(width);
        box-sizing: border-box;
        overflow: hidden;
        background-color: #fafafa;
        border: 1px solid #e4e4e4;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.18);
        border-radius: 12px;
        padding: 16px;
    }

    .info-card-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.75rem;
        height: 100%;
        box-sizing: border-box;
        padding: 0px;
    }
    .info-card-content h2 {
        font-size: 20px;
        font-family: Inter, sans-serif;
        font-weight: 700;
        color: #7E7E7E;
        margin: 0;
    }
    .info-card-content p {
        font-size: 37px;
        font-family: Inter, sans-serif;
        font-weight: 700;
        color: #101d42;
        margin: 0;
    }
</style>