<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import searchIcon from '@/assets/search-icon.svg'
import portugalFlag from '@/assets/flags/portugal-flag.svg'
import franceFlag from '@/assets/flags/france-flag.svg'
import germanyFlag from '@/assets/flags/germany-flag.svg'

type CountryOption = {
  name?: string
  country?: string
  flagSrc?: string
}

type SelectedCountry = {
  name: string
  flagSrc?: string
  locked?: boolean
}

const props = withDefaults(
  defineProps<{
    countries?: CountryOption[]
    modelValue?: string[]
    initialCountries?: string[]
    lockedCountry?: string
    title?: string
    description?: string
  }>(),
  {
    countries: () => [
      { name: 'Portugal', flagSrc: portugalFlag },
      { name: 'França', flagSrc: franceFlag },
      { name: 'Alemanha', flagSrc: germanyFlag },
    ],
    modelValue: undefined,
    initialCountries: () => [],
    lockedCountry: '',
    title: 'Comparar países',
    description: 'Escolha dois países para comparar as suas métricas.',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', countries: string[]): void
  (e: 'compare', countries: string[]): void
  (e: 'back'): void
}>()

const searchQuery = ref('')
const isDropdownOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const selectedCountries = ref<SelectedCountry[]>([])

const normalizedCountries = computed<SelectedCountry[]>(() =>
  props.countries
    .map((country) => ({
      name: country.name ?? country.country ?? '',
      flagSrc: country.flagSrc,
    }))
    .filter((country) => country.name),
)

const selectedNames = computed(() => selectedCountries.value.map((country) => country.name))
const canCompare = computed(() => selectedCountries.value.length === 2)
const canAddCountry = computed(() => selectedCountries.value.length < 2)

const availableCountries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const selected = new Set(selectedNames.value.map((country) => country.toLowerCase()))

  return normalizedCountries.value
    .filter((country) => !selected.has(country.name.toLowerCase()))
    .filter((country) => !query || country.name.toLowerCase().includes(query))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()

      if (query) {
        const startsA = nameA.startsWith(query)
        const startsB = nameB.startsWith(query)
        if (startsA && !startsB) return -1
        if (startsB && !startsA) return 1
      }

      return nameA.localeCompare(nameB)
    })
})

const syncSelectedCountries = () => {
  const nextCountries: SelectedCountry[] = []
  const sourceCountries = props.modelValue ?? props.initialCountries

  if (props.lockedCountry) {
    const match = normalizedCountries.value.find(
      (country) => country.name.toLowerCase() === props.lockedCountry.toLowerCase(),
    )

    nextCountries.push({
      name: match?.name ?? props.lockedCountry,
      flagSrc: match?.flagSrc,
      locked: true,
    })
  }

  sourceCountries.forEach((countryName) => {
    if (nextCountries.length >= 2) return
    if (nextCountries.some((country) => country.name.toLowerCase() === countryName.toLowerCase())) return

    const match = normalizedCountries.value.find(
      (country) => country.name.toLowerCase() === countryName.toLowerCase(),
    )

    nextCountries.push({
      name: match?.name ?? countryName,
      flagSrc: match?.flagSrc,
      locked: false,
    })
  })

  selectedCountries.value = nextCountries.slice(0, 2)
}

const emitSelection = () => {
  emit('update:modelValue', selectedNames.value)
}

const focusSearch = async () => {
  await nextTick()
  searchInput.value?.focus()
}

const openDropdown = () => {
  if (!canAddCountry.value) return
  isDropdownOpen.value = true
  focusSearch()
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const selectCountry = (country: SelectedCountry) => {
  if (!canAddCountry.value) return

  selectedCountries.value.push({ ...country, locked: false })
  searchQuery.value = ''
  emitSelection()

  if (selectedCountries.value.length >= 2) {
    closeDropdown()
    return
  }

  focusSearch()
}

const removeCountry = (countryName: string) => {
  selectedCountries.value = selectedCountries.value.filter(
    (country) => country.locked || country.name !== countryName,
  )
  emitSelection()
  openDropdown()
}

const handleInputFocus = () => {
  openDropdown()
}

const handleInput = () => {
  if (canAddCountry.value) isDropdownOpen.value = true
}

const handleInputKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeDropdown()

  if (event.key === 'Backspace' && !searchQuery.value) {
    const removableCountry = [...selectedCountries.value].reverse().find((country) => !country.locked)
    if (removableCountry) removeCountry(removableCountry.name)
  }
}

