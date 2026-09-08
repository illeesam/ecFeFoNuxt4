<template>
  <ul>
    <li v-for="item in menus" :key="item.menuId" :class="`${item.hasDropdown && !item.megamenu ? 'active has-dropdown' : item.megamenu && 'mega-menu has-dropdown'}`">
      <nuxt-link :to="`${item.link}`">{{ item.title }}</nuxt-link>

      <ul v-if="item?.hasDropdown && !item.megamenu" class="submenu transition-3">
        <li v-for="(menu, index) in item.dropdownItems" :key="index">
          <nuxt-link :to="`${menu.link}`">{{ menu.title }}</nuxt-link>
        </li>
      </ul>

      <ul v-if="item.hasDropdown && item.megamenu" class="submenu transition-3" :style="{ backgroundImage: `url(${BG})` }">
        <li v-for="(m_mnu, index) in item.dropdownItems" :key="index" class="has-dropdown">
          <nuxt-link :to="`${m_mnu.link}`">{{ m_mnu.title }}</nuxt-link>
          <ul>
            <li v-for="(m, index) in m_mnu.dropdownMenu" :key="index">
              <nuxt-link :to="`${m.link}`">{{ m.title }}</nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { axiosSsr } from "~/utils/axiosSsr";
import { type SyMenuTreeType } from "~/types/syMenuTreeType";

const BG = "/cdn/img/bg/mega-menu-bg.jpg";

// 이미 있으면 재호출 안 함 (화면 오픈마다 /api/menus 호출 방지)
const menusCache = useState<SyMenuTreeType[] | null>("menus-cache", () => null);

const { data: menus } = useAsyncData<SyMenuTreeType[]>(
  "menus",
  async () => {
    const list = await axiosSsr.get<SyMenuTreeType[]>("/api/menus").then((r) => r.data);
    menusCache.value = list;
    return list;
  },
  {
    default: () => [] as SyMenuTreeType[],
    getCachedData: () => (menusCache.value && menusCache.value.length > 0 ? menusCache.value : undefined),
  }
);
</script>
