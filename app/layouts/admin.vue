<template>
  <div class="admin-layout flex min-h-screen bg-gray-100">
    <aside class="admin-sidebar w-56 flex-shrink-0 bg-slate-800 text-white">
      <div class="p-4 border-b border-slate-700">
        <NuxtLink to="/" class="text-lg font-semibold text-white hover:text-amber-400">Outstock</NuxtLink>
        <span class="block text-xs text-slate-400 mt-1">관리자</span>
      </div>
      <nav class="p-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="admin-nav-item flex items-center gap-2 px-3 py-2 rounded-md text-sm transition"
          :class="{ 'bg-slate-700 text-amber-400': item.path === '/adminEc' ? route.path === '/adminEc' : route.path.startsWith(item.path) }"
        >
          <span class="opacity-80">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>
    <main class="admin-main flex-1 overflow-auto min-h-0">
      <div class="admin-main-inner pt-10 px-10 pb-8 min-h-full">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const menuItems = [
  { path: "/adminEc", label: "홈", icon: "🏠" },
  { path: "/adminCo/sites", label: "사이트관리", icon: "🌐" },
  { path: "/adminSy/users", label: "사용자관리", icon: "👤" },
  { path: "/adminSy/notices", label: "공지사항관리", icon: "📢" },
  { path: "/adminSy/menus", label: "메뉴관리", icon: "📑" },
  { path: "/adminEc/members", label: "회원관리", icon: "👥" },
  { path: "/adminSy/codes", label: "코드관리", icon: "📋" },
  { path: "/adminEc/products", label: "상품관리", icon: "📦" },
  { path: "/adminEc/orders", label: "주문관리", icon: "🛒" },
];
</script>

<style scoped>
.admin-nav-item {
  color: rgba(255, 255, 255, 0.85);
}
.admin-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
</style>
