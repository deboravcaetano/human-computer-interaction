<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue';
import Button from '@/components/Button.vue';
import CountryCard from '@/components/CountryCard.vue';
import ComparePopUp from '@/components/ComparePopUp.vue';
import historyIcon from '@/assets/history-icon.svg';
import compareIcon from '@/assets/compare-icon.svg';
import { getCountries } from '@/services/api';

const countries = ref([]);
const router = useRouter();
const searchQuery = ref('');
const isLoading = ref(true);
const errorMessage = ref('');
const isComparePopUpOpen = ref(false);

const getFlagPath = (flagAsset) => {
  return new URL(`../assets/flags/${flagAsset}.svg`, import.meta.url).href;
};

const compareCountries = computed(() => {
  return countries.value.map((country) => ({
    name: country.name,
    flagSrc: getFlagPath(country.flagAsset)
  }));
});

const filteredCountries = computed(() => {
  const searchTerm = searchQuery.value.trim().toLowerCase();
  if (!searchTerm) return countries.value;

  const matches = countries.value.filter(country => 
    country.name.toLowerCase().includes(searchTerm) ||
    country.nameEn.toLowerCase().includes(searchTerm)
  );

  // ordenação por relevância
  return matches.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    // critério 1: match exato (prioridade 1)
    if (nameA === searchTerm && nameB !== searchTerm) return -1;
    if (nameB === searchTerm && nameA !== searchTerm) return 1;

    // critério 2: começa com o termo (prioridade 2)
    const startsA = nameA.startsWith(searchTerm);
    const startsB = nameB.startsWith(searchTerm);
    if (startsA && !startsB) return -1;
    if (startsB && !startsA) return 1;

    // critério 3: ordem alfabética (desempate)
    return nameA.localeCompare(nameB);
  });
});

onMounted(async () => {
  try {
    countries.value = await getCountries();
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os países.';
  } finally {
    isLoading.value = false;
  }
});

const onSearch = (query) => { searchQuery.value = query; };
const openComparePopUp = () => { isComparePopUpOpen.value = true; };
const closeComparePopUp = () => { isComparePopUpOpen.value = false; };
const onCompareCountries = () => {
  closeComparePopUp();
};

// ── ENTER: fase 1 → espaço abre; fase 2 → card aparece ──────────
const onBeforeEnter = (el) => {
  // Calcula o stagger antes de qualquer transição disparar.
  const siblings = [...(el.parentElement?.querySelectorAll('[data-country-key]') ?? [])];
  const index    = siblings.indexOf(el);
  el.style.setProperty('--enter-delay', `${Math.min(index * 55, 220)}ms`);

  // Suprime a transição CSS enquanto definimos o estado colapsado.
  // Sem isto, o browser pode interpretar max-height:0 como um "to" em vez de "from",
  // pois a classe enter-active (com transition) já está aplicada pelo Vue neste ponto.
  el.style.transition    = 'none';
  el.style.maxHeight     = '0px';
  el.style.paddingBottom = '0px';
  el.style.overflow      = 'hidden';

  // Força o browser a registar o estado colapsado antes de repor as transições.
  void el.offsetHeight;

  // Remove o override inline — a partir daqui a transição CSS volta a estar activa.
  el.style.transition = '';
};

const onEnter = (el) => {
  // Força reflow para que o browser use o estado colapsado como ponto de partida.
  void el.getBoundingClientRect();

  // scrollHeight com padding-bottom:0 inline = altura do conteúdo sem o padding.
  // Somamos 16px (o padding-bottom do .card-wrapper) para que max-height
  // acomode o elemento completo sem clippar.
  el.style.maxHeight     = `${el.scrollHeight + 16}px`;
  el.style.paddingBottom = '16px';
};

const onAfterEnter = (el) => {
  el.style.maxHeight     = '';
  el.style.paddingBottom = '';
  el.style.overflow      = '';
};

// ── LEAVE: fase 1 → card desvanece; fase 2 → espaço colapsa ─────
const onBeforeLeave = (el) => {
  // Stagger: cards que estão mais abaixo saem com ligeiro delay
  const siblings = [...(el.parentElement?.querySelectorAll('[data-country-key]') ?? [])];
  const index    = siblings.indexOf(el);
  el.style.setProperty('--leave-delay', `${Math.min(index * 35, 105)}ms`);

  // Congela a altura actual como ponto de partida da animação
  el.style.maxHeight     = `${el.offsetHeight}px`;
  el.style.paddingBottom = getComputedStyle(el).paddingBottom;
  el.style.overflow      = 'hidden';
};

const onCountryCardClick = (countryId) => {
  router.push(`/paises/${countryId}`);
};
</script>

