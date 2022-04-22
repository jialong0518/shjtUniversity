<template>
  <div class="account">
    <el-button type="primary" style="margin-left: 15px;" @click="fileClick"><slot></slot></el-button>
    <input type="file" style="display: none;" ref="inputFile" @change="getFile($event)" multiple="multiplt" >
  </div>
</template>

<script>

export default {
  name: 'plupload',
  data() {
    return {
        
    }
  },
  watch: {
    
  },
  methods: {
    fileClick(){
      this.$refs.inputFile.click();
    },
    getFile() {
       const file = event.target.files[0]
            const sliceBuffer = []
            let sliceSize = file.size
            while(sliceSize > 1024 * 1024) {
                const blobPart = file.slice(sliceBuffer.length * 1024 * 1024, (sliceBuffer.length + 1) * 1024 * 1024)
                sliceBuffer.push(
                    blobPart
                )
                sliceSize -= (1024 * 1024)
            }

            if(sliceSize > 0) {
                sliceBuffer.push(
                    file.slice(sliceBuffer.length * 1024 * 1024, file.size)
                )
            }
            
            const fileReader = new FileReader()
            fileReader.onload = (res)=>{
                const result = fileReader.result
                const fileHash = SparkMD5.hashBinary(result)

                this.checkFileChunkState(fileHash)
                .then(res => {
                    let { chunkList, state } = res
                    if(state === 1) {
                        alert("已经上传完成")
                        return 
                    }

                    chunkList = chunkList.map(e => parseInt(e))

                    const chunkRequests = []
                    sliceBuffer.forEach((buffer, i) => {
                        if(!chunkList.includes(i)) {
                            const blob = new File([buffer], `${i}`)
                            chunkRequests.push(
                                this.uploadFileChunk(fileHash, blob)
                            )
                        }
                    })
                    return Promise.all(chunkRequests)
                })
                .then(res => {
                    return new Promise(resolve => {
                        res.forEach(e => {
                            e.json().then(({chunkList}) => {
                                if(chunkList.length === sliceBuffer.length) {
                                    this.megerChunkFile(fileHash, file.name).then(res => {
                                        resolve(res)
                                    })
                                }
                            })
                        })
                    })
                }).then(res => {
                    res.fileHash = fileHash;
                    res.name = file.name;
                    console.log(res);
                    this.$emit('updata', res);
                })
            }
            fileReader.onerror = function(err) {
                console.log("报错了", err.target.error)
            }
            fileReader.readAsBinaryString(event.target.files[0])
    },
    uploadFileChunk(hash, file) {
            let formData = new FormData
            formData.append('file', file)
            formData.append('hash', hash)
            return fetch("https://expert.sjtu.edu.cn/expert/uploadChunk", {
                method: "POST",
                body: formData
            })
        },

    checkFileChunkState(hash) {
            return new Promise(resolve => {
                fetch("https://expert.sjtu.edu.cn/expert/checkChunk?hash=" + hash)
                .then(r => r.json())
                .then(response => {
                    resolve(response)
                })
            })
        },

    megerChunkFile(hash, fileName) {
            return new Promise(resolve => {
                fetch(`https://expert.sjtu.edu.cn/expert/megerChunk?hash=${hash}&fileName=${fileName}`)
                .then(r => r.json())
                .then(r => {
                    resolve(r)
                })
            })
        }
  },
  
//   message_
  mounted: function() {
   
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>

</style>