<template>
  <div class="admin-page">
    <section class="new-post">
      <!-- eslint-disable-next-line prettier/prettier -->
      <AppButton @click="$router.push('/admin/new-post')"
        >Create Post</AppButton
      >
      <!-- eslint-disable-next-line prettier/prettier -->
      <AppButton @click="onLogout" style="margin-left: 10px">Logout</AppButton>
    </section>
    <section class="existing-posts">
      <h1>Existing Posts</h1>
      <PostList :posts="loadedPosts" is-admin />
    </section>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout')
      this.$router.push('/admin/auth')
    }
  }
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>