const handleCompare = () => {
  if (!canCompare.value) return
  emit('compare', selectedNames.value)
}

const handleClose = () => {
  emit('back')
}

const handleOverlayClick = () => {
  handleClose()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') handleClose()
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})

watch(
  () => [props.lockedCountry, props.modelValue, props.initialCountries, props.countries],
  syncSelectedCountries,
  { immediate: true, deep: true },
)
</script>

<template>
  <Teleport to="body">
    <section
      class="compare-popup"
      aria-labelledby="compare-popup-title"
      role="dialog"
      aria-modal="true"
      @click.self="handleOverlayClick"
    >
      <div class="compare-popup__content">
        <div class="compare-popup__card" @click="closeDropdown">
          <header class="compare-popup__header">
            <h2 id="compare-popup-title" class="compare-popup__title">{{ title }}</h2>
            <p class="compare-popup__description">{{ description }}</p>
          </header>

          <div class="compare-popup__field" @click.stop>
            <label class="compare-popup__label" for="country-search">Países</label>

            <div
              class="compare-popup__input-shell"
              :class="{ 'compare-popup__input-shell--focused': isDropdownOpen }"
              @click="openDropdown"
            >
              <span
                v-for="country in selectedCountries"
                :key="country.name"
                class="compare-popup__chip"
                :class="{ 'compare-popup__chip--locked': country.locked }"
              >
                <span class="compare-popup__chip-text">{{ country.name }}</span>
                <button
                  v-if="!country.locked"
                  class="compare-popup__chip-remove"
                  type="button"
                  :aria-label="`Remover ${country.name}`"
                  @click.stop="removeCountry(country.name)"
                >
                  &times;
                </button>
              </span>

              <input
                id="country-search"
                ref="searchInput"
                v-model="searchQuery"
                class="compare-popup__input"
                type="search"
                :disabled="!canAddCountry"
                :placeholder="selectedCountries.length ? '' : 'Pesquisar país'"
                autocomplete="off"
                @focus="handleInputFocus"
                @input="handleInput"
                @keydown="handleInputKeydown"
              />

              <img class="compare-popup__search-icon" :src="searchIcon" alt="" aria-hidden="true" />
            </div>

            <transition name="compare-popup__dropdown">
              <div
                v-if="isDropdownOpen && canAddCountry"
                class="compare-popup__dropdown"
                role="listbox"
                aria-label="Escolher país"
              >
                <button
                  v-for="country in availableCountries"
                  :key="country.name"
                  class="compare-popup__option"
                  type="button"
                  role="option"
                  @click="selectCountry(country)"
                >
                  <img
                    v-if="country.flagSrc"
                    class="compare-popup__option-flag"
                    :src="country.flagSrc"
                    :alt="`Bandeira de ${country.name}`"
                  />
                  <span>{{ country.name }}</span>
                </button>

                <p v-if="!availableCountries.length" class="compare-popup__empty">Sem resultados.</p>
              </div>
            </transition>
          </div>
          <div class="compare-popup__actions">
            <button class="compare-popup__action" type="button" @click="handleClose">
              <span aria-hidden="true">&lt;</span>
              <span>Voltar</span>
            </button>
            <button
              class="compare-popup__action compare-popup__action--primary"
              type="button"
              :disabled="!canCompare"
              @click="handleCompare"
            >
              <span>Comparar</span>
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style scoped>
.compare-popup {
  position: fixed;
  inset: 0;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 24px;
  overflow-y: auto;
  background: rgba(16, 29, 66, 0.18);
  backdrop-filter: blur(7px);
  z-index: 1000;
  font-family: var(--font-primary);
}

