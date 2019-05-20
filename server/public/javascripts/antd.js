const uploadProp = {
  onRemove: (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      return {
        fileList: newFileList,
      }
    })
  },
  beforeUpload: (file) => {
    // 首先清除一下各种上传的状态
    this.setState({
      uploaded:false,   // 上传成功
      uploading:false,  // 上传中
      uploadRequest:false   // 上传预处理
    })
    // 兼容性的处理
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      chunkSize = 1024*1024*5,                             // 切片每次5M
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0, // 当前上传的chunk
      spark = new SparkMD5.ArrayBuffer(),
      // 对arrayBuffer数据进行md5加密，产生一个md5字符串
      chunkFileReader = new FileReader(),  // 用于计算出每个chunkMd5
      totalFileReader = new FileReader()  // 用于计算出总文件的fileMd5
      
    let params = {chunks: [], file: {}},   // 用于上传所有分片的md5信息
        arrayBufferData = []              // 用于存储每个chunk的arrayBuffer对象,用于分片上传使用
    params.file.fileName = file.name
    params.file.fileSize = file.size

    totalFileReader.readAsArrayBuffer(file)
    totalFileReader.onload = function(e){
        // 对整个totalFile生成md5
        spark.append(e.target.result)
        params.file.fileMd5 = spark.end() // 计算整个文件的fileMd5
      }

    chunkFileReader.onload = function (e) {
      // 对每一片分片进行md5加密
      spark.append(e.target.result)
      // 每一个分片需要包含的信息
      let obj = {
        chunk:currentChunk + 1,
        start:currentChunk * chunkSize, // 计算分片的起始位置
        end:((currentChunk * chunkSize + chunkSize) >= file.size) ? file.size : currentChunk * chunkSize + chunkSize, // 计算分片的结束位置
        chunkMd5:spark.end(),
        chunks
      }
      // 每一次分片onload,currentChunk都需要增加，以便来计算分片的次数
      currentChunk++;          
      params.chunks.push(obj)
      
      // 将每一块分片的arrayBuffer存储起来，用来partUpload
      let tmp = {
        chunk:obj.chunk,
        currentBuffer:e.target.result
      }
      arrayBufferData.push(tmp)
      
      if (currentChunk < chunks) {
        // 当前切片总数没有达到总数时
        loadNext()
        
        // 计算预处理进度
        _this.setState({
          preUploading:true,
          preUploadPercent:Number((currentChunk / chunks * 100).toFixed(2))
        })
      } else {
        //记录所有chunks的长度
        params.file.fileChunks = params.chunks.length  
        // 表示预处理结束，将上传的参数，arrayBuffer的数据存储起来
        _this.setState({
          preUploading:false,
          uploadParams:params,
          arrayBufferData,
          chunksSize:chunks,
          preUploadPercent:100              
        })
      }
    }

    fileReader.onerror = function () {
      console.warn('oops, something went wrong.');
    };
    
    function loadNext() {
      var start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext()

    // 只允许一份文件上传
    this.setState({
      fileList: [file],
      file: file
    })
    return false
  },
  fileList: this.state.fileList,
}
