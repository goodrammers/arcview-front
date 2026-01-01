<template>
    <div class="login-root">
        <div class="login-container">
            <div class="header-section">
                <h1 class="logo-text">ArcSync</h1>
                <h2 class="title-text">로그인</h2>
            </div>

            <div class="form-wrapper">
                <div class="login-box">
                    <form class="login-form" @submit.prevent="login">
                        <div class="form-group">
                            <label>아이디</label>
                            <input
                                required
                                type="text"
                                v-model="id"
                                placeholder="아이디를 입력하세요"
                            />
                        </div>

                        <div class="form-group">
                            <label>비밀번호</label>
                            <input
                                required
                                type="password"
                                v-model="pw"
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="submit-btn">로그인</button>
                        </div>
                    </form>

                    <div class="divider-section">
                        <div class="line"></div>
                        <span class="text">또는</span>
                    </div>

                    <div class="secondary-actions">
                        <button type="button" class="signup-btn">회원가입</button>
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

async function login() {
    if (id.value === 'salray' && pw.value === 'qwer1234%') {
        router.push('/dashboard')
    } else {
        alert('아이디 또는 비밀번호를 확인해주세요.')
    }
}
</script>

<style scoped lang="scss">
.login-root {
    min-height: 100vh;
    background-color: #f9fafb;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 24px;
}

.login-container {
    width: 100%;
    max-width: 448px;
    margin: 0 auto;
}

.header-section {
    text-align: center;
    margin-bottom: 24px;
}

.logo-text {
    font-family: 'Pacifico', cursive;
    font-size: 36px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
}

.title-text {
    font-size: 24px;
    font-weight: 800;
    color: #111827;
    margin-top: 24px;
}

.form-wrapper {
    width: 100%;
}

.login-box {
    background-color: #ffffff;
    padding: 32px 40px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
    }

    input {
        appearance: none;
        display: block;
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        outline: none;
        transition:
            border-color 0.2s,
            box-shadow 0.2s;

        &::placeholder {
            color: #9ca3af;
        }

        &:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); // Blue ring
        }
    }
}

.submit-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 16px;
    border: 1px solid transparent;
    border-radius: 6px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    background-color: #2563eb; // Blue-600
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #1d4ed8; // Blue-700
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        background-color: #1d4ed8;
    }
}

.divider-section {
    margin-top: 24px;
    position: relative;
    display: flex;
    justify-content: center;

    .line {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        border-top: 1px solid #d1d5db;
        z-index: 0;
    }

    .text {
        position: relative;
        z-index: 1;
        background-color: #ffffff;
        padding: 0 8px;
        color: #6b7280;
        font-size: 14px;
    }
}

.secondary-actions {
    margin-top: 24px;
}

.signup-btn {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    padding: 10px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    background-color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f9fafb;
    }
}
</style>
