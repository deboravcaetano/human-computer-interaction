<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  type ColorVariant = 'primary' | 'secondary'
  type ExportFormat = 'PDF' | 'JSON' | 'CSV'
  type IconPosition = 'left' | 'right'
  type IconDirection = 'default' | 'left' | 'right' | 'up' | 'down'

  const props = withDefaults(
    defineProps<{
      text?: string
      textsize?: string
      color?: ColorVariant
      disabled?: boolean
      icon?: boolean
      iconPath?: string
      iconPosition?: IconPosition
      iconDirection?: IconDirection
      exportable?: boolean
      compact?: boolean
    }>(),
    {
      text: 'Button',
      textsize: '1.1rem',
      color: 'primary',
      disabled: false,
      icon: false,
      iconPath: '',
      iconPosition: 'right',
      iconDirection: 'default',
      exportable: false,
      compact: false
    }
  )

  const emit = defineEmits<{
    (e: 'click'): void
    (e: 'export', format: ExportFormat): void
  }>()

  const root = ref<HTMLElement | null>(null)
  const isExportMenuOpen = ref(false)
  const exportOptions: ExportFormat[] = ['PDF', 'JSON', 'CSV']

  const closeMenu = () => { isExportMenuOpen.value = false }

  const toggleExportMenu = () => {
    if (props.disabled) return
    isExportMenuOpen.value = !isExportMenuOpen.value
  }

  const onClick = () => {
    if (props.disabled) return
    if (props.exportable) { toggleExportMenu(); return }
    emit('click')
  }

  const selectExportFormat = (format: ExportFormat) => {
    if (props.disabled) return
    emit('export', format)
    closeMenu()
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (!isExportMenuOpen.value || !root.value) return
    if (root.value.contains(event.target as Node)) return
    closeMenu()
  }

  onMounted(() => document.addEventListener('click', handleOutsideClick))
  onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
  <div ref="root" class="btn-root">
    <button
      :class="[
        'btn',
        `btn--${color}`,
        { 'btn--disabled': disabled, 'btn--exportable': exportable, 'btn--compact': compact && exportable }
      ]"
      :style="{ '--btn-text-size': textsize }"
      type="button"
      :disabled="disabled"
      :aria-haspopup="exportable ? 'menu' : undefined"
      :aria-expanded="exportable ? isExportMenuOpen : undefined"
      :aria-label="compact && exportable ? 'Exportar' : undefined"
      @click="onClick"
    >
      <!-- modo compacto-->
      <template v-if="compact && exportable">
        <svg class="btn__export-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
      </template>

      <!-- modo normal -->
      <template v-else>
        <img
          v-if="icon && iconPath && iconPosition === 'left'"
          :class="['btn__icon', `btn__icon--${iconDirection}`]"
          :src="iconPath"
          alt=""
          aria-hidden="true"
        />
        <span class="btn__text">{{ text }}</span>
        <img
          v-if="icon && iconPath && iconPosition === 'right'"
          :class="['btn__icon', `btn__icon--${iconDirection}`]"
          :src="iconPath"
          alt=""
          aria-hidden="true"
        />
      </template>
    </button>

    <transition name="btn-menu">
      <div v-if="exportable && isExportMenuOpen" class="btn__menu" :class="{ 'btn__menu--compact': compact }" role="menu" aria-label="Opcoes de exportacao">
        <button
          v-for="option in exportOptions"
          :key="option"
          class="btn__menu-item"
          type="button"
          role="menuitem"
          @click="selectExportFormat(option)"
        >
          {{ option }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .btn-root {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    font-family: var(--font-primary);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.36rem 0.75rem;
    border: 1px solid;
    border-radius: 5px;
    font-family: var(--font-primary);
    font-size: var(--btn-text-size);
    font-weight: 600;
    cursor: pointer;
    transition: filter 160ms ease, transform 160ms ease;
  }

  /* Modo compacto: quadrado só com ícone */
  .btn--compact {
    padding: 0;
    width: 28px;
    height: 28px;
    justify-content: center;
    border-radius: 6px;
  }

  .btn__export-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  /* Primary color */
  .btn--primary {
    border-color: var(--bg-blue-dark);
    background: var(--bg-blue);
    color: var(--text-white);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.12) inset;
  }

  .btn--primary:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  /* Secondary color */
  .btn--secondary {
    border-color: var(--bg-blue-light);
    background: var(--bg-gray);
    color: var(--text-blue-dark);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .btn--secondary:hover:not(:disabled) {
    background: var(--text-white);
    border-color: var(--bg-blue);
  }

  .btn__icon {
    width: 0.78rem;
    height: 0.78rem;
    flex-shrink: 0;
    object-fit: contain;
  }

  .btn__icon--left  { transform: rotate(90deg); }
  .btn__icon--right { transform: rotate(-90deg); }
  .btn__icon--up    { transform: rotate(180deg); }
  .btn__icon--down,
  .btn__icon--default { transform: rotate(0deg); }

  .btn__text { display: inline-block; }

  .btn:active:not(:disabled) { transform: translateY(1px); }

  .btn:focus-visible {
    outline: 2px solid var(--text-blue-neon);
    outline-offset: 2px;
  }

  .btn:disabled,
  .btn--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn--exportable:not(.btn--compact) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btn__menu {
    position: absolute;
    top: calc(100% - 1px);
    right: 0;
    left: auto;
    min-width: 0;
    width: 5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--bg-blue-dark);
    border-top: 0;
    border-radius: 0 0 5px 5px;
    background: var(--bg-blue);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
    z-index: 10;
  }

  /* No modo compacto o menu abre por baixo alinhado à direita normalmente */
  .btn__menu--compact {
    top: calc(100% + 4px);
    border-top: 1px solid var(--bg-blue-dark);
    border-radius: 5px;
    width: 4rem;
  }

  .btn__menu-item {
    border: 0;
    border-radius: 0.45rem;
    background: var(--bg-blue-light);
    color: var(--text-white);
    padding: 0.25rem 0.55rem;
    font: inherit;
    font-size: 0.70rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
  }

  .btn__menu-item:hover,
  .btn__menu-item:focus-visible {
    filter: brightness(1.06);
    outline: none;
  }

  .btn-menu-enter-active,
  .btn-menu-leave-active {
    transition: opacity 140ms ease, transform 140ms ease;
    transform-origin: top;
  }

  .btn-menu-enter-from,
  .btn-menu-leave-to {
    opacity: 0;
    transform: translateY(-4px) scaleY(0.98);
  }
</style>