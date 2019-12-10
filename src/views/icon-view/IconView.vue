<template>
  <div class="wrap" @mousewheel="go">
    <ul class="clearfix content" v-for="(items,index) in curData" :key='index' v-show='curIndex == index'>
      <li v-for="(item,n) in items">
        <a class="clearfix" :href="item.link" :key='n' target='_blank'>
          <img :src='"./images/"+item.pic+".jpg"' :alt="item.name" />
          <div>
            <h3>{{item.name}}</h3>
            <p>{{item.description}}</p>
          </div>
        </a>
      </li>
    </ul>
    <ul class="clearfix xiaoyuandian" :style="{marginLeft: -curData.length * 10 + 'px'}">
      <li v-for="(items,index) in curData" :class="{active:curIndex == index}" :key='index' @click="curIndex = index"></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curIndex: 0, //当前索引
      curData: [], //当前显示数据
      showCount: 4,        //显示网页数
      webData: {
        tuijian: [
          {
            name: "推荐1",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "推荐2",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "推荐3",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "推荐4",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "推荐5",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          }
        ],
        bangdan: [
          {
            name: "榜单6",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "榜单7",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "榜单8",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "榜单9",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          },
          {
            name: "榜单0",
            description: "这里有一建、二建",
            pic: "zhongjiaowenhua",
            link: "https://www.baidu.com"
          }
        ]
      },
    };
  },
  methods: {
      //滚动切屏
      go(){
          if(event.wheelDelta < 0 && this.curIndex < this.curData.length-1) {
              this.curIndex += 1
          }else if (event.wheelDelta > 0 && this.curIndex > 0){
              this.curIndex -= 1
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
    $route(to, from) {
      this.transformArr(this.webData[this.$route.params.name])
      this.curIndex = 0
    }
  },
  created() {
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
    float: left;
    width: 248px;
    height: 88px;
    margin: 20px 26px;
    &:hover {
      img {
        top: -6px;
      }
      h3 {
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
      transition: all 0.3s ease-out;
    }
    div {
      float: left;
      width: 144px;
      padding-left: 16px;
      h3 {
        margin-bottom: 10px;
        font-size: 24px;
        line-height: 32px;
        font-weight: 500;
        color: #666;
        transition: all 0.3s ease-out;
      }
      p {
        font-size: 14px;
        line-height: 24px;
        color: #c3c3c3;
        display: -webkit-box; /*将对象作为弹性伸缩盒子模型显示*/
        -webkit-box-orient: vertical; /*设置或检索伸缩盒对象的子元素的排列方式*/
        -webkit-line-clamp: 2; /*用来限制在一个块元素显示的文本的行数*/
        overflow: hidden;
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
</style>