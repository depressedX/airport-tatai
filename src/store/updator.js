// 下次刷新数据时间
// 每隔5分钟刷新一下数据
import store from "./store";

let nextUpdatorTimer = null

// 在整点刷新
function refreshOnFixedTime() {
    clearTimeout(nextUpdatorTimer)
    let now = new Date(store.getters.now)
    let minutes = Math.floor((now.getMinutes() + 5) / 5) * 5 - now.getMinutes()
    console.log('next update time ',minutes)
    nextUpdatorTimer = setTimeout(() => {
        store.dispatch('refreshAllData')
        refreshOnFixedTime()
    }, minutes * 60 * 1000)
}

export function onNowTimeChange(){
    refreshOnFixedTime()
}