<template>
  <div class="">
    <tinymce v-model="content" />
    <div v-html="content"></div>
  </div>
</template>

<script>
import tinymce from '@/components/Tinymce';
export default {
  name: 'TinymceDemo',
  components: { tinymce },
  data() {
    return {
      content: '123'
    };
  },
  mounted() {
  },
  methods: {}
};
</script>

<style scoped lang="scss">

</style>
