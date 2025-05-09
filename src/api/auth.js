
import axios from './index'

export const getUserProfile = async () => {
  const response = await axios.get('/user/profile')
  return response.data
}
