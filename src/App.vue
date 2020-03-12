<template>
  <div id="app">
    <Nav></Nav>

    <span 
    class="suggest-btn" 
    @click="isShowSuggest = !isShowSuggest"
    >
    →&nbsp;意见反馈
    </span>

    <!-- 路由导航 -->
    <div class="router-nav">
      <ul class="clearfix">
        <router-link
          v-for="(item,index) in routerNavData"
          :key="index"
          :class="{active: item.link == $route.params.name}"
          @click.native="routerNavIndex = index"
          :to="'/'+ item.link"
          tag="li"
        >
          <span class="iconfont" :class="item.icon"></span>
          <br />
          {{item.name}}
          <div class="line"></div>
        </router-link>
      </ul>
    </div>

    <router-view></router-view>

    <!-- 建议框 -->
    <div class="suggest-wrap" v-show="isShowSuggest">
      <transition name="suggest-fade">
        <Suggest v-show="isShowSuggest"
        @closeSuggest="closeSuggest()"></Suggest>
      </transition>
    </div>
  </div>
</template>

<script>
import "./assets/font/iconfont.css";
import Nav from "./components/Nav";
import Suggest from "./components/Suggest";
export default {
  name: "app",
  data() {
    return {
      routerNavData: [
        //路由导航渲染数据
        { name: "榜单", link: "bangdan", icon: "icon-bangdan" },
        { name: "推荐", link: "tuijian", icon: "icon-tuijian" },
        { name: "视频", link: "shipin", icon: "icon-shipin" },
        { name: "音乐", link: "yinyue", icon: "icon-tubiaozhizuomobanyihuifu-"},
        { name: "电影", link: "dianying", icon: "icon-dianying" },
        { name: "直播", link: "zhibo", icon: "icon-airudiantubiaohuizhi-zhuanqu_zhibojian" },
        { name: "男生", link: "nansheng", icon: "icon-nanxing" },
        { name: "女生", link: "nvsheng", icon: "icon-iconnvhai" },
        { name: "旅游", link: "lvyou", icon: "icon-lvyou" },
        { name: "摄影", link: "sheying", icon: "icon-ziyuan" },
        { name: "设计", link: "sheji", icon: "icon-shejishi1" },
        { name: "程序员", link: "chengxuyuan", icon: "icon-daimaguanli" },
        { name: "外贸", link: "waimao", icon: "icon-maoyijinchukoulingshoupifa"},
        { name: "每日", link: "meiri", icon: "icon-taiyang" },
        { name: "工具", link: "gongju", icon: "icon-icon-test" }
      ],
      isShowSuggest: true    //控制显示意见反馈
    };
  },
  components: {
    Nav,
    Suggest
  },
  methods: {
    closeSuggest() {
      this.isShowSuggest = !this.isShowSuggest
    }
  }
};
</script>

<style lang="less" scoped>
@baseColor: #5d98f4;
#app {
  height: 100%;
  background: url("./assets/images/body_bg.jpg");
}
.router-nav {
  position: relative;
  width: 1200px;
  margin: 30px auto 20px;
  border-bottom: 1px solid #ddd;
  li {
    float: left;
    width: 80px;
    margin-bottom: -2px;
    padding-bottom: 10px;
    text-align: center;
    color: #bfbfbf;
    cursor: pointer;
    &:hover {
      color: @baseColor;
    }
    &.active {
      color: @baseColor;
      .line {
        width: 80px;
      }
    }
    span {
      font-size: 32px;
      display: inline-block;
      margin-bottom: 8px;
    }
  }
  .line {
    position: relative;
    top: 10px;
    margin: 0 auto;
    width: 0px;
    height: 3px;
    background: @baseColor;
    transition: all 0.3s ease-in-out;
  }
}

.suggest-btn{
  position: absolute;
  bottom: 10px;
  left: 50%;
  margin-left: 520px;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 4px;
  color: #b7b7b7;
  border: 1px solid #d6d6d6;
  cursor: pointer;
}

// 建议框底部遮罩
.suggest-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
}

//建议弹框动画
.suggest-fade-enter-active,
.suggest-fade-leave-active {
  transition: all .5s;
}
.suggest-fade-enter, .suggest-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
