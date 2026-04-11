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
  gap: 180px;
}

.buttons{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 100px auto 0 auto;
    width: 82%;
}

.left-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

</style>
