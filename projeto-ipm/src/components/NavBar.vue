<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue' 

const router = useRouter()
const menuItems = router.options.routes.filter(route => route.name)
</script>

<template>
    <nav class="navbar-container">
        <div class="top-section">
            <router-link to="/">
                <AppIcon class="main-logo" />
            </router-link>
        </div>

        <div class="nav-bar">
            <div class="nav-items">
                <router-link 
                    v-for="page in menuItems" 
                    :key="page.path"
                    :to="page.path"
                    class="nav-link"
                    exact-active-class="active"
                >
                    {{ page.name }}
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
        height: 85px;
        background-color: rgb(255, 255, 255);
        width: 100%;
        position: relative;
        padding-left: 40px; 
    }

    .main-logo {
        position: absolute;
        bottom: -35px; 
        z-index: 10;
    }

    .nav-bar {
        background-color: var(--bg-blue-dark);
        height: 35px;
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
        padding: 0 35px;
        color: white;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .nav-link:hover {
        background-color: var(--bg-blue);
    }

    .active {
        background-color: var(--bg-blue-light) !important;
    }
</style>