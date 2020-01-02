<template>
  <div class="single-post-page">
    <section class="post">
      <h1 class="post-title">{{ loadedPost.title }}</h1>
      <div class="post-details">
        <!-- eslint-disable-next-line prettier/prettier -->
        <div class="post-detail">
          Last updated on {{ loadedPost.updatedDate }}
        </div>
        <div class="post-detail">Written by {{ loadedPost.author }}</div>
      </div>
      <p>{{ loadedPost.content }}</p>
    </section>
    <section class="post-feedback">
      <p>
        Let me know what you think about the post, send a mail to
        <!-- eslint-disable-next-line prettier/prettier -->
        <a href="feedback@my-awesome-domain.com"></a>
      </p>
    </section>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'

export default {
  async asyncData(context) {
    let result = {}
    await firebase
      .database()
      .ref(context.params.id)
      .once('value')
      .then((s) => {
        result = s.val()
      })
      .catch((e) => context.error(e))
    return { loadedPost: result }
  }
}
</script>

<style scoped>
.single-post-page {
  padding: 30px;
  text-align: center;
  box-sizing: border-box;
}

.post {
  width: 100%;
}

@media (min-width: 768px) {
  .post {
    width: 600px;
    margin: auto;
  }
}

.post-title {
  margin: 0;
}

.post-details {
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 3px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 768px) {
  .post-details {
    flex-direction: row;
  }
}

.post-detail {
  color: rgb(88, 88, 88);
  margin: 0 10px;
}

.post-feedback a {
  color: red;
  text-decoration: none;
}

.post-feedback a:hover,
.post-feedback a:active {
  color: salmon;
}
</style>
