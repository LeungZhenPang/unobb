<template>
  <div id="app">
    <Nav></Nav>
    <el-button>el-button</el-button>
  </div>
</template>

<script>
import Nav from './components/Nav'
export default {
  name: 'app',
  components: {
    Nav
  }
}
</script>

<style>
body {
  background:url('./assets/images/body_bg.jpg')
}
</style>
