<script setup>
import IntroCard from '@/components/IntroCard.vue';
import InfoCard from '@/components/InfoCard.vue';
import Button from '@/components/Button.vue';
import ExportImg from '@/assets/Download.svg'
import FilterSelect from '@/components/FilterSelect.vue';

import { ref } from 'vue';

const filtroPais = ref('');
const filtroEstado = ref('');
const filtroPilares = ref('');

const paises = ['Portugal', 'Espanha', 'França', 'Alemanha'];
const estados = ['Aprovado', 'Pendente', 'Recusado'];
const pilares = ['Crescimento', 'Transição Ecológica','Transformação Digital','Políticas','Coesão Social e Territorial', 'Saúde e Resiliência']

const title = "Histórico de Revisões da União Europeia";
const description = "Este painel permite acompanhar as alterações oficiais nos Planos de Recuperação e Resiliência, garantindo a transparência e a responsabilidade na execução dos fundos."
</script>

<template>
    <div>
        <IntroCard
            :title="title"
            :description="description"
            height="320px" 
            width="100%" 
        >
        </IntroCard>
        <div class="info-cards">
            <InfoCard
                title="Total"
                description="N/A"
                height="130px"
                width="260px" 
                backgroundColor="#FDCA40"
                borderColor="#795A08"
            ></InfoCard>
            <InfoCard
                title="Aprovados"
                description="N/A"
                height="130px"
                width="260px" 
            ></InfoCard>
            <InfoCard
                title="Pendentes"
                description="N/A"
                height="130px"
                width="260px" 
            ></InfoCard>
            <InfoCard
                title="Recusados"
                description="N/A"
                height="130px"
                width="260px" 
            ></InfoCard>
        </div>
        <div class="buttons">
            <div class="left-buttons">
                <FilterSelect 
                    label="País" 
                    :options="paises" 
                    v-model="filtroPais" 
                />
                <FilterSelect 
                    label="Estado" 
                    :options="estados" 
                    v-model="filtroEstado" 
                />
                <FilterSelect 
                    label="Pilares" 
                    :options="pilares" 
                    v-model="filtroPilares" 
                />
            </div>
            <div class="right-buttons">
                <Button 
                text="Exportar" 
                textsize="15px" 
                :icon="true" 
                :iconPath="ExportImg"
                :exportable="true"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.info-cards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 24px;
  padding: 40px 20px;
  margin-top: -60px;
  margin-bottom: 80px;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  margin: 60px auto 0;
  gap: 20px;
}

.left-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.right-buttons {
  display: flex;
  align-items: center;
}

@media (max-width: 1024px) {
  .info-cards {
    margin-top: -50px;
    gap: 20px;
    padding: 30px 16px;
  }
  
  .buttons {
    padding: 0 20px;
  }
  
  .left-buttons {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .info-cards {
    margin-top: -45px;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 60px;
  }
  
  .buttons {
    flex-wrap: wrap;
    justify-content: flex-start; 
    gap: 16px;
    padding: 0 16px;
    margin-top: 40px;
  }
  
  .left-buttons {
    gap: 12px;
    flex: 1;
    justify-content: flex-start; 
  }
  
  .right-buttons {
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .info-cards {
    margin-top: -30px;
    padding: 20px 16px;
  }
  
  .buttons {
    flex-direction: column;
    align-items: flex-start; 
    gap: 16px;
    padding: 0 16px;
  }
  
  .left-buttons {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: flex-start; 
  }
  
  .right-buttons {
    width: 100%;
  }
}
</style>