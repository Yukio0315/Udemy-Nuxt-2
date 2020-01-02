import Vuex from 'vuex'
import firebase from '~/plugins/firebase'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return firebase
          .database()
          .ref()
          .once('value')
          .then((s) => {
            const postsArray = []
            for (const key in s.val()) {
              postsArray.push({ ...s.val()[key], id: key })
            }
            vuexContext.commit('setPosts', postsArray)
          })
          .catch((e) => context.error(e))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      }
    }
  })
}

export default createStore
