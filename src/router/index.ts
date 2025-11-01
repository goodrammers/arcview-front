import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import WeldingView from '@/pages/WeldingView.vue'
import Dashboard from '@/pages/Dashboard.vue'
import MainLayout from '@/layout/MainLayout.vue'
import RealTime from '@/pages/RealTime.vue'
import Admin from '@/pages/Admin.vue'
import TaskManager from '@/pages/TaskManager.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: MainLayout,
        redirect: '/dashboard',
        children: [
            { path: '/dashboard', component: Dashboard },
            { path: '/welding-view', component: WeldingView },
            { path: '/real-time', component: RealTime },
            { path: '/task', component: TaskManager },
            { path: '/admin', component: Admin },
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    next()
})

export default router
