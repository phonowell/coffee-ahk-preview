/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import App from '@/component/index.vue'
import Vue from 'vue'
// @ts-ignore
import config from '@/module/config.js'

Object.assign(Vue.config, {
  errorHandler: (e: Error) => console.error(e),
  productionTip: config.isDebug,
})

// app

const app = new Vue({
  data: () => {
    return {
      cache: new Map() as Map<string, unknown>,
      refs: undefined,
      root: undefined,
    }
  },
  mounted (
    this: typeof app
  ): void {
    this.root = this.$children[0]
    this.refs = this.root.$refs
  },
  render: h => h(App),
})

app.$mount('#app')

Object.assign(window, { app })
