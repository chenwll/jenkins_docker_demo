MultiFunctionalList说明文档
=======
1，cardOption
-------
该参数控制列表每一行卡片的显示内容
包含sign{}，detail[]两个字段，你的参数应该像这样
```
{
      sign: {
        field: 'status',
        src: [
          {
            key: '1',
            value: '可用',
            color: SIGN_COLOR['3'],
          }, {
            key: '0',
            value: '不可用',
            color: SIGN_COLOR['4'],
          },
        ],
      },
      detail: [
        { field: 'departmentId', src: this.convertData(departmentData, 'id', 'departmentName'), editable: true },
        { field: 'nickname', title: '昵称' }
      ],
}
```
sign只是一个特殊的detail字段，用于展示可以代表状态的重要字段（object）

field:字段（string）

title:显示的label名称（string）

src:下拉的数据字典，需要转换成标准的{key：value}（array）

2，dataSource
-------------
（array）：该参数为从后台list接口获取的data数组，包含全部信息

3，loadingList
-----------
（loading）：列表的loading值

4，loadingUpdate
----------
（loading）：编辑保存的loading值

5，updateFunction
--------
编辑时调用的函数（function）：该函数会自动返回回调参数,data为当前编辑项的信息
```
function（data）{

   }
```
6，pagination={pageProps}
----------
分页信息（object），你的参数应该像这样
```
pageProps = {
      turnPage: this.listPage,
      total : 0,
      currentPage : 1,
      pageSize : 10,
    };
```
turnPage（function）: 翻页调用的函数，该函数会自动返回回调参数,params为分页时的分页信息
```
function (params){
  };
```
7，btnOptions={btnList}
--------
参考toolbar配置信息

8，ck
--------
（boolean）：传入该参数开启左侧checkbox选项

9，selectedRows={checks}
-----------
（array）：传入选中项的信息

10,onSelectChange={this.onSelectChange}
-------
（function）：配合ck使用，选中某一行或全选的回调，data为数组，所有选中项的信息
```
 onSelectChange = (data) => {
    this.setState({
      checks: data,
    });
  };
```
11，drawerTitle:
--------
抽屉标题（string），不传入该参数，不打开抽屉

12，drawerContent: <UserDetail />,
------------
抽屉展示内容（ReactElement），你应该尽量嵌入你自己写的页面，（不传入参数，会自动帮你生成不完美的drawer）

13，drawerVisible
------------
抽屉的显示属性（boolean）

14，onChangeDrawerVisible
-------
（function）：传入一个控制抽屉开关的函数，该函数包含回调
```
  onChangeDrawerVisible = (value, data) => {
    this.setState({
      drawerVisible: value,
    });
  };
```            
value(boolean):该回调返回你执行最新操作时的抽屉开关值

data(object):返回的是当前全部信息


