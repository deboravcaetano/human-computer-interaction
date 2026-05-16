<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CountrySearchInput from '@/components/CountrySearchInput.vue'
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
      { name: 'Alemanha', flagSrc: germanyFlag }
    ],
    modelValue: undefined,
    initialCountries: () => [],
    lockedCountry: '',
    title: 'Comparar países',
    description: 'Escolha dois países para comparar as suas métricas.'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', countries: string[]): void
  (e: 'compare', countries: string[]): void
  (e: 'back'): void
}>()

const selectedCountries = ref<SelectedCountry[]>([])
const searchValue = ref('')

const normalizedCountries = computed<SelectedCountry[]>(() =>
  props.countries
    .map((c) => ({ name: c.name ?? c.country ?? '', flagSrc: c.flagSrc }))
    .filter((c) => c.name)
)

const selectedNames = computed(() => selectedCountries.value.map((c) => c.name))
const canCompare = computed(() => selectedCountries.value.length === 2)
const canAddCountry = computed(() => selectedCountries.value.length < 2)

const availableCountries = computed(() =>
  normalizedCountries.value.filter(
    (c) => !selectedNames.value.map((n) => n.toLowerCase()).includes(c.name.toLowerCase())
  )
)

const syncSelectedCountries = () => {
  const next: SelectedCountry[] = []
  const source = props.modelValue ?? props.initialCountries

  if (props.lockedCountry) {
    const match = normalizedCountries.value.find(
      (c) => c.name.toLowerCase() === props.lockedCountry.toLowerCase()
    )
    next.push({ name: match?.name ?? props.lockedCountry, flagSrc: match?.flagSrc, locked: true })
  }

  source.forEach((name) => {
    if (next.length >= 2) return
    if (next.some((c) => c.name.toLowerCase() === name.toLowerCase())) return
    const match = normalizedCountries.value.find((c) => c.name.toLowerCase() === name.toLowerCase())
    next.push({ name: match?.name ?? name, flagSrc: match?.flagSrc, locked: false })
  })

  selectedCountries.value = next.slice(0, 2)
}

const emitSelection = () => emit('update:modelValue', selectedNames.value)

const selectCountry = (country: SelectedCountry) => {
  if (!canAddCountry.value) return
  selectedCountries.value.push({ ...country, locked: false })
  searchValue.value = ''
  emitSelection()
}

const removeCountry = (name: string) => {
  selectedCountries.value = selectedCountries.value.filter((c) => c.locked || c.name !== name)
  emitSelection()
}

const handleCompare = () => {
  if (!canCompare.value) return
  emit('compare', selectedNames.value)
}

const handleClose = () => emit('back')
const handleOverlayClick = () => handleClose()

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') handleClose()
}

onMounted(() => document.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))

watch(
  () => [props.lockedCountry, props.modelValue, props.initialCountries, props.countries],
  syncSelectedCountries,
  { immediate: true, deep: true }
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
        <div class="compare-popup__card">
          <header class="compare-popup__header">
            <h2 id="compare-popup-title" class="compare-popup__title">{{ title }}</h2>
            <p class="compare-popup__description">{{ description }}</p>
          </header>

          <div class="compare-popup__field">
            <label class="compare-popup__label">Países selecionados</label>

            <div class="compare-popup__chips" v-if="selectedCountries.length">
              <span
                v-for="country in selectedCountries"
                :key="country.name"
                class="compare-popup__chip"
                :class="{ 'compare-popup__chip--locked': country.locked }"
              >
                <img
                  v-if="country.flagSrc"
                  class="compare-popup__chip-flag"
                  :src="country.flagSrc"
                  :alt="`Bandeira de ${country.name}`"
                />
                <span class="compare-popup__chip-text">{{ country.name }}</span>
                <button
                  v-if="!country.locked"
                  class="compare-popup__chip-remove"
                  type="button"
                  :aria-label="`Remover ${country.name}`"
                  @click="removeCountry(country.name)"
                >
                  &times;
                </button>
              </span>
            </div>

            <CountrySearchInput
              v-if="canAddCountry"
              v-model="searchValue"
              :countries="availableCountries"
              placeholder="Pesquisar país"
              @select="selectCountry"
            />

            <p v-if="!canAddCountry" class="compare-popup__max-note">
              Dois países selecionados. Remove um para trocar.
            </p>
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
  gap: 16px;
}

.compare-popup__header {
  margin-bottom: 8px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compare-popup__label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-gray-dark);
}

.compare-popup__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.compare-popup__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--text-gray-dark);
  color: var(--text-white);
  font-size: 0.88rem;
  font-weight: 500;
}

.compare-popup__chip--locked {
  background: var(--bg-blue-dark);
}

.compare-popup__chip-flag {
  width: 18px;
  height: 13px;
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}

.compare-popup__chip-text {
  white-space: nowrap;
}

.compare-popup__chip-remove {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 1rem;
  cursor: pointer;
}

.compare-popup__chip-remove:hover {
  background: rgba(255, 255, 255, 0.16);
}

.compare-popup__max-note {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-gray);
}

.compare-popup__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 8px;
}

.compare-popup__action {
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 2px;
  border: none;
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

.compare-popup__action:hover:not(:disabled) {
  color: var(--bg-blue);
}

.compare-popup__action:disabled {
  opacity: 0.42;
  cursor: not-allowed;
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
}
</style>