# Api
## AMapInfo
| 参数 | 说明 | 类型     | 默认值 |
| --- | --- | -----| ---| 
| positions  | 当有多个点位信息需要展示时，使用positions代表所有点位的一个数组,包含每一个点位的信息，其中一定要包含position字段，表示点的坐标 | object[] |
| marker | 当只有一个点位信息时，使用marker | object |
|formFields | 点击marker时，所要展示的表单字段信息 | object[] |
| clickMap | 点击地图时触发该函数，可以获得点击位置的经纬度坐标和点击位置的地址| Function(lnglatObj,address)|
| formVisible | 单击地图时是否显示相关表单信息 | Boolean | false
|getFormValue|获取表单的信息| Function(value) |
|closeModal|关闭弹窗时触发的回调| Function(value) |

# 示例
positions:由n个这样的对象组成的数组
```js
{
    "siteId": 1,
    "name": "普明街道办事处",
    "thumbnail": "http://47.92.112.6:9000/myciv/eeaed81ff3e547659ca8d6234db08097.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=smlminio%2F20230406%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230406T082517Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=fe099cffd60cc742dd585e2a1f651656bc9cefcead6f938b2872a2ad35225bea",
    "sitePy": "pmjdbsc",
    "longitude": "104.676423",
    "latitude": "31.468135",
    "address": "四川省绵阳市涪城区普明街道绵阳高新亚朵X酒店领航中心",
    "leaderId": 196,
    "introduce": "科技城直管区",
    "departmentId": 5,
    "delFlag": false,
    "leaderName": "后端测试用户昵称",
    "phoneNumber": "15983643196",
    "parentDeptName": "科技城直管区\n（高新区）",
    "position": {
        "latitude": 31.468135,
        "longitude": 104.676423
    }
}
```
