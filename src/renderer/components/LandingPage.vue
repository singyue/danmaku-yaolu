<template>
  <div id="wrapper">
    <div id="yaolu-logo" @click="update">
      <img title="妖鹿获取弹幕中" src="http://image1.xiaohulu.com/15/4765a2094dabe3cd4be4e019d3827ff3.jpg">
    </div>
    <main>
      <transition-group name="danmaku">
        <div class="danmaku-box"
          v-for="danmaku in danmakuList"
          :key="danmaku.transCount">
          <div v-if="danmaku.type == 'connected'" class="msg-connected">妖鹿直播间175连接成功😊</div>
          <div v-else-if="danmaku.type == 'error'" class="msg-error">妖鹿不好了，连接失败😫</div>
          <div v-else-if="danmaku.type == 'live'" class="msg-live">妖鹿开始直播啦💪</div>
          <div v-else-if="danmaku.type == 'preparing'" class="msg-preparing">妖鹿直播已结束，下次再见！♨️</div>
          <div v-else-if="danmaku.type == 'comment'" class="msg-comment">
            <span v-if="danmaku.user.guard > 0" class="guard-user"></span>
            <span v-if="danmaku.user.isSVIP " class="svip-user">爷</span>
            <span v-else-if="danmaku.user.isVIP" class="vip-user">爷</span>
            <span v-if="danmaku.user.badge" class="user-badge" :class="userBadgeLevelColor(danmaku.user.badge.level)"><span class="user-badge-title">{{ danmaku.user.badge.title }}</span><span class="user-badge-level">{{ danmaku.user.badge.level }}</span></span>
            <span v-if="danmaku.user.title" class="user-title"><img :src="titleImage(danmaku.user.title.source)"></span>
            <span v-if="danmaku.user.level" class="user-level" :class="userLevelColor(danmaku.user.level)">{{ "UL "+danmaku.user.level }}</span>
            <span class="user-name">{{ danmaku.user.name }}:</span>
            <span class="user-comment">{{ danmaku.comment }}</span>
          </div>
          <div v-else>{{ danmaku }}</div>
        </div>
      </transition-group>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import Live from 'bilibili-live'
  import { mapGetters } from 'vuex'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    computed: mapGetters({
      danmakuList: 'danmakuList',
      isInit: 'isInit'
    }),
    methods: {
      titleImage (source) {
        if (!source) {
          return ''
        }
        let uri = source.replace('title-', 'title/')
        return `http://s1.hdslb.com/bfs/static/blive/live-assets/${uri}.png`
      },
      userLevelColor (level) {
        return 'user-level-' + Math.ceil(Number(level) / 10)
      },
      userBadgeLevelColor (level) {
        return 'user-badge-level-' + Math.ceil(Number(level) / 4)
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      update () {
        if (this.isInit) {
          return
        }
        new Live.Room({
          url: 5057470,
          useWebsocket: true,
          useWSS: true,
          useGiftBundle: true
        }).connect().then(room => {
          if (!room) {
            return
          }
          room
            .on('danmaku.connected', () => {
              let msg = {
                type: 'connected'
              }
              this.$store.commit('ADD_DANMAKU', {
                danmaku: msg
              })
            })
            .on('danmaku.error', () => {
              let msg = {
                type: 'error'
              }
              this.$store.commit('ADD_DANMAKU', {
                danmaku: msg
              })
            })
            .on('danmaku.preparing', () => {
              let msg = {
                type: 'preparing'
              }
              this.$store.commit('ADD_DANMAKU', {
                danmaku: msg
              })
            })
            .on('danmaku.live', () => {
              let msg = {
                type: 'live'
              }
              this.$store.commit('ADD_DANMAKU', {
                danmaku: msg
              })
            })
            .on('danmaku.message', (msg) => {
              if (msg.type === 'comment') {
                if (msg.comment === '- ( ゜- ゜)つロ 乾杯~ - bilibili') {
                  return
                }
                this.$store.commit('ADD_DANMAKU', {
                  danmaku: msg
                })
              }
            })
        })
        this.$store.commit('START_DANMU_SERVICE', {})
      }
    },
    watch: {
      danmakuList (val) {
        if (val.length > 5) {
          this.$store.commit('SLICE_DANMAKU', {})
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body 
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif

  #wrapper {
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  #yaolu-logo img 
    width 130px
    height 130px
    display block
    border-radius 50%
    border 5px solid #fff
    margin 0 auto
    cursor pointer

  main {
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }

  .danmaku-page
    height 100vh
    overflow hidden
  .reset-hint
    background-color rgba(25,25,25,.4)
  .toolbar
    position absolute
    left 0
    bottom 0
    width 100%
    display flex
    border-radius 5px
    overflow hidden
    .item
      flex 1
      color #fff
      background-color rgba(25,25,25,.8)
    .item + .item
      margin-left 1px
    .online
      display inline-block
      padding 5px 8px
      font-size 14px
      line-height 16px
      flex 3
      span
        float right
  .danmaku-enter
    opacity 0
    transform translateY(100%)
  .danmaku-leave-to
    opacity 0
    transform translateY(-75%)
  .danmaku-enter-active
    transition all 1s
  .danmaku-leave-active
    transition all 1s
  .danmaku-list
    position absolute
    left 0
    width 100%
    border-radius 5px
    overflow hidden
  .danmaku-box
    width: 100%
    padding 4px 8px
    user-select none
    cursor default
    color #fff
    .admin-user
      padding 1px 2px
      border-radius 4px
      background-color #ea9336
    .vip-user
      padding 1px 2px
      border-radius 4px
      background-color #f25d8e
    .svip-user
      padding 1px 2px
      border-radius 4px
      background-color #ffb100
    .user-name
      color #23ade5
    .user-level
      padding 0 2px
      border-radius 4px
      border-width 1px
      border-style solid
    .user-level-1
      color #939393
    .user-level-2
      color #5dbb57
    .user-level-3
      color #5595d9
    .user-level-4
      color #9a65ed
    .user-level-5
      color #fc84ae
    .user-level-6
      color #fc953a
    .user-badge
      border-width 1px
      border-style solid
      border-radius 4px
      overflow hidden
      .user-badge-title
        padding 0 4px
      .user-badge-level
        border-top-right-radius 3px
        border-bottom-right-radius 3px
        padding 0 3px
    .user-badge-level-1
      background-color #61decb
      border-color #61decb
      .user-badge-level
        background-color #fff
        color #61decb
    .user-badge-level-2
      background-color #5896de
      border-color #5896de
      .user-badge-level
        background-color #fff
        color #5896de
    .user-badge-level-3
      background-color #a068f1
      border-color #a068f1
      .user-badge-level
        background-color #fff
        color #a068f1
    .user-badge-level-4
      background-color #ff86b2
      border-color #ff86b2
      .user-badge-level
        background-color #fff
        color #ff86b2
    .user-badge-level-5
      background-color #f6be18
      border-color #f6be18
      .user-badge-level
        background-color #fff
        color #f6be18
    .user-title
      img
        vertical-align middle
    .guard-user
      display inline-block
      vertical-align top
      background-image url(http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png)
    .guard-user-1
      background-position 100% 0
    .guard-user-2
      background-position 50% 0
    .guard-user-3
      background-position 0% 0
    .guard-user-gift
      display inline-block
      width 32px
      height 32px
      vertical-align bottom
      background-image url(http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png)
      background-size auto 32px
    .msg-gift
      .gift-img > img
        height 32px
      .user-name
        color #ff8f34
    .success
      color #19be6b
    .failed
      color #ed3f14
  
</style>
