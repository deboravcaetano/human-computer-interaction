<script>
    export default {
        name: 'CategoryBadge',
        props: {
            category: {
                type: String,
                default: 'Transformação Digital',
                validator: (value) => [
                    'Crescimento',
                    'Transição Ecológica',
                    'Transformação Digital',
                    'Políticas',
                    'Coesão Social e Territorial',
                    'Saúde e Resiliência'
                ].includes(value)
            }
        },
        computed: {
            normalizedCategory() {
                const categoryByClass = {
                    'Crescimento': 'crescimento',
                    'Transição Ecológica': 'transicao-ecologica',
                    'Transformação Digital': 'transformacao-digital',
                    'Políticas': 'politicas',
                    'Coesão Social e Territorial': 'coesao-social-e-territorial',
                    'Saúde e Resiliência': 'saude-e-resiliencia'
                };

                return categoryByClass[this.category] || 'transformacao-digital';
            }
        }
    }
</script>

<template>
  <span class="category-badge" :class="`category-badge--${normalizedCategory}`">
    {{ category }}
  </span>
</template>

<style scoped>
.category-badge {
  box-sizing: border-box;
  min-height: 20px;
  padding: 4px 12px;
  border: 1px solid var(--category-border);
  border-radius: 7px;
  background: var(--category-bg);
  color: var(--category-text);
  font-family: var(--font-primary);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.category-badge--crescimento {
  --category-bg: var(--category-crescimento-bg);
  --category-border: var(--category-crescimento);
  --category-text: var(--category-crescimento);
}

.category-badge--transicao-ecologica {
  --category-bg: var(--category-transicao-ecologica-bg);
  --category-border: var(--category-transicao-ecologica);
  --category-text: var(--category-transicao-ecologica);
}

.category-badge--transformacao-digital {
  --category-bg: var(--category-transformacao-digital-bg);
  --category-border: var(--category-transformacao-digital);
  --category-text: var(--category-transformacao-digital);
}

.category-badge--politicas {
  --category-bg: var(--category-politicas-bg);
  --category-border: var(--category-politicas);
  --category-text: var(--category-politicas);
}

.category-badge--coesao-social-e-territorial {
  --category-bg: var(--category-coesao-social-territorial-bg);
  --category-border: var(--category-coesao-social-territorial);
  --category-text: var(--category-coesao-social-territorial);
}

.category-badge--saude-e-resiliencia {
  --category-bg: var(--category-saude-resiliencia-bg);
  --category-border: var(--category-saude-resiliencia);
  --category-text: var(--category-saude-resiliencia);
}

@media (max-width: 768px) {
  .category-badge {
    white-space: normal;
    line-height: 1.2;
  }
}
</style>
