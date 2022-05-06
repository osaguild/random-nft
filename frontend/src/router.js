import Vue from 'vue'
import Router from 'vue-router'
import Erc721 from './components/erc721.vue'
import RandomSpeech from './components/randomSpeech.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/randomSpeech' },
    { path: '/erc721', component: Erc721 },
    { path: '/randomSpeech', component: RandomSpeech }
  ]
})