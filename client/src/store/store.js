// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import pathify, { make } from 'vuex-pathify'

Vue.use(Vuex)

let state = {
	currentRoute: '',
}

export default new Vuex.Store({
	plugins: [pathify.plugin],
	state,
	mutations: make.mutations(state),
})
