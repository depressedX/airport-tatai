import Router from 'vue-router'

import Prediction from './views/Prediction'
import Statistics from './views/Statistics'
import PermissionDenied from './views/PermissionDenied'

export default new Router({
    routes:[
        {
            name:'prediction',
            path:'/prediction',
            component:Prediction
        },
        {
            name:'statistics',
            path:'/statistics',
            component:Statistics
        },
        {
            name:'permissionDenied',
            path:'/permissionDenied',
            component:PermissionDenied
        },
        {
            path:'/',
            redirect:'/prediction'
        }
    ]
})