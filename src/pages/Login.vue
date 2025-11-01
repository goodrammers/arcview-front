<template>
    <div id="root">
        <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <div class="text-center">
                    <h1
                        class="text-3xl font-bold text-gray-900"
                        style="font-family: Pacifico, serif"
                    >
                        Welding
                    </h1>
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">로그인</h2>
            </div>
            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form class="space-y-6" @submit="login">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">아이디</label>
                            <div class="mt-1">
                                <input
                                    required
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    type="text"
                                    v-model="id"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">비밀번호</label>
                            <div class="mt-1">
                                <input
                                    required
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    type="password"
                                    v-model="pw"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap cursor-pointer"
                            >
                                로그인
                            </button>
                        </div>
                    </form>

                    <div class="mt-6">
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-gray-300"></div>
                            </div>
                            <div class="relative flex justify-center text-sm">
                                <span class="px-2 bg-white text-gray-500">또는</span>
                            </div>
                        </div>
                        <div class="mt-6">
                            <button
                                type="button"
                                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                            >
                                회원가입
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const id = ref('')
const pw = ref('')
async function login(e: Event) {
    e.preventDefault()
    if (id.value && pw.value) {
        router.push('/home/dashboard')
    }
}
</script>

<style scoped lang="scss"></style>
