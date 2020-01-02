import Vuex from 'vuex'

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
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            vuexContext.commit('setPosts', [
              {
                id: '1',
                // author: 'Test',
                previewText: 'test',
                title: 'Title',
                // content: 'This is sample',
                thumbnail: ''
              },
              {
                id: '2',
                // author: 'Test',
                previewText: 'test2',
                title: 'Title2',
                // content: 'This is sample2',
                thumbnail: ''
              }
            ])
            resolve()
          }, 1000)
        })
          .then((data) => {
            context.store.commit('setPosts', data.createdPosts)
          })
          .catch((e) => {
            context.error(new Error())
          })
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
