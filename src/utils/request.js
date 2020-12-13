import axios from "axios"

axios.defaults.headers.post["Content-Type"] = "application/json"
// axios.defaults.headers.common["token"] = localStorage.getItem("token")
// axios.defaults.baseURL = "http://119.29.41.207:5792/cors/"
axios.interceptors.request.use(
  (config) => {
    // * 判断是否存在token，如果存在的话，则每个http header都加上token
    // * token会在登录之后存储在本地
    if (localStorage.token) {
      config.headers["Authorization"] = `Bearer ${localStorage.token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

export { axios }
