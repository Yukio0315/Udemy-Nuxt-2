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
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          (post) => post.id === editedPost.id
        )
        state.loadedPosts[postIndex] = editedPost
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
      },
      addPost(vuexContext, post) {
        firebase
          .database()
          .ref()
          .push(post)
          .then(vuexContext.commit('addPost', post))
      },
      editPost(vuexContext, editedPost) {
        firebase
          .database()
          .ref(editedPost.id)
          .update(editedPost)
          .then(vuexContext.commit('editPost', editedPost))
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
