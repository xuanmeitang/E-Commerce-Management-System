// 导入数据
import userData from '../assets/data/user.json'

// 获取首页数据
export function getHomeData() {
  // 直接返回本地数据而不是通过请求获取
  console.log('加载首页数据:', userData)
  return new Promise((resolve) => {
    // 模拟异步加载，确保数据能够正确返回
    setTimeout(() => {
      resolve(userData)
    }, 100)
  })
}
