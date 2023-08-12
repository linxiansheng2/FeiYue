<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script setup lang="ts">
import { ref, reactive ,onMounted, computed } from 'vue'
import { getAssetURL } from '@/common/load_asset'
import { useRouter } from  'vue-router'
import $api  from '../https'
import {useStore} from 'vuex'
const $store = useStore();
const router = useRouter();
// 首页数据
const Store:any = reactive({data:{
  loading:false,  //加载
  banner:[],      //banner
  bulletin:[],    //公告
  cooperate:[],   //合作伙伴
  czmoneylist:[], //充值渠道
  mediaData:[
  {txt:'LOGOIPSUM002 has, as a reputable and one of the most well-known crypto platforms'},
  {txt:'Heavy hitter when it comes to the sheer amount of coins available, LOGOIPSUM002 provides access to a wide library of altcoins at low fees.'},
  {txt:'comes to the sheer amount of coins available'},
  {txt:'comes to LOGOIPSUM002 provides access to a wide library of '},
  ],              //媒体评价
  mediaBody:'',   //媒体评价文本
  active:0,       //行情索引
  hotcoinactive:0,//二级行情
  czmoneyIndex:0, //充值渠道索引
  swiperIndex:1,  //媒体评价索引
  showSelect:false,//充值下拉表
  swiperWidth:100,//banner宽度
  product:1,      //产品查询
  productList:[], //产品列表
}})

// 充值登录后显示
const loginStore = computed(()=>$store.state.login);

const onDeposit = (event:any) => {
  const {dataset} = event.target;
  Store.data.czmoneyIndex = dataset.index-1;
  Store.data.showSelect = false
}

// 跳转充值
const onCzmoney = () => {
  router.push({
    path:'/assetcenter/withdraw',
    query:{
      active:1,
      id:Store.data.czmoneylist[Store.data.czmoneyIndex].id
    }
  })
}

// 媒体评价切换
const onChange = (index:number) => {
  Store.data.swiperIndex = index+1;
  Store.data.mediaBody = Store.data.mediaData[index].txt;
}

// 切换行情
const onClickTab = async (event:Event|any) => {
  const res = await $api.getQQJYproduct(event.name+1);
  Store.data.productList = res.data;
}

let requestArr = [
  $api.getHomeBanner(),
  $api.getBulletin(0),
  $api.getCooperate(1,20),
  $api.getUsermoneylist(),
  $api.getQQJYproduct(Store.data.product)
]
onMounted(()=>{
  Store.data.swiperWidth = document.documentElement.clientWidth*0.65;
  window.addEventListener('resize', () => { Store.data.swiperWidth = document.documentElement.clientWidth*0.65;})
  Store.data.mediaBody = Store.data.mediaData[0].txt;  
  Promise.all(requestArr)
  .then((res:any[])=>{
    if(res.includes(undefined)) return
    Store.data.banner = res[0].rows;
    Store.data.bulletin = res[1].rows;
    Store.data.cooperate = res[2].rows;
    Store.data.czmoneylist = res[3].rows;
    Store.data.productList = res[4].data;
    // console.log(res);
    Store.data.loading = true;
  })
  .catch((err)=>{
    console.log(err);
  })
})

</script>

