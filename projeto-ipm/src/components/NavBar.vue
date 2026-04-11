<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue' 

const router = useRouter()
const menuItems = router.getRoutes().filter(route => !route.meta.hideInNavbar);

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}
</script>

<template>
    <nav class="navbar-container">
        <div class="top-section">
            <router-link to="/" @click="closeMenu">
                <AppIcon class="main-logo" />
            </router-link>

            <button 
                class="hamburger" 
                @click="toggleMenu" 
                :class="{ 'is-active': isMenuOpen }"
                aria-label="Menu"
                :aria-expanded="isMenuOpen"
            >
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
            </button>
        </div>

        <div class="nav-bar" :class="{ 'menu-open': isMenuOpen }">
            <div class="nav-items">
                <router-link 
                    v-for="page in menuItems" 
                    :key="page.path"
                    :to="page.path"
                    class="nav-link"
                    exact-active-class="active"
                    @click="closeMenu"
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
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .main-logo {
        position: absolute;
        bottom: -35px; 
        z-index: 20;
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
    }

    .nav-link:hover {
        background-color: var(--bg-blue);
    }

    .active {
        background-color: var(--bg-blue-light) !important;
    }

    .hamburger {
        display: none;
        cursor: pointer;
        background: none;
        border: none;
        padding: 10px;
        margin-right: 20px;
        z-index: 30;
        position: relative;
        width: 45px;
        height: 45px;
    }

    .hamburger .line {
        display: block;
        width: 25px;
        height: 3px;
        margin: 5px auto;
        background-color: var(--bg-blue-dark);
    }

    /* Responsividade */
    @media (max-width: 768px) {
        .hamburger {
            display: block; 
        }

        /* Tornar o hamburguer num X */
        .hamburger.is-active .line:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .hamburger.is-active .line:nth-child(2) {
            opacity: 0; 
        }

        .hamburger.is-active .line:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        .nav-bar {
            display: none;
            padding-left: 0;
            height: auto;
            flex-direction: column;
            position: absolute;
            top: 85px;
            left: 0;
            z-index: 15;
            width: 100%;
        }

        .nav-bar.menu-open {
            display: flex; 
            padding-bottom: 20px;
        }

        .nav-items {
            flex-direction: column;
            width: 100%;
        }

        .nav-link {
            width: 100%;
            padding: 15px 40px;
            justify-content: center;
        }

        .main-logo {
            bottom: 10px;
            position: relative;
        }
    }
</style>