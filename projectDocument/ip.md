### 该文件为ip.js
####使用：在utils文件夹中新建文件为ip.js并将以下代码拷至其中
```
import Config from '../../config/api';

function remoteLinkAddress() {
  const IPaddress = `http://47.92.112.6:8022${Config.BASE_URL}`;
  return IPaddress;
}

export default remoteLinkAddress;

```
