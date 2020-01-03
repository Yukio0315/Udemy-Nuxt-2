import Vuex from 'vuex'
import moment from 'moment'
import Cookie from 'js-cookie'
import firebase from '~/plugins/firebase'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token
      },
      clearToken(state) {
        state.token = null
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
      },
      async authenticateUser(vuexContext, authData) {
        if (authData.isLogin) {
          await firebase
            .auth()
            .signInWithEmailAndPassword(authData.email, authData.password)
            .catch((e) => console.log(e))
        }
        if (!authData.isLogin) {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .catch((e) => console.log(e))
        }
        await firebase
          .auth()
          .signInWithEmailAndPassword(authData.email, authData.password)
          .catch((e) => console.log(e))
        await firebase
          .auth()
          .currentUser.getIdTokenResult(true)
          .then((result) => {
            vuexContext.commit('setToken', result.token)
            localStorage.setItem('token', result.token)
            localStorage.setItem('tokenExpiration', result.expirationTime)
            Cookie.set('jwt', result.token)
            Cookie.set('expirationDate', result.expirationTime)
            vuexContext.dispatch(
              'setLogoutTimer',
              moment(result.expirationTime).diff(moment())
            )
          })
      },
      setLogoutTimer(vuexContext, duration) {
        setTimeout(() => {
          vuexContext.commit('clearToken')
        }, duration)
      },
      initAuth(vuexContext, req) {
        let token = ''
        let expirationDate = ''
        if (req) {
          if (req) {
            if (!req.headers.cookie) {
              return
            }
          }
          const jwtCookie = req.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('jwt='))
          if (!jwtCookie) {
            return
          }
          token = jwtCookie.split('=')[1]
          expirationDate = req.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('expirationDate='))
            .split('=')[1]
        } else {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')

          if (new Date().getTime() > +expirationDate || !token) {
            return
          }
        }
        vuexContext.dispatch(
          'setLogoutTimer',
          expirationDate - new Date().getTime()
        )
        vuexContext.commit('setToken', token)
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
      isAuthenticated(state) {
        return state.token != null
      }
    }
  })
}

export default createStore
