<template>
  <div class="d-flex flex-column gap-2">
    <!-- Header -->
    <v-card
      class="rounded-lg bg-surface-light"
      variant="flat"
      border="#E4E4E4 sm"
    >
      <v-card-title class="d-flex align-center justify-space-between">
        <div
          v-for="(header, index) in headers"
          :key="header.key || index"
          :style="`width: ${header.width || '20%'}`"
          :class="header.align ? `text-${header.align}` : 'text-left'"
          class="text-subtitle-2 font-weight-bold text-medium-emphasis"
        >
          {{ header.title }}
        </div>
      </v-card-title>
    </v-card>
    <!-- Rows -->
    <v-card
      v-for="(item, index) in items"
      :key="index"
      class="rounded-lg"
      variant="flat"
      border="#E4E4E4 sm"
    >
      <div class="d-flex align-center pa-2">
        <template
          v-for="(header, headerIndex) in headers"
          :key="header.key || headerIndex"
        >
          <div
            :style="`width: ${header.width || '20%'}`"
            :class="[
              'text-subtitle-2',
              header.align ? `text-${header.align}` : 'text-left',
            ]"
          >
            <template v-if="$slots[header.key]">
              <slot :name="header.key" :item="item" :index="index"></slot>
            </template>
            <template v-else>
              {{ item[header.key] }}
            </template>
          </div>
        </template>
      </div>
    </v-card>
  </div>
</template>
<script setup>
const { headers, items } = defineProps({
  headers: {
    type: Array,
    required: true,
    default: () => [],
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>
