<template>
  <div class="wrap" @mousewheel="go">
    <!-- 主页面 -->
    <transition-group tag="ul" name="fade" class="clearfix content" v-for="(items,index) in curData" :key='index' v-show='curIndex == index'>
      <li v-for="(item,n) in items" :key="n" :class="{transition: transitionLi, toleft, toright}"
      @click="addWeb(item)"
      @click.right.prevent="delWeb(item)">
        <a class="clearfix" :href="item.link" :key='n' target='_blank'>
          <img :src='"./images/"+item.pic+".png"' :alt="item.name" />
          <div>
            <h3>{{item.name}}</h3>
            <p>{{item.description}}</p>
          </div>
        </a>
      </li>
    </transition-group>

    <!-- 底部小圆点 -->
    <ul class="clearfix xiaoyuandian" :style="{marginLeft: -curData.length * 10 + 'px'}">
      <li v-for="(items,index) in curData" :class="{active:curIndex == index}" :key='index' @click="curIndex = index"></li>
    </ul>
  </div>
</template>

<script>
import webData from './data'
import { turquoise } from 'color-name';
export default {
  data() {
    return {
      curIndex: 0, //当前索引
      curData: [], //当前显示数据
      showCount: 4,        //显示网页数
      webData,     //网页的所有数据
      transitionLi: false,  //切换路由li动画
      toleft: false,  //左切屏动画
      toright: false,  //右切屏动画
      gotime: ''     //保存切屏延时器
    };item
  },
  methods: {
      //删除最近浏览
      delWeb(item){
        if(this.$route.params.name === 'zuijin'){
          let arr = JSON.parse(localStorage.getItem('zuijin'))
          let index = arr.findIndex((even)=>even.name === item.name)
          arr.splice(index, 1)
          localStorage.setItem('zuijin',JSON.stringify(arr))
          this.webData.zuijin = JSON.parse(localStorage.getItem('zuijin'))
          this.transformArr(this.webData[this.$route.params.name])
        }
      },
      addWeb(item){     //添加最近点击网站
        if(!localStorage.getItem("zuijin")){
          let arr = JSON.stringify([item])
          localStorage.setItem('zuijin',arr)
        }else{
          let arr = JSON.parse(localStorage.getItem('zuijin'))
          let have = arr.some((even)=>even.name === item.name)    //查看是否已经存在
          if(!have){    //不存在则添加
            arr.unshift(item)
            localStorage.setItem('zuijin',JSON.stringify(arr))
            this.webData.zuijin = JSON.parse(localStorage.getItem('zuijin'))
          }
        }
      },
      //滚动切屏
      go(){
        if(event.wheelDelta < 0 && this.curIndex < this.curData.length-1) {     //滚轮下滑
          clearTimeout(this.gotime)     //清楚上次滚轮延时器，避免索引多次增加
          this.toright = true         //左移动画
          this.gotime = setTimeout(() => {      //左移动画结束后，索引增加，新元素添加右移动画再删除，形成左移效果
            this.curIndex += 1
            this.toright = false
            this.toleft = true
            setTimeout(() => {      //由于增加后立即删除无动画效果，所以延长一段时间删除
              this.toleft = false
            }, 150);
          }, 200);
        }else if (event.wheelDelta > 0 && this.curIndex > 0){     //滚轮上滑
          clearTimeout(this.gotime)
          this.toleft = true
          this.gotime = setTimeout(() => {
            this.curIndex -= 1
            this.toleft = false
            this.toright = true
            setTimeout(() => {
              this.toright = false
            }, 150);
          }, 200);
        }
      },
        //转换成二维数组
      transformArr(arr) {
        let remainHeigth = document.body.clientHeight - 310
        this.showCount = parseInt(remainHeigth/128) * 4
        this.curData = [];
        let minArr = [];
        arr.forEach((item, index) => {
          minArr.push(item);
          if (minArr.length == this.showCount || arr.length - 1 == index) {
            this.curData.push(minArr);
            minArr = [];
          }
        });
        if(this.curIndex > this.curData.length-1){this.curIndex = this.curData.length - 1}  //页数变少时索引到最后页
      }
  },
  watch: {
    //监听路由器变化
    $route(to, from) {
      this.transitionLi = true    //路由切换动画
      setTimeout(() => {      //动画结束前10毫秒，重新加载数据，如果动画结束时间和重新渲染时间一致可能会导致切换完动画再渲染
        this.transformArr(this.webData[this.$route.params.name])
        this.curIndex = 0
        setTimeout(() => {
          this.transitionLi = false
        }, 30);
      }, 200);
    }
  },
  created() {
    this.webData.zuijin = JSON.parse(localStorage.getItem('zuijin'))
    this.transformArr(this.webData[this.$route.params.name])
  },
  mounted() {
      //监听窗口变化转换数组
    window.addEventListener('resize',() => {
        this.transformArr(this.webData[this.$route.params.name])
    })
  }
};
</script>

<style lang="less" scoped>
.wrap {
  width: 1200px;
  margin: 0 auto;
}
.content {
  li {
    position: relative;
    left: 0;
    float: left;
    width: 248px;
    height: 88px;
    margin: 20px 26px;
    transition: all .3s ease-out;
    &.toleft {
      left: 200px;
      opacity: 0;
    }
    &.toright {
      left: -200px;
      opacity: 0;
    }
    &.transition {
      img {
        transform: rotateX(90deg);
      }
      h3 {
        left: 40px;
        opacity: 0.5;
        transform: skew(-20deg)
      }
      p {
        left: 20px;
        opacity: 0;
        transform: skew(-20deg)
      }
    }
    &:hover {
      img {
        top: -6px;
      }
      h3 {
        left: 0;
        color: #5d98f4;
        margin-left: 4px;
      }
      &::after {
        opacity: 0.6;
      }
    }
    &::after {
      content: "";
      width: 60px;
      height: 2px;
      background: #000;
      position: absolute;
      left: 14px;
      top: 88px;
      border-radius: 50%;
      -webkit-filter: blur(3px);
      filter: blur(3px);
      opacity: 0;
      transition: all 0.2s ease-out;
      -webkit-transition: all 0.2s ease-out;
    }
    img {
      position: relative;
      top: 0;
      float: left;
      border-radius: 44px;
      transform-origin: 0% 100%;
      transition: all 0.2s ease-out;
    }
    div {
      float: left;
      width: 144px;
      padding-left: 16px;
      h3 {
        position: relative;
        left: 0;
        margin-bottom: 2px;
        font-size: 24px;
        line-height: 32px;
        font-weight: 500;
        color: #666;
        transition: all .2s ease-out;
      }
      p {
        position: relative;
        left: 0;
        font-size: 14px;
        line-height: 24px;
        color: #c3c3c3;
        display: -webkit-box; /*将对象作为弹性伸缩盒子模型显示*/
        -webkit-box-orient: vertical; /*设置或检索伸缩盒对象的子元素的排列方式*/
        -webkit-line-clamp: 2; /*用来限制在一个块元素显示的文本的行数*/
        overflow: hidden;
        transition: all .2s ease-out;
      }
    }
  }
}
.xiaoyuandian {
  position: absolute;
  bottom: 10px;
  left: 50%;
  li {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 5px;
    border-radius: 5px;
    background: #ccc;
    cursor: pointer;
    &.active {
      background: #5d98f4;
    }
  }
}

.fade-enter, .fade-leave {
  opacity:0;
}
.fade-enter-active{
  transition:all .2s;
}
.fade-leave-active{
  opacity:0;
  transition:all .2s;
}
</style>