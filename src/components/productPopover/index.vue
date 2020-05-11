<template>
  <el-popover
    placement="top-start"
    width="250"
    trigger="hover">
    <el-image
      :src="data.image"
      fit="contain"
    >
    </el-image>
    <span class="popover-span">{{ data.subject }}</span>
    <a class="popover-a" slot="reference">{{ reference }}</a>
  </el-popover>
</template>

<script>
export default {
  name: 'productPopover',
  data() {
    return {
    }
  },
  props: {
    data: {
      image: '',
      subject: ''
    },
    reference: ''
  }
}
</script>
<style lang="scss" scoped>
.popover-span {
  font-size: 13px;
  color: #999;
}
.popover-a {
  color: #409EFF;
}
</style>
