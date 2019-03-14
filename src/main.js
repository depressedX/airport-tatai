import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import './main.css'
import VueRouter from 'vue-router'
import router from './router'
import store from './store/store'


Vue.config.productionTip = false

import {onNowTimeChange} from "./store/updator";


Vue.use(VueRouter)
Vue.use(ElementUI);
let vue = new Vue({
    store,
    render: h => h(App),
    router,
    computed:{
        now:()=>store.getters.now
    },
    watch:{
        now:{
            handler:function(){
                onNowTimeChange()
            },
            immediate:true
        }
    }
}).$mount('#app')

