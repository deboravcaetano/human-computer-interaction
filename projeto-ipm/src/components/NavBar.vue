<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue' 

const router = useRouter()
const menuItems = router.options.routes.filter(route => route.name)
</script>

<template>
    <nav class="navbar-container">
        <div class="top-section">
            <AppIcon class="main-logo" />
        </div>

        <div class="nav-bar">
            <div class="nav-items">
                <router-link 
                    v-for="route in menuItems" 
                    :key="route.path"
                    :to="route.path"
                    class="nav-link"
                    exact-active-class="active"
                >
                    {{ route.name }}
                </router-link>
            </div>
        </div>
    </nav>
</template>

<style scoped>
    .navbar-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        font-family: Inter, sans-serif;
    }

    .top-section {
        height: 80px;
        background-color: rgb(255, 255, 255);
        width: 100%;
        position: relative;
        padding-left: 40px; 
    }

    .main-logo {
        position: absolute;
        bottom: -40px; 
        z-index: 10;
    }

    .nav-bar {
        background-color: #06104B;
        height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 210px; 
    }

    .nav-items {
        display: flex;
        height: 100%;
        align-items: center;
    }

    .nav-link {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 24px;
        color: white;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .nav-link:hover {
        background-color: #1a2b6d;
    }

    .active {
        background-color: #41548F !important;
    }
</style>