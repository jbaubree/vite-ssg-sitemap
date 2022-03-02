import { ViteSSG } from 'vite-ssg'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'

const routes = generatedRoutes

export const createApp = ViteSSG(
  App,
  { routes },
)
