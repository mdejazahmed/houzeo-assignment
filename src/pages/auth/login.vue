<template>
        <v-card class="elevation-12">
          <v-card-title class="text-center">
            <h2>Login</h2>
          </v-card-title>
          <v-card-subtitle class="text-center">
            <p>Enter your email address to login</p>
          </v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="login">
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
            <v-btn color="primary" block type="submit" :disabled="!email">
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
const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const email = ref('')

const login = async () => {
  if(!email.value){
    return
  }
    
try {
  const {data} = await request.post(LOGIN, {
      email: email.value,
      company:'1e179299-844d-435a-abc3-60edab2ece64'
    })
    authStore.setToken({accessToken: data.detail.access_token, refreshToken: data.detail.refresh_token})
    userStore.setUser(data.detail.user_data)
    router.push({name: ROUTES.HOME.name})
} catch (error) {
  console.log(error)
}
    // Make API call only if form is valid
   


}

</script>