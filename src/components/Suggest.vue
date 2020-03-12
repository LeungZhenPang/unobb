<template>
  <div class="wrap">
    <div class="main">
      <h2>意见填写</h2>
      <textarea 
       cols="30" rows="6" 
       v-model="suggestContent"
       placeholder="如果您有优质的网址推荐或其他建议请尽情填写">
       </textarea>
      <input type="text" v-model="contact" placeholder="您的联系方式（选填）">
      <div class="btn-group">
        <button class="suggest-post-btn" @click="postSuggest()">提交</button>
        <button class="contact-btn" id="contact-btn">联系站长</button>
      </div>
      <div class="close-btn" @click='closeSuggest()'>×</div>
    </div>
  </div>
</template>

<script>
import Axios from "axios"
export default {
  data () {
    return {
      suggestContent: '',
      contact: ''
    }
  },
  methods: {
    closeSuggest() {
      this.$emit('closeSuggest')
    },
    async postSuggest(){
      let params = `content=${this.suggestContent}&contact=${this.contact}`
      let {data} = await Axios.post('https://www.unobb.cn/unobb_suggest/receive.php',params)
      console.log(data)
      alert('提交成功,万分感谢！')
      this.closeSuggest()
    }
  }
}
</script>

<style lang="less" scoped>
  .wrap {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .main {
    position: relative;
    background: #fff;
    border-radius: 10px;
    padding: 24px 32px;
    h2 {
      color: #676767;
      margin-bottom: 10px;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
    }
    textarea {
      padding: 6px;
      width: 400px;
      line-height: 1.5;
      display: block;
      margin-top: 10px;
      border: 1px solid #bfc0c1;
      border-radius: 4px;
    }
    input {
      display: block;
      width: 200px;
      height: 32px;
      padding-left: 6px;
      margin-top: 10px;
      margin-bottom: 20px;
      border: 1px solid #bfc0c1;
      border-radius: 4px;
    }
  }

  .btn-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    button {
      margin-left: 10px;
      padding:8px 10px;
      border-radius: 4px;
      border: none;
      outline: none;
      cursor: pointer;
      color: #fff;
      &.suggest-post-btn{
        background: #4481cc;
      }
      &.contact-btn{
        background: #1b7d27;
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 6px;
    right: 8px;
    color: #666;
    font-size: 24px;
    cursor: pointer;
  }
</style>