import Vue from 'vue';
import Vuex from 'vuex';
import api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fridges: [],
    ingredients: [],
    status: {
      loading: false,
      success: false,
      error: false,
    },
  },
  getters: {
    fridges: state => state.fridges,
    ingredients: state => state.ingredients,
  },
  mutations: {
    LOADING(state) {
      state.status = {
        loading: true,
        success: false,
        error: false,
      };
    },
    SUCCESS(state) {
      state.status = {
        loading: false,
        success: true,
        error: false,
      };
    },
    ERROR(state, error) {
      state.status = {
        loading: false,
        success: false,
        error,
      };
    },
    SET_FRIDGES(state, payload) {
      state.fridges = payload;
    },
    SET_INGREDIENTS(state, payload) {
      state.ingredients = payload;
    },
  },
  actions: {
    getFridges(context) {
      context.commit('LOADING');
      api.fetchFridges().then(res => {
        context.commit('SET_FRIDGES', res);
        context.commit('SUCCESS');
      });
    },
    getIngredients(context, payload) {
      context.commit('LOADING');
      api.fetchIngredients(payload).then(res => {
        context.commit('SET_INGREDIENTS', res);
        context.commit('SUCCESS');
      });
    },
    addIngredient(context, payload) {
      context.commit('LOADING');
      api.addIngredient(payload).then(res => {
      });
    },
    deleteIngredient(context, payload) {
      context.commit('LOADING');
      api.deleteIngredient(payload).then(res => {
      });
    },
  },
});
