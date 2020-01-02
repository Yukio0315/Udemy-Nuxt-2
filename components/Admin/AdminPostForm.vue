<template>
  <form @submit.prevent="onSave">
    <!-- eslint-disable-next-line prettier/prettier -->
    <AppControlInput v-model="editedPost.author">Author Name</AppControlInput>

    <AppControlInput v-model="editedPost.title">Title</AppControlInput>

    <!-- eslint-disable-next-line prettier/prettier -->
    <AppControlInput v-model="editedPost.thumbnail"
      >Thumbnail Link</AppControlInput
    >>
    <!-- eslint-disable-next-line prettier/prettier -->
    <AppControlInput v-model="editedPost.content" control-type="textarea"
      >Content</AppControlInput
    >
    <!-- eslint-disable-next-line prettier/prettier -->
    <AppControlInput v-model="editedPost.previewText" control-type="textarea"
      >PreviewText</AppControlInput
    >
    <AppButton type="submit">Save</AppButton>

    <!-- eslint-disable-next-line prettier/prettier -->
    <AppButton
      @click="onCancel"
      type="button"
      style="margin-left: 10px"
      btn-style="cancel"
    >
      >
      <!-- eslint-disable-next-line prettier/prettier -->
      Cancel
    </AppButton>
  </form>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      editedPost: this.post
        ? { ...this.post }
        : {
            author: '',
            title: '',
            thumbnail: '',
            content: '',
            previewText: '',
            updatedDate: ''
          }
    }
  },
  methods: {
    onSave() {
      this.editedPost.updatedDate = new Date().toString()
      this.$emit('submit', this.editedPost)
    },
    onCancel() {
      this.$router.push('/admin')
    }
  }
}
</script>
