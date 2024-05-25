<script setup>
import { useUserListStore } from '@/views/apps/user/useUserStore'
import UserBioPanel from '@/views/apps/user/view/UserBioPanel.vue'
import UserTabOverview from '@/views/apps/user/view/UserTabOverview.vue'
import UserTabSecurity from '@/views/apps/user/view/UserTabSecurity.vue'

const userListStore = useUserListStore()
const route = useRoute()
const userData = ref()
const userTab = ref(null)

const tabs = [
  {
    icon: 'bx-user',
    title: 'Geral',
  },
  {
    icon: 'bx-lock-alt',
    title: 'Segurança',
  },
]

userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
})
</script>

<template>
  <VRow v-if="userData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel :user-data="userData.data" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            start
            :size="20"
            :icon="tab.icon"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabOverview />
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  action: read
  subject: User
</route>