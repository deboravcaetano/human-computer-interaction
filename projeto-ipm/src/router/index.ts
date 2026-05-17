import { createRouter, createWebHistory, type RouteLocationNormalizedLoaded } from 'vue-router'

import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import PaisView from '@/views/PaisView.vue'
import ExecucaoView from '@/views/ExecucaoView.vue'
import ExecucaoVisaoGeralView from '@/views/ExecucaoVisaoGeralView.vue'
import ExecucaoEstadoMembroView from '@/views/ExecucaoEstadoMembroView.vue'
import ExecucaoMetasMarcosView from '@/views/ExecucaoMetasMarcosView.vue'
import ExecucaoDesembolsosView from '@/views/ExecucaoDesembolsosView.vue'
import ExecucaoDesembolsosPaisView from '@/views/ExecucaoDesembolsosPaisView.vue'
import IndicadoresView from '@/views/IndicadoresView.vue'
import IndicadorUnicoView from '@/views/IndicadorUnicoView.vue'
import PilaresView from '@/views/PilaresView.vue'
import PilarDetailView from '@/views/PilarDetailView.vue'
import HistoricoView from '@/views/HistoricoView.vue'
import CountryMoreDetails from '@/views/CountryMoreDetails.vue'
import CompareCountriesView from '@/views/CompareCountriesView.vue'
import PaisIndicadoresView from '@/views/PaisIndicadoresView.vue'
import PaisPilaresView from '@/views/PaisPilaresView.vue'
import Faq from '@/views/FaqView.vue'
import ExecucaoDesembolsosPais100View from '@/views/ExecucaoDesembolsosPais100View.vue'

const countryDetailPath = (route: RouteLocationNormalizedLoaded) =>
  `/paises/${route.params.countryId}`

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
      path: '/paises/:countryId',
      name: 'País',
      component: PaisView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Países', to: '/paises' },
          { label: 'Detalhe' },
        ],
      }
    },
    {
      path: '/paises/:countryId/mais',
      name: 'country-more-details',
      component: CountryMoreDetails,
      meta: { hideInNavbar: true },
      redirect: to => `${to.path}/pilares`, 
      children: [
        {
          path: 'pilares',
          name: 'country-more-details-pillars',
          component: PaisPilaresView,
          meta: {
            title: "Pilares",
            description: "Os pilares são as grandes áreas estratégicas que orientam o investimento dos fundos europeus, como a Transição Ecológica e a Transformação Digital, servem para organizar e categorizar todos os marcos e metas de cada país.",
            hideInNavbar: true,
            breadcrumb: [
              { label: 'Países', to: '/paises' },
              { label: 'Detalhe', to: countryDetailPath },
              { label: 'Pilares' },
            ],
          }
        },
        {
          path: 'indicadores',
          name: 'country-more-details-indicators',
          component: PaisIndicadoresView,
          meta: {
            title: "Indicadores Comuns",
            description: `O Painel de Avaliação da Recuperação e Resiliência monitoriza o progresso do PRR através de 14 indicadores comuns.
                    Estes indicadores refletem o progresso na implementação dos planos nacionais e desempenho global do mecanismo face aos objetivos partilhados.
                    Os Estados-Membros são responsáveis pela recolha e reporte destes dados à Comissão Europeia semestralmente, até ao final de Fevereiro e Agosto.`,
            hideInNavbar: true,
            breadcrumb: [
              { label: 'Países', to: '/paises' },
              { label: 'Detalhe', to: countryDetailPath },
              { label: 'Indicadores' },
            ],
          }
        }
      ]
    },
    {
      path: '/comparar/:firstCountryId/:secondCountryId',
      name: 'Comparar Países',
      component: CompareCountriesView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Países', to: '/paises' },
          { label: 'Comparação' },
        ],
      },
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
      path: '/execucao/estado-membro',
      name: 'Execução - Estado-Membro',
      component: ExecucaoEstadoMembroView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Execução', to: '/execucao' },
          { label: 'Estado-Membro' },
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
      path: '/execucao/desembolsos/:countryId',
      name: 'Execução - Desembolsos - País',
      component: ExecucaoDesembolsosPaisView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Execução', to: '/execucao' },
          { label: 'Desembolsos', to: '/execucao/desembolsos' },
          { label: 'País' },
        ],
      }
    },
    {
      path: '/execucao/desembolsos/:countryId/100',
      name: 'Execução - Desembolsos - País - Ver Tudo',
      component: ExecucaoDesembolsosPais100View,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Execução', to: '/execucao' },
          { label: 'Desembolsos', to: '/execucao/desembolsos' },
          { label: 'País', to: (route) => `/execucao/desembolsos/${route.params.countryId}` },
          { label: 'Ver Tudo' },
        ],
      }
    },
    {
      path: '/indicadores',
      name: 'Indicadores',
      component: IndicadoresView,
    },
    {
      path: '/indicadores/:id',
      name: 'IndicadorUnico',
      component: IndicadorUnicoView,
      meta: {
        hideInNavbar: true,
      },
    },
    {
      path: '/pilares',
      name: 'Pilares',
      component: PilaresView,
    },
    {
      path: '/pilares/:pillarId',
      name: 'PilarDetalhe',
      component: PilarDetailView,
      meta: {
        hideInNavbar: true,
        breadcrumb: [
          { label: 'Pilares', to: '/pilares' },
          { label: 'Detalhe' },
        ],
      },
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
      meta: { hideInNavbar: true }
    }
  ],
})

export default router