<template>
    <div v-if="Store.data.loading">
        <!-- poster start -->
        <section class="poster-wrap">
          <div class="poster-box">
            <div class="posterTitle">{{$t('home.posterTitle')}}</div>
            <div class="posterText">{{$t('home.posterText')}}</div>
            <div class="posterTip">
            <img class="posterTip-img" src="../assets/silder/tip.png"/>
              {{$t('home.posterTip')}}<span class="posterSpan">255 USDT</span>
            </div>
          </div>
        </section>

        <!-- banner start -->
        <section class="banner-wrap" v-show="Store.data.banner.length">
            <div class="banner-box">
              <van-swipe :autoplay="5000"  
              :width="Store.data.swiperWidth" :show-indicators="false" loop>
                <van-swipe-item v-for="item in Store.data.banner" :key="item['id']">
                  <img :src="item['img']" />
                </van-swipe-item>
              </van-swipe>
            </div>
        </section>

        <!-- czmoneny start -->
        <section class="deposit-wrap" v-show="loginStore">
          <div class="deposit-box">
            <div class="head">
              <span class="title">{{$t('home.cztitle')}}</span>
              <span class="subtitle">{{$t('home.czsubtitle')}}</span>
            </div>
            <div class="content">
              <div class="content-left">
                  <div class="content-item">
                    <div class="content-mask" @click="Store.data.showSelect = !Store.data.showSelect"></div>
                    <img class="content-img" :src="Store.data.czmoneylist[Store.data.czmoneyIndex].Icon">
                    <div>{{ `${Store.data.czmoneylist[Store.data.czmoneyIndex].ZSname} - ${Store.data.czmoneylist[Store.data.czmoneyIndex].Lname}` }}</div>
                    <div class="content-icon">
                      <van-icon :name="!Store.data.showSelect?'arrow-down':'arrow-up'" />
                    </div>
                </div>
                <!-- down -->
                <div class="content-select" v-show="Store.data.showSelect">
                  <div class="content-item" v-for="item in Store.data.czmoneylist" :key="item.id" @click="onDeposit" :class="{'active': Store.data.czmoneyIndex == item.id}">
                    <div class="content-mask" :data-index="item.id"></div>
                    <img class="content-img" :src="item.Icon">
                    <div>{{`${item.ZSname} - ${item.Lname}`}}</div>
                  </div>
                </div>
              </div>

              <div class="content-btn" @click="onCzmoney">{{$t('home.cz')}}</div>
            </div>
          </div>
        </section>

        <!-- news start -->
        <section class="news-wrap" v-if="Store.data.bulletin.length">
            <div class="news-box">
              <van-swipe class="news-swiper" :autoplay="2000" style="height: 50px;" vertical :show-indicators="false">
                <van-swipe-item v-for="(item,index) in Store.data.bulletin" :key="index">
                  <div class="news-item">
                    <van-cell center to="/proclamation">
                      <template #title>
                        <van-tag color="#00C693">New</van-tag>
                        <span class="custom-time">{{item.update_time}}</span>
                      </template>
                      <template #right-icon>
                        <van-icon name="arrow" />
                      </template>
                      <template #label>
                        <span class="news-title">{{item.title}}</span>
                      </template>
                    </van-cell>
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
        </section>

        <!-- hotcoin-tab start -->
        <section class="hotcoin-wrap">

          <div class="hotcoin-child">
            <van-tabs v-model:active="Store.data.hotcoinactive" @click-tab="onClickTab" shrink>
              <van-tab>
                <template #title>
                   <span class="hotcoin-child-title">USDT</span>
                </template>
              </van-tab>
              <van-tab>
                <template #title>
                   <span class="hotcoin-child-title">Web3</span>
                </template>
              </van-tab>
              <van-tab>
                <template #title>
                   <span class="hotcoin-child-title">NFT</span>
                </template>
              </van-tab>
            </van-tabs>
          </div>
          <div class="hotCurrency-wrap">
            <div class="hotCurrency-list">
              <div class="hotCurrency-head flex">
                <p class="hot-lefttxt">{{$t('home.hotCurrency_left')}}</p>
                <p class="hot-centertxt">{{$t('home.hotCurrency_center')}}</p>
                <p class="hot-righttxt">{{$t('home.hotCurrency_right')}}</p>
              </div>
              <van-divider />
              <div class="hotCurrency-item flex" v-for="(item,index) in Store.data.productList" :key="index">
                <div class="hotCurrency-mask" :class="{'front':item.riseRate > 0}"></div>
                <div class="hotCurrency-name">
                  <img class="hotCurrency-img" :src="item.Ioc"/>
                  <span class="hotCurrency-tit">{{item.name}}</span>
                </div>
                <div class="hotCurrency-price">${{ item.close }}</div>
                <div class="hotCurrency-arc" :class="{'front':item.riseRate > 0}">{{ item.riseRate > 0 ? `+${item.riseRate}` : `${item.riseRate}` }}%</div>
              </div>
            </div>
          </div>
        </section>

        <!-- enroll start -->
        <section class="enroll-wrap">
          <div class="layout">
            <div class="home-tip">{{$t('home.enroll_tip')}}</div>
            <van-button class="enroll-button" type="primary" color="#2850E7" block @click="$router.push('/options')">{{$t('home.enroll_btn')}}</van-button>
          </div>
        </section>

        <!-- products start -->
        <section class="cus-card-wrap">
          <div class="layout">
            <h2 class="sectionTitleCen">{{ $t('home.products_title') }}</h2>
            <van-divider />
            <div class="products-list">
              
              <div class="products-item" v-for="products in 9" :key="products">
                <img class="products-img" :src="getAssetURL(`silder/product_${products-1}.png`)" />
                <div class="products-title"><span>{{ $t(`home.products_item${products}`) }}</span></div>
              </div>
            </div>

          </div>
        </section>

        <!-- Choose us start -->
        <section class="choose-wrap">
          <div class="layout">
            <h2 class="sectionTitle">{{ $t('home.whyus') }}</h2>
            <div class="choose-list">
              <div class="choose-item" v-for="item in 4" :key="item">
                <div class="choose-img"><img :src="getAssetURL(`silder/whychoseus_${item-1}.png`)" /></div>
                <div class="choose-info">
                  <div class="choose-ftit">{{$t(`home.feature${item}_title`)}}</div>
                  <p class="choose-desc">{{$t(`home.feature${item}_desc`)}}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- media start -->
        <section class="media-wrap">
          <div class="layout">
            <h2 class="sectionTitle">{{ $t('home.media') }}</h2>
            <div class="media-box">
              <van-swipe @change="onChange" :autoplay="2000">
                <van-swipe-item v-for="index in 4" :key="index" class="cus-swiper-item" :class="{'active':Store.data.swiperIndex == index}">
                  <div class="user-avatar">
                    <img :src="getAssetURL(`silder/media_${index-1}.png`)" />
                  </div>
                  <p class="user-name">Coinmarketcap</p>
                </van-swipe-item>
                <!-- <template #indicator="{ active, total }"> -->
                <template #indicator>
                  <div class="custom-indicator">
                    <van-text-ellipsis
                      rows="7"
                      :content="Store.data.mediaBody"
                    />
                  </div>
                </template>
              </van-swipe>
            </div>
            
          </div>
        </section>

        <!-- platformInfo start -->
        <section class="cus-card-wrap">
          <div class="layout">
            <h2 class="sectionTitleCen">{{ $t('home.platformInfo') }}</h2>
            <van-divider />
        <div class="platformInfo-list">
          <div class="platformInfo-item" v-for="(item,index) in Store.data.cooperate" :key="item.id">
            <div class="platformInfo-img">
              <img class="platformInfo-logo" :src="item.img" />
            </div>
          </div>
        </div>
          </div>
        </section>

        <Cus-Footer></Cus-Footer>
    </div>
