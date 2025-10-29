<template>
    <VApp>
        <VMain>
            <VNavigationDrawer width="200">
                <div class="cursor-pointer" @click="() => goTo('/')">Home</div>
                <div class="cursor-pointer" @click="() => goTo('/login')">Login</div>
            </VNavigationDrawer>
            <router-view></router-view>
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import router from '@/router'

function goTo(path: string) {
    router.push(path)
}
</script>

<style scoped lang="scss">
//a {
//    color: black;
//    text-decoration: none;
//    outline: none;
//}
//a:visited,
//a:active {
//    color: black;
//    text-decoration: none;
//}
</style>
