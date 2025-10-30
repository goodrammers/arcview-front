<template>
    <div class="flex-1 overflow-auto">
        <div class="p-6">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">관리자 메뉴</h1>
                <p class="text-gray-600">사용자 승인 및 시스템 설정을 관리하세요</p>
            </div>
            <div class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg font-semibold text-gray-900">회원가입 신청 목록</h2>
                    <div class="text-sm text-gray-500">대기 중: 3명</div>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table class="w-full">
                        <thead class="bg-slate-50 border-b border-gray-200">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    이름
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    ID
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    이메일
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    신청일
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    작업
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr class="hover:bg-gray-50/50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">김철수</td>
                                <td class="px-6 py-4 text-sm text-gray-500">kimcs</td>
                                <td class="px-6 py-4 text-sm text-gray-500">kim@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-01-15
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button
                                            class="p-2 text-gray-400 hover:text-green-600 transition-colors cursor-pointer"
                                            title="승인"
                                        >
                                            <i class="ri-check-line"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            title="삭제"
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50/50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">이영희</td>
                                <td class="px-6 py-4 text-sm text-gray-500">leeyh</td>
                                <td class="px-6 py-4 text-sm text-gray-500">lee@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-01-14
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button
                                            class="p-2 text-gray-400 hover:text-green-600 transition-colors cursor-pointer"
                                            title="승인"
                                        >
                                            <i class="ri-check-line"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            title="삭제"
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50/50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">최지은</td>
                                <td class="px-6 py-4 text-sm text-gray-500">choije</td>
                                <td class="px-6 py-4 text-sm text-gray-500">choi@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-01-12
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button
                                            class="p-2 text-gray-400 hover:text-green-600 transition-colors cursor-pointer"
                                            title="승인"
                                        >
                                            <i class="ri-check-line"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            title="삭제"
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg font-semibold text-gray-900">회원 관리</h2>
                    <div class="text-sm text-gray-500">총 회원: 4명</div>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table class="w-full">
                        <thead class="bg-slate-50 border-b border-gray-200">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    이름
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    ID
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    이메일
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    가입일
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    권한
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                                >
                                    작업
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr class="hover:bg-gray-50/50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">박민수</td>
                                <td class="px-6 py-4 text-sm text-gray-500">parkms</td>
                                <td class="px-6 py-4 text-sm text-gray-500">park@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-01-13
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900 font-medium">관리자</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button
                                            class="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                            title="수정"
                                        >
                                            <i class="ri-edit-line"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            title="회원 삭제"
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50/50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">정수진</td>
                                <td class="px-6 py-4 text-sm text-gray-500">jungsj</td>
                                <td class="px-6 py-4 text-sm text-gray-500">jung@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-01-10
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900 font-medium">운영자</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button
                                            class="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                            title="수정"
                                        >
                                            <i class="ri-edit-line"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            title="회원 삭제"
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50/50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">홍길동</td>
                                <td class="px-6 py-4 text-sm text-gray-500">honggd</td>
                                <td class="px-6 py-4 text-sm text-gray-500">hong@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-01-08
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900 font-medium">작업자</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button
                                            class="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                            title="수정"
                                        >
                                            <i class="ri-edit-line"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            title="회원 삭제"
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50/50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">김영수</td>
                                <td class="px-6 py-4 text-sm text-gray-500">kimys</td>
                                <td class="px-6 py-4 text-sm text-gray-500">kimys@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-01-05
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900 font-medium">작업자</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button
                                            class="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                            title="수정"
                                        >
                                            <i class="ri-edit-line"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            title="회원 삭제"
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-6">포트 설정</h2>
                <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div class="flex items-end space-x-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                포트 번호
                            </label>
                            <input
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="포트 번호를 입력하세요"
                                type="number"
                                value="8080"
                            />
                        </div>
                        <button
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                        >
                            적용
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                        용접기와 통신에 사용되는 포트를 설정합니다.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
