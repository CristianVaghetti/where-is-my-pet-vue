<script setup>
import {
  avatarText,
  kFormatter,
} from '@core/utils/formatters'

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

const isUpgradePlanDialogVisible = ref(false)

const resolveUserStatusVariant = stat => {
  if (stat === '1')
    return 'success'
  if (stat === '0')
    return 'secondary'
  
  return 'primary'
}

const resolveRoleName = role => {
  if (role === "M")
    return 'ADMIN'

  return 'Zé ninguém'
}

const resolveUserRoleVariant = role => {
  if (role === 'subscriber')
    return {
      color: 'primary',
      icon: 'bx-user',
    }
  if (role === 'author')
    return {
      color: 'warning',
      icon: 'bx-cog',
    }
  if (role === 'maintainer')
    return {
      color: 'success',
      icon: 'bx-data',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'bx-pencil',
    }
  if (role === 'M')
    return {
      color: 'error',
      icon: 'bx-server',
    }
  
  return {
    color: 'primary',
    icon: 'bx-user',
  }
}
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            color="primary"
            variant="tonal"
          >
            <VImg
              v-if="props.userData.avatar"
              :src="props.userData.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-semibold"
            >
              {{ avatarText(props.userData.nome) }}
            </span>
          </VAvatar>

          <!-- 👉 User nome -->
          <h6 class="text-h6 mt-4">
            {{ props.userData.nome }}
          </h6>

          <!-- 👉 Role chip -->
          <VChip
            label
            :color="resolveUserRoleVariant(props.userData.tipo_usuario).color"
            density="compact"
            class="mt-4"
          >
            {{ resolveRoleName(props.userData.tipo_usuario) }}
          </VChip>
        </VCardText>

        <!-- 👉 Details -->
        <VCardText>
          <h6 class="text-h6">
            Detalhes
          </h6>

          <VDivider class="my-4" />
          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <span class="font-weight-medium me-1">Usuário:</span>
                <span class="text-body-1 text-medium-emphasis">
                  {{ props.userData.name }}
                </span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="font-weight-medium me-1">
                  Email:
                </span>
                <span class="text-body-1 text-medium-emphasis">{{ props.userData.email }}</span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="font-weight-medium me-1">
                  Situação:
                </span>
                <VChip
                  label
                  density="compact"
                  :color="resolveUserStatusVariant(props.userData.status)"
                >
                  {{ props.userData.status ? 'ATIVO' : 'INATIVO' }}
                </VChip>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="font-weight-medium me-1">Perfil: </span>
                <span class="text-capitalize text-body-1 text-medium-emphasis">{{ resolveRoleName(props.userData.tipo_usuario) }}</span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="font-weight-medium me-1">
                  Celular:
                </span>
                <span class="text-body-1 text-medium-emphasis">{{ props.userData.phone }}</span>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.8rem;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
