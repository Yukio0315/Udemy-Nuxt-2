<template>
  <section class="post-list">
    <!-- eslint-disable-next-line prettier/prettier -->
    <PostPreview id="1" :is-admin="isAdmin" thumbnail title="test" preview-text="Hello world" />
    <!-- eslint-disable-next-line prettier/prettier -->
    <PostPreview id="2" :is-admin="isAdmin" thumbnail title="test2" preview-text="Hello world" />
    <!-- eslint-disable-next-line prettier/prettier -->
    <PostPreview id="3" :is-admin="isAdmin" thumbnail title="test3" preview-text="Hello world" />
  </section>
</template>

<script>
import PostPreview from './PostPreview'
export default {
  components: {
    PostPreview
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
