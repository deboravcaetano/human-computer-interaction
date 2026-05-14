
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { PropType } from 'vue'

export interface TimelineItem {
  date: string
  text: string
}

export default defineComponent({
  name: 'TimelineList',

  props: {
    items: { type: Array as PropType<TimelineItem[]>, required: true },
    initialCount: { type: Number, default: 3 },
  },

  setup(props) {
    const expanded = ref(false)

    const visibleItems = computed(() =>
      expanded.value ? props.items : props.items.slice(0, props.initialCount)
    )

    function toggleExpanded() {
      expanded.value = !expanded.value
    }

    return { expanded, visibleItems, toggleExpanded }
  },
})
</script>

<template>
  <div class="timeline-wrapper">
    <h2 class="timeline-title">Ultimos avanços</h2>

    <div class="timeline">
      <div class="timeline-line" />

      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        class="timeline-row"
        :style="{ '--row-delay': `${index * 60}ms` }"
      >
        <div class="timeline-date">{{ item.date }}</div>

        <div class="timeline-dot">
          <div class="dot-outer">
            <div class="dot-inner" />
          </div>
        </div>

        <div class="timeline-text">{{ item.text }}</div>
      </div>
    </div>

    <button
      v-if="items.length > initialCount"
      class="ver-mais"
      @click="toggleExpanded"
    >
      {{ expanded ? 'Ver menos' : 'Ver mais' }}
      <span class="ver-mais-icon" :class="{ rotated: expanded }">&#8964;</span>
    </button>
  </div>
</template>


<style scoped>
.timeline-wrapper {
  background: #ffffff;
  border: 1px solid var(--light-blue);
  box-shadow: 0 4px 14px rgba(18, 38, 85, 0.12);
  border-radius: 12px;
  padding: 20px 24px 14px;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.timeline-title {
  font-size: clamp(1.35rem, 1.9vw, 1.8rem);
  font-weight: 700;
  color: var(--text-blue-dark);
  letter-spacing: 0.01em;
  margin: 0 0 34px 0;
}

.timeline {
  position: relative;
  padding-left: 0;
  padding-bottom: 96px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.timeline-line {
  position: absolute;
  top: -6px;
  bottom: 0;
  left: 108px;
  width: 2px;
  background: var(--dark-yellow);
  border-radius: 2px;
  z-index: 0;
}

.timeline-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: scale(0.95);
  animation: expandRow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards var(--row-delay, 0ms);
}


.timeline-row:last-child {
  margin-bottom: 0;
}

.timeline-row:first-child {
  margin-top: 2px;
}

.timeline-date {
  width: 86px;
  flex-shrink: 0;
  font-size: 0.88rem;
  font-weight: 500;
  color: #2d2d2d;
  padding-top: 2px;
}

.timeline-dot {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-outer {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #111111;
  position: relative;
  background: #ffffff;
}

.dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dark-yellow);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.timeline-text {
  flex: 1;
  font-size: 0.88rem;
  color: #1d1d1d;
  line-height: 1.45;
  padding-top: 1px;
  max-width: 94%;
}

.ver-mais {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: #2f2f2f;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: inherit;
  margin-top: 2px;
  padding: 0;
  line-height: 1;
  transition: color 0.3s ease;
}

.ver-mais:hover {
  color: #111;
}

.ver-mais:hover .ver-mais-icon {
  transform: translateY(3px);
}

.ver-mais-icon {
  font-size: 1.8rem;
  line-height: 1;
  display: inline-block;
  transition: transform 0.3s ease;
  margin-top: -2px;
}

.ver-mais-icon.rotated {
  transform: rotate(180deg);
}

@media (max-width: 900px) {
  .timeline-wrapper {
    padding: 18px 16px 12px;
  }

  .timeline-title {
    margin-bottom: 28px;
  }

  .timeline-row {
    gap: 10px;
    margin-bottom: 30px;
  }

  .timeline-date {
    width: 72px;
    font-size: 0.8rem;
  }

  .timeline-line {
    left: 91px;
  }

  .timeline-text {
    font-size: 0.84rem;
  }
}

@keyframes expandRow {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