<template>
  <div class="page-content">
    <SearchBar
      class="my-search"
      placeholder="Pesquisar por país"
      width="100%"
      height="36px"
      @search="onSearch"
    />

    <div class="buttons-div">
      <router-link to="/paises/historico" style="text-decoration: none;">
        <Button text="Histórico" textsize="15px" :icon="true" :iconPath="historyIcon" />
      </router-link>
      <Button text="Comparar" textsize="15px" :icon="true" :iconPath="compareIcon" @click="openComparePopUp" />
    </div>

    <ComparePopUp
      v-if="isComparePopUpOpen"
      :countries="compareCountries"
      @back="closeComparePopUp"
      @compare="onCompareCountries"
    />

    <p v-if="isLoading" class="state-text">A carregar países...</p>
    <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

    <TransitionGroup
      v-else
      name="country-list"
      tag="section"
      class="cards-list"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
    >
      <!--
        O wrapper é o elemento animado pelo TransitionGroup.
        O padding-bottom substitui o gap da flexbox para poder ser
        animado de/para 0 durante o colapso/expansão do espaço.
      -->
      <div
        v-for="country in filteredCountries"
        :key="country.id"
        class="card-wrapper"
        :data-country-key="country.id"
      >
        <CountryCard
          :country="country.name"
          :flag-src="getFlagPath(country.flagAsset)"
          :evolution="country.evolution"
          :gdp="country.gdp"
          :updated-at="country.updatedAt"
          @click="onCountryCardClick(country.id)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 40px;
  padding: 20px;
  box-sizing: border-box;
}

.buttons-div {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 40px;
  width: 100%;
  max-width: 1200px;
  justify-content: flex-end;
}

.my-search {
  max-width: 1200px;
  width: 100%;
}

.cards-list {
  display: flex;
  flex-direction: column;
  /* Sem gap: o espaçamento é feito pelo padding-bottom do .card-wrapper
     para poder ser animado durante as transições. */
  width: 100%;
  max-width: 1200px;
  margin-top: 18px;
}

.card-wrapper {
  padding-bottom: 16px;
}

.state-text {
  width: 100%;
  max-width: 1200px;
  margin: 24px 0 0;
  font-family: var(--font-primary);
  color: var(--text-gray);
}

.state-text--error {
  color: #b42318;
}

/* ── ENTER ─────────────────────────────────────────────────────────
   Fase 1 (começa em --enter-delay):
     max-height e padding-bottom expandem → o espaço abre-se.
   Fase 2 (começa em --enter-delay + 230ms, quando o espaço já está aberto):
     opacity e transform animam → o card aparece.
────────────────────────────────────────────────────────────────── */
.country-list-enter-active {
  transition:
    max-height    260ms cubic-bezier(0.4, 0, 0.2, 1) var(--enter-delay, 0ms),
    padding-bottom 260ms cubic-bezier(0.4, 0, 0.2, 1) var(--enter-delay, 0ms),
    opacity       210ms ease calc(var(--enter-delay, 0ms) + 230ms),
    transform     210ms ease calc(var(--enter-delay, 0ms) + 230ms);
}

.country-list-enter-from {
  opacity: 0;
  transform: translateY(10px);
  /* max-height e padding-bottom definidos via JS em onBeforeEnter */
}

/* ── LEAVE ─────────────────────────────────────────────────────────
   Fase 1 (começa em --leave-delay):
     opacity e transform animam → o card desvanece.
   Fase 2 (começa em --leave-delay + 120ms, quando o card já não é visível):
     max-height e padding-bottom colapsam → o espaço fecha-se,
     puxando o footer e os cards seguintes suavemente para cima.
────────────────────────────────────────────────────────────────── */
.country-list-leave-active {
  transition:
    opacity       150ms ease                           var(--leave-delay, 0ms),
    transform     150ms ease                           var(--leave-delay, 0ms),
    max-height    280ms cubic-bezier(0.4, 0, 0.2, 1)  calc(var(--leave-delay, 0ms) + 120ms),
    padding-bottom 280ms cubic-bezier(0.4, 0, 0.2, 1) calc(var(--leave-delay, 0ms) + 120ms);
  overflow: hidden;
  pointer-events: none;
}

.country-list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
  max-height: 0 !important;
  padding-bottom: 0 !important;
}

/* ── MOVE ──────────────────────────────────────────────────────────
   Cards que ficam na lista e mudam de posição (ex: reordenação
   por relevância de pesquisa) deslizam suavemente via FLIP.
────────────────────────────────────────────────────────────────── */
.country-list-move {
  transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>
