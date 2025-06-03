<template>
    <v-dialog persistent scrollable v-model="show" width="500px">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-space-between px-4 pt-3">
          <span class="title font-weight-bold">
            {{ title }}
          </span>
          <v-btn icon="mdi-close" density="compact" variant="text" @click="modalClosed"></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-form ref="form">
            <div class="pa-2">{{ subTitle }}</div>
            <v-text-field v-model="reason" v-if="askForReason" density="compact" variant="outlined" label="Reason"
              :rules="[$rules.required]">
            </v-text-field>
          </v-form>
  
        </v-card-text>
        <v-card-actions class="d-flex justify-end mx-3 mb-3">
          <v-btn variant="outlined" @click="cancel"  class="text-primary text-capitalize px-5">
            {{  cancelText|| "No" }}
          </v-btn>
          <v-btn variant="flat" min-width="90" @click="confirm" :prepend-icon="icon" :color="color" class="text-capitalize px-5">
            {{  confirmText || "Yes" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  <script>
  export default {
    data() {
      return {
        show: false,
        title: "",
        subTitle: "",
        confirmText: "",
        cancelText: "",
        reason: "",
        askForReason: false,
        color: '',
        icon: '',
        confirmText: '',
        cancelText: ''
      };
    },
    methods: {
      modalClosed() {
        this.show = false;
        this.title = "";
        this.subTitle = "";
        this.confirmText = "";
        this.cancelText = "";
      },
      askConfirmation({ title, subTitle, confirmText, cancelText, askForReason = false,color='primary' }) {
        this.show = true;
        this.title = title;
        this.subTitle = subTitle;
        this.confirmText = confirmText;
        this.cancelText = cancelText;
        this.askForReason = askForReason;
        this.color=color
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      },
      cancel() {
        this.modalClosed();
        this.reason = "";
        this.resolve({ isConfirm: false, confirmText: this.reason });
      },
      async confirm() {
        const { valid } = await this.$refs.form.validate();
        if (valid) {
          this.modalClosed();
          this.resolve({ isConfirm: true, confirmText: this.reason });
        }
      },
    },
  };
  </script>
  <style scoped>
  .text-description {
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;
    text-align: center;
  
    color: #000000;
  }
  
  .text-btn {
    border: 1px solid primary;
    box-sizing: border-box;
    border-radius: 8px;
  }
  
  .text-btn>>>span {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  
    color: primary;
  }
  
  .btn {
    box-sizing: border-box;
    border-radius: 8px;
  }
  
  .btn>>>span {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  
    color: #ffffff;
  }
  </style>
  
  