</template>

<style scoped lang="less">
@wrapPadd: 0 15px;
@transparent:transparent;
// 弹性盒子
.flex-dom(@justify){
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: @justify;
    justify-content: @justify;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

/*多行文本溢出...*/
.multiEllipsis(@line:2) {
    overflow : hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
}

.deposit-wrap{
  padding: @wrapPadd;
  margin: 10px 0;
  .deposit-box{
    .head{
      .flex-dom(flex-start);
      margin-bottom: 5px;
      .title{
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        color: rgba(0,0,0,.8);
      }
      .subtitle{
        margin-left: 10px;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 150%;
        color: rgba(0,0,0,.5);
      }
    }
    .content{
      height: 38px;
      line-height: 38px;
      .flex-dom(space-between);
      .content-left{
        flex-basis: 65%;
        position: relative;
        .content-select{
          position: absolute;
          left: 0;
          top: 105%;
          width: 100%;
          background: #fff;
          box-shadow: 0 1px 12px rgba(0,0,0,.08);
          border-radius: 10px;
          z-index: 2;
          overflow: hidden;
          .content-item{
            border-radius: 0;
          }
          .content-item.active{
            color: #3c5fe7;
            background: rgba(116,143,237,.2);
          }
        }
      }
      .content-item{
        position: relative;
        .flex-dom(flex-start);
        border-radius: 8px;
        background-color: #fff;
        padding: 0 8px;
        .content-img{
          width: 25px;
          height: 25px;
          margin-right: 10px;
        }
        .content-mask{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }
        .content-icon{
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .content-btn{
        text-align: center;
        margin-left: 13px;
        height: 38px;
        background: -webkit-linear-gradient(359.84deg,#00c693 .14%,#00c693 102.99%);
        background: linear-gradient(90.16deg,#00c693 .14%,#00c693 102.99%);
        border-radius: 10px;
        line-height: 38px;
        color: #fff;
        flex-basis: 30%;
        font-size: 16px;
      }
    }
  }
}

// 
.cus-card-wrap{
  padding: @wrapPadd;
  margin-top: 30px;
  .layout{
    background: #fff;
    border-radius: 15px;
    padding: 10px 0;
  }
}

.sectionTitle{
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: rgba(0,0,0,.6);
  margin-bottom: 15px;
}
.sectionTitleCen{
  font-weight: 500;
  font-size: 16px;
  color: rgba(0,0,0,.6);
  text-align: center;
}
.poster-wrap{
  position: relative;
  font-style: normal;
  text-align: center;
  margin-top: 18px;
  padding: @wrapPadd;
  .poster-box{
    border-radius: 15px;
    background: #fff;
    padding: 15px;
    .posterTitle{
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    color: #4d4d4d;
    text-transform: capitalize;
    word-break:break-word;
  }
  .posterText{
    margin: 18px 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 25px;
    color: rgba(0,0,0,.8);
  }
  .posterTip{
    display: inline-block;
    padding: 5px 10px;
    background: rgba(0,198,147,.1);
    border-radius: 8px;
    font-size: 14px;
    color: rgba(0,0,0,.8);
    .posterTip-img{
      width: 16px;
      height: 16px;
      position: relative;
      top: 3px;
    }
    .posterSpan{
      color: #2ba6fd;
    }
  }
  }

}

// banner
.banner-wrap{
  position: relative;
  height: auto;
  max-height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
  .banner-box{
    padding: 15px 0 0 15px;
    .van-swipe-item{
      height: 105px;
      img{
        height: 100%;
        border-radius: 13px;
        width: 98%;
        padding-right: 2%;
      }
    }
  }
  img{
    width: 100%;
  }
}

// news
.news-wrap{
  padding: @wrapPadd;
  .news-box{
    border-radius: 10px;
    overflow: hidden;
    padding: 10px;
    background: #fff;
    .news-swiper{
    .van-cell{
      padding: 0;
    }
  }
  }
  .news-item{
    text-align: left;
    .custom-time{
      font-weight: 600;
      color: #4d4d4d;
      font-size: 15px;
      padding-left: 10px;
    }
    .news-title{
      .multiEllipsis(1);
    }
  }
}

// hotcoin
.hotcoin-wrap{
  --van-tabs-nav-background:@transparent;
  --van-font-bold:400;
  --van-padding-sm:0;
  --van-padding-xs:0;
  --van-tabs-line-height:auto;
  padding: @wrapPadd;
  background: #F4F6F8;

  .hotcoin-child{
    --van-tabs-bottom-bar-color:#2850E7;
    --van-tabs-bottom-bar-height:1px;
    --van-tabs-bottom-bar-width:22px;
    .hotcoin-child-title{
      padding: 12px 12px 5px;
      display: block;
    }
  }
}

// hotCurrency-wrap
.hotCurrency-wrap{
  background: #fff;
  border-radius: 13px;
  .hotCurrency-list{
    padding: 8px;
    .flex{
      .flex-dom(space-between);
    }
    .hotCurrency-head{
      font-size: 16px;
      color: rgba(0,0,0,.6);
      .hot-centertxt{text-align: center;}
      p{
        flex-basis: 33.333%;
      }
      .hot-lefttxt{
        text-align: left;
      }
      .hot-righttxt{
        text-align: right;
      }
    }
    .hotCurrency-item{
      position: relative;
      font-size: 16px;
      padding: 6px;
      height: 45px;
      .hotCurrency-mask{
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        background: -webkit-linear-gradient(left,rgba(230,93,68,0),rgba(230,93,68,.2) 50%,rgba(230,93,68,.3) 80%,rgba(230,50,46,.4));
        background: linear-gradient(90deg,rgba(230,93,68,0),rgba(230,93,68,.2) 50%,rgba(230,93,68,.3) 80%,rgba(230,50,46,.4));
        -webkit-animation: hotCurrency 1s .6s ease both;
        -moz-animation: hotCurrency 1s .6s ease both;
        animation: hotCurrency 1s .6s ease both;
      }
      .hotCurrency-mask.front{
        background: -webkit-linear-gradient(left,rgba(36,170,113,0),rgba(36,170,113,.2) 50%,rgba(48,229,152,.3) 80%,rgba(36,170,113,.8));
        background: linear-gradient(90deg,rgba(36,170,113,0),rgba(36,170,113,.2) 50%,rgba(48,229,152,.3) 80%,rgba(36,170,113,.8));
      }
      .hotCurrency-name{
        .flex-dom(flex-start);
        .hotCurrency-img{
          height: 33px;
          width: 33px;
          margin-right: 5px;
        }
      }
      .hotCurrency-price{
        flex-basis: 40%;
        text-align: center;
        .multiEllipsis(1);
      }
      .hotCurrency-arc{
        background: red;
        padding: 5px 10px;
        border-radius: 5px;
        color: #fff;
        font-size: 15px;
      }
      .hotCurrency-arc.front{
        background: #00C693;

      }
      
    }
    .hotCurrency-item:not(:first-child){
        margin-top: 10px
      }
  }
}


// enroll-wrap
.enroll-wrap{
  padding: @wrapPadd;
  .home-tip{
    margin: 52px 43px;
      font-weight: 500;
      font-size: 16px;
      line-height: 150%;
      text-align: center;
      color: rgba(0,0,0,.6);
  }
  --van-button-radius:15px;
  .enroll-button{
    padding: 26px;
    font-size: 20px;
  }

}

// products
.products-list{
      padding: 8px;
      gap: 10px;
      .flex-dom(space-between);
      flex-wrap: wrap;
      align-items: stretch;
      .products-item{
        .flex-dom(center);
        flex-basis: 31%;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        flex-direction: column;
        padding: 18px 5px;
        font-size: 13px;
        background: #fff;
        box-shadow: 0 0 6px rgba(69,112,254,.24);
        border-radius: 8px;
        .products-img{
          height: 40px;
          width: 40px;
          margin-bottom: 6px;
        }
        .products-title{
          width: 100%;
          text-align: center;
          overflow: hidden;
          .multiEllipsis(2);
          font-weight: bold;
        }
      }
    }
// choose
.choose-wrap{
  padding: @wrapPadd;
  padding-top: 45px;
  padding-bottom: 45px;
  text-align: left;
  .layout{
    .choose-list{
      align-items: center;
      .choose-item{
        .flex-dom(flex-start);
        padding-top: 15px;
        .choose-img{
          height: 50px;
          width: 50px;
          margin-right: 25px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .choose-info{
          width: 80%;
        }
        .choose-ftit,
        .choose-desc{
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          color: rgba(0,0,0,.6);
        }
        .choose-desc{
          margin-top: 7px;
          font-size: 12px;
          word-break: keep-all;
        }
      }
      
    }
    .choose-list:not(:first-child){
      margin-top: 20px;
    }
  }
}

// media
.media-wrap{
  padding: @wrapPadd;
  --van-tabs-line-height:130px;
  .layout{
    padding: 0;
    .sectionTitle{
      text-align: left;
    }
    .media-box{
      position: relative;
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      .cus-swiper-item{
        .flex-dom(center);
        flex-direction: column;
        .user-avatar{
          width: 87px;
          height: 87px;
          border-radius: 50%;
          box-shadow: 0 0 0 1px transparent inset;
          position: relative;
          img{
            width: 60px;
            height: 60px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .user-name{
          padding-top: 9px;
          font-family: Lato;
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          text-align: center;
          color: rgba(0,0,0,.6);
        }
      }
      .cus-swiper-item.active{
        .user-avatar{
          box-shadow: 0 0 0 1px rgba(103,71,170,.11) inset;
        }

      }
      .custom-indicator{
        position: relative;
        margin: 20px auto 0;
        padding: 15px 30px;
        color: #000;
        font-weight: 400;
        font-size: 16px;
        text-align: center;
        background: #fff;
        border: 1px solid rgba(115,126,141,.16);
        border-radius: 10px;
        min-height: 100px;
        --van-text-ellipsis-line-height:1.2;
      }
    }
  }
}

// platformInfo
.platformInfo-list{
  .flex-dom(space-evenly);
  flex-wrap: wrap;
  padding: 10px 0 0;
  .platformInfo-item{
    padding: 0 15px 10px;
    margin-bottom: 13px;
    .platformInfo-img{
        width: 100px;
        height: 27px;
      .platformInfo-logo{
        width: 100%;
        height: 100%;
      }
    }
  }
}

@keyframes hotCurrency{
  0%{
    opacity: 0;
    -webkit-transform: translateX(-50%);
  }
  100%{
    opacity: .5;
    -webkit-transform: translateX(0);
  }
}


</style>