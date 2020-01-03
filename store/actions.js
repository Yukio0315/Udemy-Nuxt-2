import Cookie from 'js-cookie'
import firebase from '~/plugins/firebase'

export default {
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
      })
    const authenticated = await this.$axios.$post(
      'http://localhost:3000/api/track-data',
      {
        data: 'Authenticated!'
      }
    )
    return authenticated
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
        vuexContext.commit('clearToken')
        vuexContext.dispatch('logout')
        return
      }
    }
    vuexContext.commit('setToken', token)
  },
  logout(vuexContext) {
    vuexContext.commit('clearToken')
    Cookie.remove('jwt')
    Cookie.remove('expirationDate')
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
    }
  }
}
