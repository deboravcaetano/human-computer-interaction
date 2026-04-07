<script>
    import checkIcon from '../assets/Check.svg';
    import clockIcon from '../assets/Clock.svg';
    import xCircleIcon from '../assets/Xcircle.svg';

    export default {
        name: 'StatusPopUp',
        props: {
            status: {
                type: String,
                default: 'pendente',
                validator: (value) => ['aprovado', 'pendente', 'recusado'].includes(value.toLowerCase())
            }
        },
        computed: {
            normalizedStatus() {
                return this.status.toLowerCase();
            },
            statusLabel() {
                return this.normalizedStatus.charAt(0).toUpperCase() + this.normalizedStatus.slice(1);
            },
            statusIcon() {
                const iconByStatus = {
                    aprovado: checkIcon,
                    pendente: clockIcon,
                    recusado: xCircleIcon
                };

                return iconByStatus[this.normalizedStatus] || clockIcon;
            }
        }
    }
</script>

<template>
    <div class="status-popup" :class="`status-popup--${normalizedStatus}`">
        <h2>{{ statusLabel }}</h2>
        <img :src="statusIcon" :alt="`Icone de estado: ${statusLabel}`" class="status-icon" />
    </div>
</template>

<style scoped>
    .status-popup {
        width: 85px;
        box-sizing: border-box;
        padding: 0 8px;
        height: 20px;
        background-color: var(--status-bg);
        border: 1px solid var(--status-border);
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .status-popup--aprovado {
        --status-bg: var(--status-aprovado-bg);
        --status-border: var(--status-aprovado);
        --status-text: var(--status-aprovado);
    }

    .status-popup--pendente {
        --status-bg: var(--status-pendente-bg);
        --status-border: var(--status-pendente);
        --status-text: var(--status-pendente);
    }

    .status-popup--recusado {
        --status-bg: var(--status-recusado-bg);
        --status-border: var(--status-recusado);
        --status-text: var(--status-recusado);
    }

    .status-popup h2 {
        font-size: 11px;
        font-family: var(--font-primary);
        font-weight: 500;
        color: var(--status-text);
        margin: 0;
    }

    .status-icon {
        width: 12px;
        height: 12px;
        margin: 0;
    }

</style>