import { ViteSSG } from 'vite-ssg'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'

const routes = generatedRoutes
console.log
export const createApp = ViteSSG(
  App,
  { routes },
)
