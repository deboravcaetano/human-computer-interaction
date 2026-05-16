import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import PaisView from '@/views/PaisView.vue'
import ExecucaoView from '@/views/ExecucaoView.vue'
import ExecucaoVisaoGeralView from '@/views/ExecucaoVisaoGeralView.vue'
import ExecucaoEstadoMembroView from '@/views/ExecucaoEstadoMembroView.vue'
import ExecucaoMetasMarcosView from '@/views/ExecucaoMetasMarcosView.vue'
import ExecucaoDesembolsosView from '@/views/ExecucaoDesembolsosView.vue'
import IndicadoresView from '@/views/IndicadoresView.vue'
import PilaresView from '@/views/PilaresView.vue'
import HistoricoView from '@/views/HistoricoView.vue'
import CountryMoreDetails from '@/views/CountryMoreDetails.vue'
import PaisIndicadoresView from '@/views/PaisIndicadoresView.vue'
import PaisPilaresView from '@/views/PaisPilaresView.vue'
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
      component: CountryMoreDetails,
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
              { label: 'Detalhe', to: '#' }, 
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
              { label: 'Detalhe', to: '#' }, 
              { label: 'Indicadores' },
            ],
          }
        }
      ]
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
      meta: { hideInNavbar: true }
    }
  ],
})

export default router