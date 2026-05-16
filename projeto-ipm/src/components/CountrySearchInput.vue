<script setup lang="ts">
import { computed, nextTick, ref, onMounted, onBeforeUnmount } from 'vue'

type CountryOption = {
  name: string
  flagSrc?: string
}

const props = withDefaults(
  defineProps<{
    countries?: CountryOption[]
    modelValue?: string
    placeholder?: string
  }>(),
  {
    countries: () => [],
    modelValue: '',
    placeholder: 'Pesquisar país'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', country: CountryOption): void
}>()

const searchQuery = ref(props.modelValue || '')
const isDropdownOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

const filteredCountries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []
  return props.countries
    .filter((c) => c.name.toLowerCase().includes(query))
    .sort((a, b) => {
      const startsA = a.name.toLowerCase().startsWith(query)
      const startsB = b.name.toLowerCase().startsWith(query)
      if (startsA && !startsB) return -1
      if (startsB && !startsA) return 1
      return a.name.localeCompare(b.name)
    })
})

const onInput = () => {
  emit('update:modelValue', searchQuery.value)
  isDropdownOpen.value = searchQuery.value.trim().length > 0
}

const selectCountry = (country: CountryOption) => {
  searchQuery.value = country.name
  isDropdownOpen.value = false
  emit('update:modelValue', country.name)
  emit('select', country)
}

const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isDropdownOpen.value = false
    searchQuery.value = ''
    emit('update:modelValue', '')
  }
}

const clearInput = () => {
  searchQuery.value = ''
  isDropdownOpen.value = false
  emit('update:modelValue', '')
  nextTick(() => inputRef.value?.focus())
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <div class="country-search" ref="wrapperRef">
    <div class="country-search__shell" :class="{ 'country-search__shell--open': isDropdownOpen }">
      <input
        ref="inputRef"
        v-model="searchQuery"
        class="country-search__input"
        type="text"
        :placeholder="placeholder"
        autocomplete="off"
        @input="onInput"
        @keydown="handleKeydown"
      />
      <button
        v-if="searchQuery"
        class="country-search__clear"
        type="button"
        aria-label="Limpar"
        @click="clearInput"
      >
        &times;
      </button>
    </div>

    <transition name="dropdown">
      <div
        v-if="isDropdownOpen && filteredCountries.length"
        class="country-search__dropdown"
        role="listbox"
      >
        <button
          v-for="country in filteredCountries"
          :key="country.name"
          class="country-search__option"
          type="button"
          role="option"
          @click="selectCountry(country)"
        >
          <img
            v-if="country.flagSrc"
            class="country-search__flag"
            :src="country.flagSrc"
            :alt="`Bandeira de ${country.name}`"
          />
          <span>{{ country.name }}</span>
        </button>
      </div>
      <div
        v-else-if="isDropdownOpen && searchQuery && !filteredCountries.length"
        class="country-search__dropdown"
      >
        <p class="country-search__empty">Sem resultados.</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.country-search {
  position: relative;
  width: 100%;
}

.country-search__shell {
  display: flex;
  align-items: center;
  height: 36px;
  box-sizing: border-box;
  padding: 0 8px;
  border: 1px solid #c8c8c8;
  border-radius: 8px;
  background: #fff;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.country-search__shell--open,
.country-search__shell:focus-within {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
}

.country-search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  font-family: var(--font-primary);
  color: var(--text-gray-dark);
}

.country-search__input::placeholder {
  color: #aaa;
}

.country-search__clear {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #aaa;
  line-height: 1;
  padding: 0 2px;
  transition: color 150ms ease;
}

.country-search__clear:hover {
  color: #555;
}

.country-search__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 180px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  z-index: 50;
}

.country-search__option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border: none;
  border-radius: 5px;
  background: transparent;
  font-size: 12px;
  font-family: var(--font-primary);
  color: var(--text-gray-dark);
  text-align: left;
  cursor: pointer;
  transition: background 120ms ease;
}

.country-search__option:hover {
  background: #f0f4ff;
}

.country-search__flag {
  width: 18px;
  height: 13px;
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}

.country-search__empty {
  margin: 0;
  padding: 8px;
  font-size: 12px;
  color: #aaa;
  font-family: var(--font-primary);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>