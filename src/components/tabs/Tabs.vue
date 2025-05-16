<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const { tabs } = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
});



const emit = defineEmits(['update:modelValue']);
</script>
<template>
    <v-tabs fixed-tabs >
              <v-tab
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :ripple="false"
                variant="text"
                color="blue"
                base-color="label"
              >
                {{ tab.title }}
                <span v-if="tab.count"> ({{ tab.count }}) </span>
              </v-tab>
            </v-tabs>
</template>
