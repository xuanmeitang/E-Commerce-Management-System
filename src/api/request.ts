import axios from 'axios'
//创建axios实例
const instance = axios.create({
})
instance.interceptors.request.use((config) => {
    console.log(config)
    return config
})
instance.interceptors.response.use((response) => {
    return response.data
})

export default instance