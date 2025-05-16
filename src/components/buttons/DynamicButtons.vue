<template>
    <div class="d-flex align-center justify-center flex-wrap gap-2">

      <!-- buttons -->
      <v-btn
        v-bind="$attrs"
        v-for="(actionBtn, index) in dynamicButtons?.filter(
          (e) => !e.show_in_menu
        )"
        :icon="actionBtn.icon ? actionBtn.icon : false"
        :rounded="actionBtn.icon ? 'xl' : actionBtn.rounded"
        :key="index"
        :variant="actionBtn.variant || 'flat'"
       
        :color="actionBtn.color || 'neutralGray'"
        @click="() => handleBtnClick(actionBtn)"
        class="actionBtn"
        :disabled="actionBtn?.is_disabled"
      >
        
  

        <v-icon v-if="actionBtn.icon">{{ actionBtn.icon }}</v-icon>
  
        <div v-if="actionBtn.text" class="ml-1">{{ actionBtn.text }}</div>
      </v-btn>
      <!-- menu buttons -->
      <v-menu v-if="dynamicButtons?.filter((e) => e.show_in_menu).length">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="flat"
            color="neutralGray"
            icon="mdi-dots-vertical"
            size="40"
            v-bind="props"
          ></v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            v-for="(actionBtn, index) in dynamicButtons?.filter(
              (e) => e.show_in_menu
            )"
            :key="index"
            value="0"
            @click="() => handleBtnClick(actionBtn)"
          >
            <div>
              <v-icon v-if="actionBtn.icon">{{ actionBtn.icon }}</v-icon>
              <div v-if="actionBtn.text" class="ml-1">
                {{ actionBtn.text }}
              </div>
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>
  
  <script setup>
  const { dynamicButtons } = defineProps({
    dynamicButtons: {
      type: Array,
      default: () => [],
    },
  });
    
    const emit = defineEmits(["click"]);
    
    const handleBtnClick = (btn) => {
      emit("click", btn);
    };
  </script>
  
  <style lang="scss" scoped>
  .actionBtn {
    position: relative;
  }
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    font-size: 10px;
    width: 15px;
    height: 15px;
  }
  </style>
  