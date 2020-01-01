<template>
  <section class="post-list">
    <PostPreview id="1" thumbnail title="test" preview-text="Hello world" />
    <PostPreview id="2" thumbnail title="test2" preview-text="Hello world" />
    <PostPreview id="3" thumbnail title="test3" preview-text="Hello world" />
  </section>
</template>

<script>
import PostPreview from './PostPreview'
export default {
  components: {
    PostPreview
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
