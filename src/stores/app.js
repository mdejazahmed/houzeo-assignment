// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})
export const useSnackbarStore = defineStore("snackbarStore", {
  state: () => ({
    show: false,
    color:"success",
    msg:"Operation Successful"
  }),
  actions:{
    showSnackbar({color="success",msg="Operation Successful"}){
     this.show=true
     this.color=color;
     this.msg=msg;
    },
  }
});