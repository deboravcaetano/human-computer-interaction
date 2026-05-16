import { createApp, type Plugin } from 'vue'
import App from './App.vue'
import router from './router'
import './styles.css'

const app = createApp(App)

app.use(router as unknown as Plugin)
app.mount('#app')