// import { start } from "repl";

const state = {
  main: 0,
  danmakuList: [],
  danmakuCount: 0,
  isInit: false
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  },
  ADD_DANMAKU (state, payload) {
    console.log(payload)
    let danmaku = payload.danmaku
    state.danmakuCount++
    danmaku.transCount = '' + state.danmakuCount
    state.danmakuList.push(payload.danmaku)
  },
  SLICE_DANMAKU (state) {
    state.danmakuList = state.danmakuList.slice(-5)
  },
  START_DANMU_SERVICE (state) {
    state.isInit = true
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

const getters = {
  danmakuList: state => state.danmakuList,
  isInit: state => state.isInit
}

export default {
  state,
  mutations,
  actions,
  getters
}
