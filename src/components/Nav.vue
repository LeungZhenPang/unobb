<template>
  <div id="nav">
    导航
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
    <input type="text" v-model="wd">
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      wd: ''
    }
  },
  // https://www.baidu.com/sugrec
  mounted () {
      axios.get('/api/sugrec', {
        params: {
          prod: 'pc',
          wd : '二建'
        }
      })
      .then( res => {console.log(res.data.data)})
      .catch( err => {console.log(err)})
    }
}
</script>

<style lang="less" scoped>

</style>
