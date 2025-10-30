import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import WeldingView from '@/pages/WeldingView.vue'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import MainLayout from '@/layout/MainLayout.vue'
import RealTime from '@/pages/RealTime.vue'
import Admin from '@/pages/Admin.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        component: MainLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'welding-view', component: WeldingView },
            { path: 'real-time', component: RealTime },
            { path: 'admin', component: Admin },
        ],
    },

    { path: '/', component: Login },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    next()
})

export default router
