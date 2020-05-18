<template>
  <div id="nav">
    <!-- 顶部banner部分 -->
    <div class="banner" @mousemove="lightMove">
      <div class="shapes">
        <div class="shape shape-1" :style="{left: cursorX3 + 'px',top: cursorY3 + 'px'}"></div>
        <div class="shape shape-2" :style="{left: cursorX2 + 'px',top: cursorY2 + 'px'}"></div>
        <div class="shape shape-3" :style="{left: cursorX + 'px',top: cursorY + 'px'}"></div>
      </div>
      <div class="banner-top" :class="isNight?'night-bg':'day-bg'"></div>
      <div class="cursor-bg" :style="{left: cursorX + 'px',top: cursorY + 'px'}"></div>

      <!-- 天气 -->
      <div class="weather" v-if="weather">
        <div :class="weatherClass"></div>
        <div class="weather-txt">
          <p>
            <span class="iconfont icon-weizhi"></span>
            {{weather.city}}
          </p>
          <p>{{weather.tem}}°C {{weather.wea}}</p>
        </div>
      </div>
    </div>
    <!-- 搜索wrap -->
    <div class="search-wrap">
      <div class="clearfix">
        <!-- 提示角标 -->
        <div class="fl search-tip">
          Alt+Q
          <span class="el-icon-right"></span>
        </div>

        <!-- 搜索的具体网站 -->
        <ul class="clearfix search-web fl">
          <li
            :class="{active: index == searchWebIndex}"
            v-for="(items,index) in searchData[searchTypeIndex].data"
            :key="index"
            @click="searchWebIndex = index; $refs.inputSearch.focus()"
          >{{items.name}}</li>
        </ul>
      </div>

      <!-- 搜索主体 -->
      <div class="main clearfix">
        <!-- 左边选择类型部分 -->
        <div class="type" @click.stop="isShowTypeList = !isShowTypeList">
          {{searchData[searchTypeIndex].searchType}}
          <span
            class="iconfont icon-xiala"
            :class="{active:isShowTypeList}"
          ></span>
          <!-- 下拉选择框 -->
          <transition name="fade">
            <div class="type-list" v-show="isShowTypeList" @mouseleave="isShowTypeList = false">
              <span class="xiaosanjiao"></span>
              <ul>
                <li
                  v-for="(items, index) in searchData"
                  :key="index"
                  @click="searchTypeIndex = index; searchWebIndex = 0; $refs.inputSearch.focus()"
                >{{items.searchType}}</li>
              </ul>
            </div>
          </transition>
        </div>

        <!-- 右边输入框 -->
        <div class="content">
          <input
            type="text"
            v-model="wd"
            :placeholder="searchData[searchTypeIndex].data[searchWebIndex].placeholder"
            ref="inputSearch"
            @input="loadSearchSug"
            @keyup.alt.q="searchWebIndex < searchData[searchTypeIndex].data.length-1?searchWebIndex += 1: searchWebIndex = 0"
            @keyup.enter.exact="startSearch"
            @keyup.down.exact="searchSugIndex < searchSug.length-1?searchSugIndex += 1: searchSugIndex = 0;wd = searchSug[searchSugIndex]"
            @keyup.up.exact="searchSugIndex < searchSug.length-1?searchSugIndex -= 1: searchSugIndex = 0;wd = searchSug[searchSugIndex]"
            @keyup.space.stop
          />
          <!-- 清空搜索小按钮 -->
          <div
            class="clear-input"
            v-show="wd===''?false:true"
            @click="wd = '';$refs.inputSearch.focus()"
          >×</div>
          <!-- 搜索建议 -->
          <ul v-show="isShowSearchSug">
            <li
              :class="{active: searchSugIndex == index }"
              v-for="(items,index) in searchSug"
              @mouseenter="searchSugIndex = index"
              @click="startSearch(items)"
              :key="index"
            >{{items}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/font/iconfont.css";
import searchData from "./searchData";
import Vue from "vue";
import jsonp from "vue-jsonp"; //引入jsaonp
import Axios from "axios";
Vue.use(jsonp);

export default {
  data() {
    return {
      isShowTypeList: false, //是否现实搜索类型
      isShowSearchSug: false, //显示搜索建议
      wd: "", //搜索关键字
      searchTypeIndex: 0, //搜索类型索引值
      searchWebIndex: 0, //搜索网站索引值
      searchSugIndex: -1, //搜索建议索引值
      searchSug: "", //搜索建议数据
      searchData, //渲染搜索网站的数据
      cursorX: 0,
      cursorY: 0,
      cursorX2: 0,
      cursorY2: 0,
      cursorX3: 0,
      cursorY3: 0,
      weather: null, //保存天气数据
      weatherClass: "rainbow", //天气动画类名
      isNight: false //是否晚上
    };
  },
  methods: {
    // jsonpFunc(data) {
    //   console.log(data.s)
    // },
    //鼠标在banner处移动时，获取鼠标位置
    lightMove(e) {
      this.cursorX = e.clientX - 50;
      this.cursorY = e.clientY - 50;
      setTimeout(() => {
        this.cursorX2 = e.clientX - 50;
        this.cursorY2 = e.clientY - 50;
      }, 80);
      setTimeout(() => {
        this.cursorX3 = e.clientX - 50;
        this.cursorY3 = e.clientY - 50;
      }, 160);
    },

    //加载搜索建议
    loadSearchSug() {
      if (!this.wd) {
        this.isShowSearchSug = false;
        return false;
      }
      this.searchSugIndex = -1;
      //Request url will be http://suggestion.baidu.com/su?wd=关键词&cb=jsonpFunc
      Vue.jsonp("http://suggestion.baidu.com/su", {
        wd: this.wd,
        callbackQuery: "cb",
        callbackName: "jsonpFunc"
      }).then(data => {
        let jsonpFunc = function() {};
        this.searchSug = data.s;
        data.s.length != 0
          ? (this.isShowSearchSug = true)
          : (this.isShowSearchSug = false); //结果不为空显示搜索建议
      });
    },

    // 开始搜索
    startSearch(items) {
      if (typeof items == "string") {
        this.wd = items;
      }
      this.isShowSearchSug = false;
      window.open(
        this.searchData[this.searchTypeIndex].data[this.searchWebIndex].link +
          this.wd
      );
      this.$refs.inputSearch.select();
    },

    //获取天气数据
    async getWeather() {
      let { data } = await Axios({
        method: "get",
        url: "https://v1.alapi.cn/api/tianqi/now"
      });
      this.weather = data.data;
      let hours = new Date().getHours();
      hours >= 6 && hours < 20 ? (this.isNight = false) : (this.isNight = true);

      switch(this.weather.wea_img){
        case 'yin':
        case 'yun':
          this.weatherClass = 'cloudy'
          break;
        case 'yu':
          this.weatherClass = 'rainy'
          break;
        case 'qing':
          this.isNight? this.weatherClass = 'starry': this.weatherClass = 'sunny'
          break
        default:
          this.weatherClass = 'rainbow'
      }
    }
  },

  mounted() {
    let _this = this;
    // 点击空白处
    document.addEventListener("click", function(e) {
      _this.isShowTypeList = false;
      _this.isShowSearchSug = false;
    });
    //搜索框聚焦
    _this.$refs.inputSearch.focus();

    //点击空格搜索框获取焦点或全选
    document.addEventListener("keyup", function(event) {
      if (event.keyCode == 32) {
        _this.$refs.inputSearch == ""
          ? _this.$refs.inputSearch.focus()
          : _this.$refs.inputSearch.select();
      }
    });

    //获取天气数据
    this.getWeather();
    setInterval(this.getWeather.bind(this),1200000)
  }
};
</script>

<style lang="less" scoped>
@baseColor: #5d98f4;
@import url("../../src/assets/css/weather.css");
.banner {
  position: relative;
  overflow: hidden;
  cursor: none;
  height: 100px;
  margin: 0 auto 20px;
  // background: url('../assets/images/banner.jpg') center center no-repeat;
  background-color: #fff;
  // cursor: none;
  .shapes {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .shape {
      position: absolute;
    }
    .shape-1 {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: #499af3;
    }
    .shape-2 {
      width: 80px;
      height: 80px;
      margin: 40px;
      border-radius: 50%;
      background: #ffe5e3;
    }
    .shape-3 {
      width: 40px;
      height: 40px;
      margin: 60px;
      border-radius: 50%;
      background: #ffcc57;
    }
  }
  .banner-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .night-bg {
    background: url("../assets/images/banner_top_night.png") center center;
  }
  .day-bg {
    background: url("../assets/images/banner_top_day.png") center center;
  }
  .cursor-bg {
    position: absolute;
    width: 53px;
    height: 53px;
    margin: 60px;
    border-radius: 50%;
    background: url("../assets/images/cursor_bg.png");
  }
}
.search-wrap {
  width: 660px;
  margin: 0 auto;
}
.search-tip {
  margin-top: 6px;
  margin-left: 8px;
  padding: 4px;
  font-size: 10px;
  background: #84c17c;
  color: #fff;
  border-radius: 4px;
  transform: scale(0.82);
}
.search-web {
  li {
    float: left;
    padding: 10px 10px;
    color: #ccc;
    cursor: pointer;
    &.active {
      color: @baseColor;
    }
  }
}
.main {
  & > div {
    float: left;
  }
  .type {
    position: relative;
    width: 80px;
    height: 40px;
    padding-left: 16px;
    line-height: 40px;
    font-weight: 600;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    font-size: 16px;
    color: #fff;
    background: @baseColor;
    cursor: pointer;
    & > span {
      display: inline-block;
      transition: 0.3s linear;
      &.active {
        transform: rotate(180deg);
      }
    }
    .type-list {
      position: absolute;
      top: 50px;
      left: 0px;
      width: 80px;
      text-align: center;
      font-size: 14px;
      line-height: 30px;
      border: 1px solid #ddd;
      border-radius: 6px;
      color: #90b6f1;
      background: #fff;
      z-index: 99;
      ul {
        padding: 6px 0px;
        li:hover {
          background: #f1f1f1;
        }
      }
      .xiaosanjiao {
        position: absolute;
        top: -6px;
        left: 20px;
        width: 8px;
        height: 8px;
        background: #fff;
        border-left: 1px solid #ddd;
        border-top: 1px solid #ddd;
        transform: rotate(45deg);
      }
    }
  }
  .content {
    position: relative;
    height: 40px;
    width: 570px;
    padding-top: 10px;
    background: #fff;
    border: 1px solid @baseColor;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    input {
      width: 98%;
      padding-left: 8px;
      border: none;
      outline: none;
    }
    .clear-input {
      position: absolute;
      top: 8px;
      right: 10px;
      color: #ccc;
      font-size: 20px;
      cursor: pointer;
    }
    ul {
      position: absolute;
      top: 42px;
      left: 0px;
      width: 500px;
      line-height: 24px;
      background: #fff;
      border: 1px solid #ccc;
      box-shadow: 2px 4px 5px #f2f2f2;
      z-index: 99;
      li {
        padding-left: 10px;
        color: #8a8a8a;
        cursor: pointer;
        &.active {
          background: #eee;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  margin-top: -10px;
  opacity: 0;
}

.weather {
  position: absolute;
  top: 0;
  left: 50%;
  color: #fff;
  margin-left: 300px;
  .weather-txt {
    position: absolute;
    left: 120px;
    top: 20px;
    font-size: 20px;
    line-height: 32px;
    p {
      width: 150px;
    }
    .icon-weizhi {
      margin-right: 10px;
      font-size: 24px;
    }
  }
}
</style>
