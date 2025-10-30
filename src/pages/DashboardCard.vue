<template>
    <div
        class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
    >
        <div class="relative h-48 bg-gray-100">
            <img
                alt="251020-105040"
                class="w-full h-full object-cover object-top"
                src="https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28getImageQuery%28item.id%2C%20item.category%29%29%7D&amp;width=400&amp;height=300&amp;seq=welding-1-1761825719719&amp;orientation=landscape"
            />
            <div class="absolute top-3 right-3 flex space-x-1">
                <button
                    class="p-2 bg-white/90 text-gray-400 hover:text-blue-600 rounded-full shadow-sm transition-colors cursor-pointer"
                >
                    <i class="ri-edit-line text-sm"></i>
                </button>
                <button
                    class="p-2 bg-white/90 text-gray-400 hover:text-red-600 rounded-full shadow-sm transition-colors cursor-pointer"
                >
                    <i class="ri-delete-bin-line text-sm"></i>
                </button>
            </div>
        </div>
        <div class="p-4">
            <div class="cursor-pointer">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">251020-105040</h3>
                <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex items-center">
                        <i
                            class="ri-building-line w-4 h-4 flex items-center justify-center mr-2 text-gray-400"
                        ></i>
                        <span>1호 작업실</span>
                    </div>
                    <div class="flex items-center">
                        <i
                            class="ri-tools-line w-4 h-4 flex items-center justify-center mr-2 text-gray-400"
                        ></i>
                        <span>WM-2000 Pro</span>
                    </div>
                    <div class="flex items-center">
                        <i
                            class="ri-time-line w-4 h-4 flex items-center justify-center mr-2 text-gray-400"
                        ></i>
                        <span>1시간 39분</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
