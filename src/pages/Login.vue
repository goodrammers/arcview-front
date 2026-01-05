<template>
    <div class="login-root">
        <div class="login-content">
            <h1 class="logo-text">ArcSync</h1>

            <div class="login-box">
                <div class="login-form">
                    <div class="form-group">
                        <label>ID</label>
                        <input required type="text" v-model="id" @keyup.enter="login" />
                    </div>

                    <div class="form-group">
                        <label>Password</label>
                        <input required type="password" v-model="pw" @keyup.enter="login" />
                    </div>

                    <div class="forgot-password">
                        <a href="#">Forgot password?</a>
                    </div>
                    <div style="display: flex; justify-content: flex-end">
                        <button
                            @click="login"
                            style="
                                cursor: pointer;
                                background-color: #3b4faa;
                                width: 84px;
                                height: 28px;
                                border-radius: 3px;
                                color: white;
                                font-weight: 500;
                                font-size: 16px;
                            "
                        >
                            Login
                        </button>
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
        alert('Please check your ID or password.')
    }
}
</script>

<style scoped lang="scss">
.login-root {
    min-height: 100vh;
    background-color: #130f1d; /* Dark background matching image */
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Times New Roman', Times, serif; /* Matching serif style */
}

.login-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 700px;
}

.logo-text {
    margin-top: -120px;
    font-size: 32px;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 32px;
    letter-spacing: 0.5px;
}

.login-box {
    width: 100%;
    background-color: #27283d; /* Card background */
    padding: 48px 40px 20px 40px;
    border-radius: 4px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    label {
        font-size: 18px;
        font-weight: 600;
        color: #b0b0b0; /* Light gray label */
        width: 80px; /* Fixed width for alignment */
        flex-shrink: 0;
    }

    input {
        flex: 1;
        height: 36px;
        background-color: #d1d1d1; /* Light input background */
        border: none;
        border-radius: 2px;
        padding: 0 10px;
        font-size: 14px;
        color: #000;
        outline: none;

        &:focus {
            background-color: #ffffff;
        }
    }
}

.forgot-password {
    display: flex;
    justify-content: flex-end;
    margin-top: -10px; /* Pull closer to password field */

    a {
        font-size: 11px;
        color: #5671a5; /* Muted blue link color */
        text-decoration: none;

        &:hover {
            color: #7a93c9;
            text-decoration: underline;
        }
    }
}

.form-actions {
    margin-top: 20px;
}

.submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #3b3c58;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #4c4d6f;
    }
}
</style>
