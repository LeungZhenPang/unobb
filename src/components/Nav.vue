<template>
  <div id="nav">
    <div class="banner"></div>
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
          <span class="el-icon-arrow-down" :class="{active:isShowTypeList}"></span>
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
            @keyup.enter="startSearch"
            @keyup.down="searchSugIndex < searchSug.length-1?searchSugIndex += 1: searchSugIndex = 0;wd = searchSug[searchSugIndex].q"
            @keyup.up="searchSugIndex < searchSug.length-1?searchSugIndex -= 1: searchSugIndex = 0;wd = searchSug[searchSugIndex].q"
          />
          <ul v-show="isShowSearchSug">
            <li
              :class="{active: searchSugIndex == index }"
              v-for="(items,index) in searchSug"
              @mouseenter="searchSugIndex = index; wd = items.q"
              @click="startSearch"
            >{{items.q}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowTypeList: false, //是否现实搜索类型
      isShowSearchSug: false,   //显示搜索建议
      wd: "", //搜索关键字
      searchTypeIndex: 0, //搜索类型索引值
      searchWebIndex: 0, //搜索网站索引值
      searchSugIndex: -1, //搜索建议索引值
      searchSug: "", //搜索建议数据
      searchData: [
        //渲染所需数据
        {
          searchType: "搜索",
          data: [
            {
              name: "百度",
              link: "https://www.baidu.com/s?wd=",
              placeholder: "百度一下你就知道"
            },
            {
              name: "doge",
              link: "https://www.dogedoge.com/results?q=",
              placeholder: "不追踪，不误导"
            },
            {
              name: "微博",
              link: "https://s.weibo.com/weibo/",
              placeholder: "迅速搜索最热门话题"
            },
            {
              name: "必应",
              link: "https://cn.bing.com/search?q=",
              placeholder: "微软Bing搜索引擎"
            },
            {
              name: "微信",
              link: "https://weixin.sogou.com/weixin?type=2&query=",
              placeholder: "搜索微信文章"
            },
            {
              name: "知乎",
              link: "https://www.zhihu.com/search?type=content&q=",
              placeholder: "搜索知乎文章"
            },
            {
              name: "搜狗",
              link: "https://www.sogou.com/web?query=",
              placeholder: "搜狗搜索"
            },
            {
              name: "360搜索",
              link: "https://www.so.com/s?q=",
              placeholder: "360搜索引擎"
            },
            {
              name: "秘迹",
              link: "https://mijisou.com/?q=",
              placeholder: "搜索..."
            }
          ]
        },
        {
          searchType: "图片",
          data: [
            {
              name: "花瓣",
              link: "https://huaban.com/search/?q=",
              placeholder: "搜索你喜欢的"
            },
            {
              name: "Pexels",
              link: "https://www.pexels.com/search/",
              placeholder: "用英文搜索"
            }
          ]
        }
      ]
    };
  },
  methods: {

    //加载搜索建议
    async loadSearchSug() {
      if (!this.wd) {
        this.isShowSearchSug = false;
        return false;
      }
      this.searchSugIndex = -1;
      const { data } = await axios.get("/sugrec", {
        params: {
          prod: "pc",
          wd: this.wd
        }
      });
      // console.log(data);
      this.searchSug = data.g;
      data.g ? this.isShowSearchSug = true :this.isShowSearchSug = false
    },

    // 开始搜索
    startSearch() {
      window.open(
        this.searchData[this.searchTypeIndex].data[this.searchWebIndex].link +
          this.wd
      );
      this.isShowSearchSug = false;
    }
  },

  mounted() {
    let _this = this;
    // 点击空白处
    document.addEventListener('click', function (e) {
    　_this.isShowTypeList = false;
      _this.isShowSearchSug = false; 
    })
    //搜索框聚焦
    _this.$refs.inputSearch.focus();
  }
};
</script>

<style lang="less" scoped>
@baseColor: #5d98f4;
.banner {
  height: 100px;
  max-width: 1920px;
  margin-bottom: 20px;
  background: url('../assets/images/banner.jpg') center center no-repeat;
}
.search-wrap {
  width: 600px;
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
    margin: 10px 10px;
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
      padding: 4px;
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
    width: 500px;
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
</style>
