import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import ExecucaoView from '@/views/ExecucaoView.vue'
import IndicadoresView from '@/views/IndicadoresView.vue'
import PilaresView from '@/views/PilaresView.vue'
import HistoricoView from '@/views/HistoricoView.vue'

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
      meta: { hideInNavbar: true }
    }
  ],
})

export default router 