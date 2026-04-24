<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue' 
import DropdownMenu from './DropdownMenu.vue'

const router = useRouter()
const menuItems = router.getRoutes().filter(route => !route.meta.hideInNavbar);

const isMenuOpen = ref(false)
const isExecucaoDropdownOpen = ref(false)
const isExecucaoHovered = ref(false)
const navRef = ref<HTMLElement | null>(null)

const isExecucaoActive = computed(() => route.path === '/execucao')
const isExecucaoDropdownVisible = computed(() => isExecucaoDropdownOpen.value || isExecucaoHovered.value)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value

    if (!isMenuOpen.value) {
        isExecucaoDropdownOpen.value = false
    }
}

const toggleExecucaoDropdown = () => {
    isExecucaoDropdownOpen.value = !isExecucaoDropdownOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
    isExecucaoDropdownOpen.value = false
    isExecucaoHovered.value = false
}

const setExecucaoHover = (value: boolean) => {
    isExecucaoHovered.value = value
}

const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as Node | null

    if (!target || !navRef.value?.contains(target)) {
        isExecucaoDropdownOpen.value = false
        isExecucaoHovered.value = false
    }
}

onMounted(() => {
    window.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
    window.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
    <nav ref="navRef" class="navbar-container">
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
                <template v-for="page in menuItems" :key="page.path">
                    <div
                        v-if="page.name === 'Execução'"
                        class="nav-item-with-dropdown"
                        @mouseenter="setExecucaoHover(true)"
                        @mouseleave="setExecucaoHover(false)"
                    >
                        <button
                            class="nav-link nav-link--button"
                            :class="{ active: isExecucaoActive }"
                            type="button"
                            @click.stop="toggleExecucaoDropdown"
                        >
                            <span>{{ page.name }}</span>
                            <img 
                                src="@/assets/arrow-down.svg" 
                                alt="Arrow" 
                                class="dropdown-arrow" 
                                :class="{ 'dropdown-arrow--open': isExecucaoDropdownVisible }"
                            />
                        </button>

                        <Transition name="dropdown-fade-slide">
                            <div v-if="isExecucaoDropdownVisible" class="nav-dropdown">
                                <DropdownMenu />
                            </div>
                        </Transition>
                    </div>

                    <router-link
                        v-else
                        :to="page.path"
                        class="nav-link"
                        exact-active-class="active"
                        @click="closeMenu"
                    >
                        {{ page.name }}
                    </router-link>
                </template>
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

    .nav-item-with-dropdown {
        position: relative;
        height: 100%;
        display: flex;
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

    .nav-link--button {
        border: 0;
        background: transparent;
        font-family: inherit;
        cursor: pointer;
        gap: 0.4rem;
    }

    .dropdown-arrow {
        width: 10px;
        height: 10px;
        transition: transform 180ms ease;
    }

    .dropdown-arrow--open {
        transform: rotate(180deg);
    }

    .nav-dropdown {
        position: absolute;
        left: 0;
        top: 100%;
        padding-top: 4px;
        z-index: 40;
    }

    .dropdown-fade-slide-enter-active,
    .dropdown-fade-slide-leave-active {
        transition: opacity 220ms ease, transform 220ms ease;
    }

    .dropdown-fade-slide-enter-from,
    .dropdown-fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-8px);
    }

    .dropdown-fade-slide-enter-to,
    .dropdown-fade-slide-leave-from {
        opacity: 1;
        transform: translateY(0);
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

        .nav-item-with-dropdown {
            width: 100%;
            height: auto;
            flex-direction: column;
            align-items: center;
        }

        .nav-link {
            width: 100%;
            padding: 15px 40px;
            justify-content: center;
        }

        .nav-dropdown {
            position: static;
            margin-top: 12px;
            padding-top: 0;
            width: min(320px, calc(100% - 1.5rem));
        }

        .main-logo {
            bottom: 10px;
            position: relative;
        }
    }
</style>