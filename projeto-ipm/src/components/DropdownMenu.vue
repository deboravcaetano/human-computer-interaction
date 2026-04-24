<script setup lang="ts">
	import { useRouter } from 'vue-router'

	type MenuItem = {
		label: string
		icon: 'eye' | 'flag' | 'money'
		to: string
	}

	const router = useRouter()

	const menuItems: MenuItem[] = [
		{ label: 'Visao Geral', icon: 'eye', to: '/execucao/visao-geral' },
		{ label: 'Metas e Marcos', icon: 'flag', to: '/execucao/metas-marcos' },
		{ label: 'Desembolsos', icon: 'money', to: '/execucao/desembolsos' }
	]

	const navigateTo = (path: string) => {
		router.push(path)
	}
</script>

<template>
	<section class="execution-menu" aria-label="Opcoes de execucao">
		<div class="execution-menu__card">
			<button
				v-for="item in menuItems"
				:key="item.label"
				class="execution-menu__item"
				type="button"
				@click="navigateTo(item.to)"
			>
				<span class="icon-chip" aria-hidden="true">
					<img v-if="item.icon === 'eye'" src="@/assets/eye.svg" alt="" />

					<img v-else-if="item.icon === 'flag'" src="@/assets/flag.svg" alt="" />

					<img v-else-if="item.icon === 'money'" src="@/assets/money.svg" alt="" />
				</span>

				<span class="item-label">{{ item.label }}</span>
			</button>
		</div>
	</section>
</template>

<style scoped>
	.execution-menu {
		width: 180px;
		font-family: var(--font-primary);
	}

	.execution-menu__card {
		display: grid;
		gap: 14px;
		padding: 10px;
		border-radius: 4px;
		background: var(--bg-blue-dark);
	}

	.execution-menu__item {
		border: 0;
		background: transparent;
		color: var(--text-white);
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.9rem;
		text-align: left;
		cursor: pointer;
		padding: 0;
		font: inherit;
	}

	.icon-chip {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 6px;
		display: grid;
		place-items: center;
		color: var(--text-white);
		background: var(--bg-blue);
	}

	.item-label {
        font-family: var(--font-primary);
		font-size: 14px;
		font-weight: 500;
	}

	.execution-menu__item:hover .icon-chip,
	.execution-menu__item:focus-visible .icon-chip {
		filter: brightness(1.1);
	}

	.execution-menu__item:focus-visible {
		outline: 2px solid var(--text-blue-neon);
		outline-offset: 4px;
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.execution-menu {
			width: 100vw;
			margin-left: calc(50% - 50vw);
			padding: 10px 0;
			background: var(--text-white);
		}

		.execution-menu__card {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			gap: 0px;
			padding: 6px;
			background: var(--text-white);
			border-radius: 0;
		}

		.execution-menu__item {
			flex: 0 0 auto;
			align-items: center;
			justify-content: center;
			padding: 4px 6px;
			border-radius: 6px;
			border: 1px solid transparent;
			background: var(--text-white);
			color: var(--text-black);
			transition: background-color 0.2s ease, border-color 0.2s ease;
		}

		.execution-menu__item:hover,
		.execution-menu__item:focus-visible {
			background: var(--bg-gray);
		}

		.icon-chip {
			display: none;
		}

		.item-label {
			font-size: 1rem;
			font-weight: 600;
		}
	}
</style>
