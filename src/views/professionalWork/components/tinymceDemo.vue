<template>
  <div class="tiny-demo" id="demo11">
    <div id="demo333">1</div>
    <tinymce v-model="content" class="tinymce1" />
    <!-- <div v-html="content"></div> -->
    <div id="demo222">2</div>
  </div>
</template>

<script>
import tinymce from '@/components/Tinymce'
export default {
  name: 'TinymceDemo',
  components: { tinymce },
  data() {
    return {
      content: '123',
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.tiny-demo {
  height: 100%;
  overflow: hidden;
}
.tinymce1 {
  width: 600px !important;
  margin: auto;
  position: relative;
  margin-top: 100px;
}
#demo222,
#demo333 {
  width: 100%;
  height: 100px;
}
</style>
