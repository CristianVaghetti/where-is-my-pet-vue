<script setup>
import {
  avatarText,
} from '@core/utils/formatters'

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})
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
              {{ avatarText(props.userData.name) }}
            </span>
          </VAvatar>

          <!-- 👉 User name -->
          <h6 class="text-h6 mt-4">
            {{ props.userData.name }}
          </h6>

          <!-- 👉 Role chip -->
          <VChip
            label
            variant="flat"
            color="primary"
            class="mt-4"
          >
            {{ props.userData.profile.name }}
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
                  {{ props.userData.username }}
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
                  variant="flat"
                  :color="props.userData.status ? 'success' : 'error'"
                >
                  {{ props.userData.status ? 'ATIVO' : 'INATIVO' }}
                </VChip>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="font-weight-medium me-1">Perfil: </span>
                <span class="text-capitalize text-body-1 text-medium-emphasis">{{ props.userData.profile.description }}</span>
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
