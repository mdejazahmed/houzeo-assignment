<template>
        <v-card class="elevation-12" max-width="400">
          <v-card-title class="text-center">
            <h2>Login</h2>
          </v-card-title>
          <v-card-subtitle class="text-center">
            <p>Enter your email address to login</p>
          </v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="login" ref="loginForm"> 
              <v-text-field
                density="compact"
                v-model="email"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                :rules="[emailRule]"
                variant="outlined"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="text-center">
            <v-btn color="primary" variant="flat" block type="submit" @click="login" :disabled="!email" :loading="loading">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      
</template>

<script setup>
import { ref } from 'vue'
import { emailRule } from '@/utils/formRules'
import { LOGIN } from '@/constants/apis'  
import  request  from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/constants/routeKeys'
import { useUserStore } from '@/stores/user'
import { useSnackbarStore } from '@/stores/app'
const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const snackbarStore = useSnackbarStore()
const email = ref('')
const loading = ref(false)

const loginForm = ref(null)

const login = async () => {
  const {valid} = await loginForm.value.validate()
  if(!valid) return
    
try {
  loading.value = true
  const {data} = await request.post(LOGIN, {
      email: email.value,
      company:'1e179299-844d-435a-abc3-60edab2ece64'
    })
    authStore.setToken({accessToken: data.detail.access_token, refreshToken: data.detail.refresh_token})
    userStore.setUser(data.detail.user_data)
    snackbarStore.showSnackbar({msg:"Login Successful"})
    router.push({name: ROUTES.HOME.name})
} catch (error) {
  snackbarStore.showSnackbar({msg:"Login Failed",color:"error"})
} finally {
  loading.value = false
}
    // Make API call only if form is valid
   


}

</script>