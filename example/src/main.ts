import generatedRoutes from 'virtual:generated-pages'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

const routes = generatedRoutes
export const createApp = ViteSSG(
  App,
  { routes },
)
