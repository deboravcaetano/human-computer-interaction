import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import ExecucaoView from '@/views/ExecucaoView.vue'
import ExecucaoVisaoGeralView from '@/views/ExecucaoVisaoGeralView.vue'
import ExecucaoMetasMarcosView from '@/views/ExecucaoMetasMarcosView.vue'
import ExecucaoDesembolsosView from '@/views/ExecucaoDesembolsosView.vue'
import IndicadoresView from '@/views/IndicadoresView.vue'
import PilaresView from '@/views/PilaresView.vue'
import HistoricoView from '@/views/HistoricoView.vue'
import Faq from '@/views/FaqView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes: [
    {
      path: '/',
      name: 'Início',
      component: InicioView,
    },
    {
      path: '/paises',
      name: 'Países',
      component: PaisesView,
    },
    {
      path: '/execucao',
      name: 'Execução',
      component: ExecucaoView,
    },
    {
      path: '/execucao/visao-geral',
      name: 'Execução - Visão Geral',
      component: ExecucaoVisaoGeralView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Execução', to: '/execucao' },
          { label: 'Visão Geral' },
        ],
      }
    },
    {
      path: '/execucao/metas-marcos',
      name: 'Execução - Metas e Marcos',
      component: ExecucaoMetasMarcosView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Execução', to: '/execucao' },
          { label: 'Metas e Marcos' },
        ],
      }
    },
    {
      path: '/execucao/desembolsos',
      name: 'Execução - Desembolsos',
      component: ExecucaoDesembolsosView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Execução', to: '/execucao' },
          { label: 'Desembolsos' },
        ],
      }
    },
    {
      path: '/indicadores',
      name: 'Indicadores',
      component: IndicadoresView,
    },
    {
      path: '/pilares',
      name: 'Pilares',
      component: PilaresView,
    },
    {
      path: '/paises/historico',
      name: 'Histórico',
      component: HistoricoView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Países', to: '/paises' },
          { label: 'Histórico' },
        ],
      }
    },
    {
    path: '/faq',
    name: 'FAQ',
    component: Faq,
    meta: { hideInNavbar: true}
    }
  ],
})

export default router 