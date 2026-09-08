<template>
  <div class="user-menu-wrap" ref="wrapRef">
    <!-- 로그인 상태: 이름 버튼 + 드롭다운 -->
    <template v-if="authStore.isStLoggedIn">
      <button class="user-name-btn" @click.stop="open = !open">
        <i class="fas fa-user"></i>
        <span>{{ authStore.user?.username }}</span>
        <i :class="`fas fa-chevron-${open ? 'up' : 'down'} caret`"></i>
      </button>

      <div v-show="open" class="user-panel">
        <div class="user-panel-head">
          <p class="user-panel-name">{{ authStore.user?.username }}</p>
          <p class="user-panel-email">{{ authStore.user?.email }}</p>
        </div>
        <ul class="user-panel-list">
          <li>
            <nuxt-link href="/account" @click="open = false"> <i class="fa fa-user"></i> 마이페이지 </nuxt-link>
          </li>
          <li>
            <a href="#" @click.prevent="handleLogout"> <i class="fa fa-sign-out"></i> 로그아웃 </a>
          </li>
        </ul>
      </div>
    </template>

    <!-- 비로그인 상태: 로그인 링크 -->
    <nuxt-link v-else href="/login" class="login-link"> <i class="fas fa-user"></i> 로그인 </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/store/useAuthStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const open = ref(false);
const wrapRef = ref<HTMLElement | null>(null);

function handleLogout() {
  authStore.setStLogout();
  open.value = false;
  router.push("/");
}

function handleOutside(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleOutside));
onUnmounted(() => document.removeEventListener("click", handleOutside));
</script>

<style scoped>
.user-menu-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.user-name-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.88rem;
  color: inherit;
  font-weight: 500;
  padding: 0;
  white-space: nowrap;
}

.user-name-btn .caret {
  font-size: 0.65rem;
}

.login-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.88rem;
  white-space: nowrap;
  color: inherit;
  text-decoration: none;
}

.user-panel {
  position: absolute;
  top: calc(100% + 14px);
  right: 0;
  background: #fff;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
  padding: 22px 24px;
  min-width: 200px;
  z-index: 9999;
  border-top: 2px solid var(--theme-color, #0989ff);
}

.user-panel-head {
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.user-panel-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1a1a1a;
  margin: 0;
}

.user-panel-email {
  font-size: 0.78rem;
  color: #999;
  margin: 3px 0 0;
}

.user-panel-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-panel-list li {
  margin: 8px 0;
}

.user-panel-list li a {
  font-size: 0.85rem;
  color: #444;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.user-panel-list li a:hover {
  color: var(--theme-color, #0989ff);
}
</style>
