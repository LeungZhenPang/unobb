<template>
  <div id="nav">
    <!-- 搜索wrap -->
    <div class="search-wrap">

      <!-- 搜索的具体网站 -->
      <ul class="clearfix search-web">
        <li
         :class="{active: index == searchWebIndex}" 
         v-for="(items,index) in searchData[searchTypeIndex].data" 
         :key='index'
         @click="searchWebIndex = index"
         >
           {{items.name}}
         </li>
      </ul>

      <!-- 搜索主体 -->
      <div class="main clearfix">
        <!-- 左边选择类型部分 -->
        <div class="type" @click="typeList = !typeList">
          {{searchData[searchTypeIndex].searchType}}<span class="el-icon-arrow-down" :class="{active:typeList}"></span>
          <!-- 下拉选择框 -->
          <transition name="fade">
            <div class="type-list" v-show="typeList" @mouseleave="typeList = false">
              <span class="xiaosanjiao"></span>
              <ul>
                <li 
                v-for="(items, index) in searchData" 
                :key='index' 
                @click='searchTypeIndex = index; searchWebIndex = 0'
                >
                  {{items.searchType}}
                </li>
              </ul>
            </div>
          </transition>
        </div>

        <!-- 右边输入框 -->
        <div class="content">
          <input 
          type="text" 
          :placeholder="searchData[searchTypeIndex].data[searchWebIndex].placeholder" 
          ref='inputSearch' 
          @keyup="loadSearchSug" 
          @keyup.tab.prevent="searchWebIndex < searchData[searchTypeIndex].data.length-1?searchWebIndex += 1: searchWebIndex = 0"
          v-model="wd"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      typeList: false,    //是否现实搜索类型
      wd: '',      //搜索关键字
      searchTypeIndex: 0,   //搜索类型索引值
      searchWebIndex: 0,   //搜索网站索引值
      searchData: [
        {searchType: '搜索', data: [
          {name: '百度', link: 'https://www.baidu.com/s?wd=', placeholder: '百度一下你就知道'},
          {name: '必应', link: 'https://cn.bing.com/search?q=', placeholder: '微软Bing搜索引擎'}
        ]},
        {searchType: '图片', data: [
          {name: '花瓣', link: 'https://huaban.com/search/?q=', placeholder: '搜索你喜欢的'},
          {name: 'Pexels', link: 'https://www.pexels.com/search/', placeholder: '用英文搜索'}
        ]}
      ]
    }
  },
  methods: {
    loadSearchSug () {    //加载搜索建议
      if(!this.wd){return}
      axios.get('/sugrec', {
        params: {
          prod: 'pc',
          wd : this.wd
        }
      })
      .then( res => {console.log(res.data)})
      .catch( err => {console.log(err)})
    }
  },
  mounted () {
      this.$refs.inputSearch.focus()
    }
}
</script>

<style lang="less" scoped>
  @baseColor:#5d98f4;
  .search-wrap {
    width: 600px;
    height: 100px;
    margin: 0 auto;
    border: 1px solid #f2f2f2;
  }
  .search-web {
    li {
      float: left;
      margin: 10px 10px;
      color: #ccc;
      cursor: pointer;
      &.active {
        color: @baseColor
      }
    }
  }
  .main {
    &>div{
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
      &>span {
        padding: 4px;
        transition: .3s linear;
        &.active{
         transform: rotate(180deg);
        }
      }
      .type-list {
        position: absolute;
        top: 50px;
        left: 0px;;
        width: 80px;
        text-align: center;
        font-size: 14px;
        line-height: 30px;
        border: 1px solid #ddd;
        border-radius: 6px;
        color: #90b6f1;
        background: #fff;
        ul {
          padding: 6px 0px;
          li:hover {
            background:#f1f1f1;
          }
        }
        .xiaosanjiao {
          position: absolute;
          top:-6px;
          left: 20px;
          width: 8px;
          height: 8px;
          background: #fff;
          border-left: 1px solid #ddd;
          border-top: 1px solid #ddd;
          transform: rotate(45deg)
        }
      }
    }
    .content {
      height: 40px;
      width: 500px;
      padding-top: 10px;
      background:#fff;
      border: 1px solid @baseColor;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      input {
        width: 98%;
        padding-left: 8px;
        border: none;
        outline: none;
      }
    }
  }

.fade-enter-active, .fade-leave-active {
  transition: all .2s ease-in-out;
}
.fade-enter, .fade-leave-to {
  margin-top: -10px;
  opacity: 0;
}
</style>
