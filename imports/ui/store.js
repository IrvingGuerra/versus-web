import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/authentication';
import temporal from './modules/temporal';
import navigation from './modules/navigation'
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['auth', 'temporal', 'navigation']
});
export default new Vuex.Store({
    state: {
        loading: false
    },
    mutations: {
        setLoading(state, bool) {
            state.loading = bool;
        }
    },
    modules: {
        auth,
        temporal,
        navigation
    },
    plugins: [vuexLocal.plugin]
})