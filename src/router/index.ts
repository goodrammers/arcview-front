import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import WeldingView from '@/pages/WeldingView.vue'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import MainLayout from '@/pages/MainLayout.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: MainLayout,
        redirect: '/dashboard',
        children: [
            { path: '/dashboard', component: Dashboard },
            { path: '/welding-view', component: WeldingView },
        ],
    },

    { path: '/login', component: Login },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    next()
})

export default router
