const obj = {
  connectForm: {
    host: "",
    port: "",
    password: "",
  },
  getUrl() {
    let url = `http://${this.connectForm.host}:${this.connectForm.port}/cors`
    return url
  },
}
console.log(obj.getUrl())
