<template>
  <div class="demo-image__preview">
    <el-image 
      :style="'width: ' + size+'; height: ' + size"
      :src="url" 
      :preview-src-list="[url]">
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'imagePreview',
  data() {
    return {
    }
  },
  props: {
    url: '',
    size: {
      default: '80px'
    }
  },
  methods: {
    click() {
      this.$emit('click', this.data)
    }
  }
}
</script>
