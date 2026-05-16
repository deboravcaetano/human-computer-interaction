<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  label: String,
  options: {
    type: Array,
    default: () => []
  },
  modelValue: String,
  allLabel: {
    type: String,
    default: 'Todos'
  }
});

const emit = defineEmits(['update:modelValue']);

const root = ref(null);
const isOpen = ref(false);

const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === 'string') {
      return {
        label: option,
        value: option,
        icon: ''
      };
    }

    return {
      label: option.label ?? option.value ?? '',
      value: option.value ?? option.label ?? '',
      icon: option.icon ?? ''
    };
  });
});

const selectedOption = computed(() => {
  return normalizedOptions.value.find((option) => option.value === props.modelValue);
});

const selectedLabel = computed(() => selectedOption.value?.label || props.modelValue || props.allLabel);
const selectedIcon = computed(() => selectedOption.value?.icon || '');

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectOption = (value) => {
  emit('update:modelValue', value);
  closeDropdown();
};

const handleOutsideClick = (event) => {
  if (!root.value || root.value.contains(event.target)) return;

  closeDropdown();
};

const handleKeydown = (event) => {
  if (event.key === 'Escape') closeDropdown();
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div ref="root" class="filter-container">
    <button
      class="filter-select"
      type="button"
      :aria-label="`Filtrar por ${label}`"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleDropdown"
    >
      <span class="filter-select__content">
        <img v-if="selectedIcon" class="filter-select__flag" :src="selectedIcon" :alt="`Bandeira de ${selectedLabel}`" />
        <span class="filter-select__text">{{ selectedLabel }}</span>
      </span>
      <span class="filter-select__arrow" aria-hidden="true"></span>
    </button>

    <transition name="filter-menu">
      <div v-if="isOpen" class="filter-menu" role="listbox" :aria-label="`Opções de ${label}`">
        <button
          class="filter-option"
          type="button"
          role="option"
          :aria-selected="!modelValue"
          @click="selectOption('')"
        >
          {{ allLabel }}
        </button>

        <button
          v-for="option in normalizedOptions"
          :key="option.value"
          class="filter-option"
          type="button"
          role="option"
          :aria-selected="modelValue === option.value"
          @click="selectOption(option.value)"
        >
          <img v-if="option.icon" class="filter-option__flag" :src="option.icon" :alt="`Bandeira de ${option.label}`" />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.filter-container {
  position: relative;
  display: inline-block;
  min-width: 180px;
}

.filter-select {
  width: 100%;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 8px 14px 8px 15px;
  background: #fff;
  color: #666;
  font-family: Inter, sans-serif;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.filter-select:focus-visible {
  border-color: var(--bg-blue-light);
  box-shadow: 0 0 0 3px rgba(64, 82, 134, 0.14);
}

.filter-select__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-select__content {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.filter-select__flag,
.filter-option__flag {
  width: 18px;
  height: 13px;
  flex: 0 0 auto;
  border-radius: 2px;
  object-fit: cover;
}

.filter-select__arrow {
  width: 11px;
  height: 7px;
  flex: 0 0 auto;
  background: url('@/assets/arrow-down-gray.svg') center / contain no-repeat;
}

.filter-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 30;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 12px 26px rgba(16, 29, 66, 0.16);
}

.filter-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #555;
  font-family: Inter, sans-serif;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.filter-option:hover,
.filter-option:focus-visible,
.filter-option[aria-selected='true'] {
  background: #f2f5fb;
  color: #0a1a44;
  outline: none;
}

.filter-menu-enter-active,
.filter-menu-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}

.filter-menu-enter-from,
.filter-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 480px) {
  .filter-container {
    width: 100%;
  }

  .filter-menu {
    max-height: 180px;
  }
}
</style>