.compare-popup__content {
  width: min(100%, 416px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compare-popup__card {
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 26px 16px 10px;
  border: 1px solid var(--text-gray-light);
  border-radius: 8px;
  background: var(--bg-gray);
  box-shadow: 0 14px 24px rgba(16, 29, 66, 0.22);
}

.compare-popup__header {
  margin-bottom: 32px;
}

.compare-popup__title {
  margin: 0 0 4px;
  color: var(--text-black);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
}

.compare-popup__description {
  margin: 0;
  color: var(--text-gray);
  font-size: 0.68rem;
  font-weight: 500;
  line-height: 1.35;
}

.compare-popup__field {
  position: relative;
}

.compare-popup__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.compare-popup__input-shell {
  min-height: 38px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  box-sizing: border-box;
  padding: 5px 38px 5px 6px;
  border: 1px solid #c8c8c8;
  border-radius: 10px;
  background: var(--bg-white);
  cursor: text;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.compare-popup__input-shell--focused,
.compare-popup__input-shell:focus-within {
  border-color: var(--bg-blue-light);
  box-shadow: 0 0 0 3px rgba(64, 82, 134, 0.14);
}

.compare-popup__chip {
  max-width: 100%;
  min-height: 27px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--text-gray-dark);
  color: var(--text-white);
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1;
}

.compare-popup__chip--locked {
  background: var(--bg-blue-dark);
}

.compare-popup__option-flag {
  width: 18px;
  height: 13px;
  flex: 0 0 auto;
  border-radius: 2px;
  object-fit: cover;
}

.compare-popup__chip-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compare-popup__chip-remove {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.compare-popup__chip-remove:hover,
.compare-popup__chip-remove:focus-visible {
  background: rgba(255, 255, 255, 0.16);
  outline: none;
}

.compare-popup__input {
  min-width: 7ch;
  flex: 1 1 90px;
  height: 26px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-black);
  font: inherit;
  font-size: 0.86rem;
}

.compare-popup__input::placeholder {
  font-size: 0.82rem;
}

.compare-popup__input:disabled {
  cursor: default;
}

.compare-popup__input::-webkit-search-cancel-button {
  appearance: none;
}

.compare-popup__search-icon {
  position: absolute;
  right: 11px;
  top: 11px;
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.compare-popup__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  max-height: 112px;
  overflow: auto;
  padding: 5px;
  border: 1px solid var(--text-gray-light);
  border-radius: 6px;
  background: var(--bg-white);
  box-shadow: 0 12px 26px rgba(16, 29, 66, 0.18);
  z-index: 8;
}

.compare-popup__option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--text-black);
  font: inherit;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
}

.compare-popup__option:hover,
.compare-popup__option:focus-visible {
  background: var(--bg-gray);
  outline: none;
}

.compare-popup__empty {
  margin: 0;
  padding: 8px;
  color: var(--text-gray);
  font-size: 0.82rem;
}

.compare-popup__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 18px;
}

.compare-popup__action {
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 2px;
  border: 0;
  background: transparent;
  color: var(--text-gray-dark);
  font-family: var(--font-primary);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 150ms ease, opacity 150ms ease;
}

.compare-popup__action--primary {
  color: var(--bg-blue-dark);
}

.compare-popup__action:hover:not(:disabled),
.compare-popup__action:focus-visible {
  color: var(--bg-blue);
  outline: none;
}

.compare-popup__action:focus-visible {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.compare-popup__action:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.compare-popup__dropdown-enter-active,
.compare-popup__dropdown-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
}

.compare-popup__dropdown-enter-from,
.compare-popup__dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 520px) {
  .compare-popup {
    align-items: stretch;
    padding: 16px;
  }

  .compare-popup__content {
    width: 100%;
    margin: auto 0;
  }

  .compare-popup__card {
    min-height: 292px;
    padding: 22px 14px 10px;
  }

  .compare-popup__header {
    margin-bottom: 24px;
  }

  .compare-popup__actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: auto;
    padding-top: 16px;
  }
}
</style>
