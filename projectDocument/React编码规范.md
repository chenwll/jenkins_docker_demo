# 项目目录结构
## src/pages/document.ejs
新建 `src/pages/document.ejs`，umi 约定如果这个文件存在，会作为默认模板。我们在这个文件里面引入高德地图的sdk文件

```js
<script type="text/javascript">
  window._AMapSecurityConfig = {
  securityJsCode:'23f8574ddde7a5863bcf057870c279a8',
}
</script>
```


## layouts/BasicLayout.js

整个页面的框架部分，主要是做一下工作：

1. 构建整个页面，把所有的页面拼凑起来。
2. 用户权限判定，与其对应菜单的生成。
3. 对非法请求路径进行拦截，和重定向
4. 调用models/global.js，获取全局共用数据

## config

在这个文件夹中存放着两个文件，一个是`api.js`一个是`router.config.js`

1.router.config.js
在这个文件中，我们发现我们的菜单是写死的，但是在正式的项目，我们的菜单都是请    求后台来获取的，所以这里需要修改。

2. api.js
   这里登记了API接口信息

## src/pages/

业务页面入口和常用模板
**注意：一个业务对应一个文件**

在写每一个业务时，需要对这个这个业务的流程与整个构成有一个深入的了解，因为我们需要把一些功能相近的模块提取出来写一个共有的组件。
并且在写的时候，尽量把业务拆分成多个板块，然后创建不同文件，最后再在一个文件去，拼凑这些细化的功能组件。

举例：（简单的CRWD组件）

1.模块：顶部的搜索框、中部的操作按钮、底部表格、新增或者编辑所需要的Form表单

2.搜索框组件：SearchNews.js；操作组件：HandleList.js；表格组件：Table.js；表单组件：Form.js；

## src/component/

业务通用组件
**注意：**

**1. 公用组件中绝对不能涉及到数据，所有的数据来源均来自调用这个通用组件的组件**

**2. 判定每一个传入的数据的格式，设置默认值，防止传入空的或者格式不匹配的数据**

**3. 备注好每一个函数的作用**

在写通用组件时，我需要的是足够细化它的功能，并且尽可能的去考虑到多的情况。

## models/
dva model模块
在这个模块去编写需要跨多个组件的数据传递，并且请求后台数据。当我向后台发送请求时，在返回请求的的数据中，需要判定data中的code，如果code为0则为请求成功，如果不为0，我们需要抛出这个这个错误，告知用户。

**注意：**

**一个业务组件一个对应一个model对应一个后台服务**

## services/

后台接口服务
这个模块对应这后台接口服务。

```js
// 接口名称
export async function fakeGetcaptcha(params){
    // 共有API前缀     私有API接口
    return request(createTheURL(Config.API.LOGIN, 'getcaptcha'), {
        method: 'GET', // 请求方法
        body: params,  //向后台发送的数据
    });
}
```

**注意**

**1.私有接口必须为全小写**

**2.通常情况下一个业务对应一个services**


## request/
向后台发送请求
在这个里面一共有4个文件

1.request.js

选择调用的后台请求模式，axios或者fetch，固定参数`API.REQUEST_METHOD`可以在`./../../config/api`中进行配置

2.request.axios.js和request.fetch.js,这两种不同写法，但是具备相同功能的请求。

3.checkStatus.js检查请求完成后，返回的data中的code是否存在错误，如果有则直接抛出。

我们在处理后台请求时还会需要几个文件：

1. utils/ip.js设置请求的ip地址

2. utils/utils.js中的createTheURL拼接ip地址与API接口，使其成为一个完整的请求地址

3. config/api.js写共有的请求方式（REQUEST_METHOD），和API请求接口


# ES6部分
## 解构赋值

```js
const obj = {
    a:1,
    b:2,
    c:3,
}
// bad
const a = obj.a;
const b = obj.b;

//good
const {a,b} = obj
```
补充：

ES6的解构赋值虽然好用。但是要注意解构的对象不能为`undefined`、`null`。否则会报错，故要给被解构的对象一个默认值。
```js
const {a,b,c,d,e} = obj || {};
```
默认值生效的条件是，对象的属性值严格等于`undefined`
```js
const {x = 3} = {x: undefined};
x // 3

const {x = 3} = {x: null};
x // null
```

## 扩展运算符
使用扩展运算符来合并两个数组，对象；而不是Object.assign，[].concat

数组：
```js
const a = [1,2,3];
const b = [1,5,6];

// bad
const c = a.concat(b);//[1,2,3,1,5,6]

// god
const c = [...a, ...b];

//考虑到数组去重
const c = [...new Set([...a,...b])];//[1,2,3,5,6]
```
对象：
```js
const obj1 = { a:1, } 
const obj2 = { b:1, } 

// bad
const obj = Object.assign({}, obj1, obj2); //{a:1,b:1}

// good
const obj = {...obj1,...obj2}; //{a:1,b:1}
```

## 可选链操作符
使用 `?.` 语法可以安全的访问属性。
```js
// bad
const name = obj && obj.name;

// good
const name = obj?.name;
```

# React规范
## props
不要去修改props，这样会破坏React的单向数据流。props数据流只能从上流到下，从外流到内，且不能让内部影响外部的值，这样能使状态变得可以预测

在子组件内，先把 props 赋值给一个变量，再修改这个变量。


## JSX
（1）当标签没有子元素的时候，始终使用自闭合的标签，并最后空一格 。
```js
// bad
<UserInfo></UserInfo>

// good
<UserInfo />
```
（2）如果组件有多个属性时，要将属性换行，并将关闭标签要另起一行 。
```js
// bad
<Component bar="bar" baz="baz" onClick = {this.handleClick} />
 
// good
<Component 
    bar="bar" 
    baz="baz" 
    onClick = {this.handleClick}
/>
```
（3）render中return出去的JSX使用`()`包裹一层
```js
// bad
  render() {
    return <MyComponent className="long body" foo="bar">
             <MyChild />
           </MyComponent>;
  }

// good
  render() {
    return (
      <MyComponent className="long body" foo="bar">
        <MyChild />
      </MyComponent>
    );
  }
```

## 列表循环时将key设置为唯一的id
在map循环时，不要用index作为每个标签的key
```
// bad
{todos.map((todo, index) =>
  <Todo
    {...todo}
    key={index}
  />
)}

// good
{todos.map(todo => (
  <Todo
    {...todo}
    key={todo.id}
  />
))}
```
使用`index`作为key值，会出现的问题：

1. 列表项可能会出现不符合预期的渲染
2. 删除第一个节点时会造成剩余节点的全部更新，不利于性能优化

## 样式写法
React 中样式可以使用 style 行内样式，也可以使用 className 属性来引用外部 CSS 样式表中定义的 CSS 类，我们推荐使用 className 来定义样式

## 为组件绑定事件处理器
```
// bad
 constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
 }
 handleClick(){
    console.log('this is:', this);
 }
 <button onClick={this.handleClick}> Click me </button>
 
 // good
 handleClick = () => {
    console.log('this is:', this);
 }
 <button onClick={this.handleClick}> Click me </button>
 ```

## 避免不必要的render
可以通过继承React.PureComponent，或者手动操作shouldComponentUpdate这个生命周期函数，来控制子组件是否渲染

根据Dom Diff算法，React只会进行同级节点的对比，如果父组件发生变化，会将父组件下的子组件卸载再重新挂载，浪费性能

## 条件渲染
将if-else改成三元表达式或`&&`
```js
// bad
return (
  <div>
    {(() => {
      if (isLoggedIn) {
        return <div>I'm logged in.</div>;
      }
    })()}
  </div>
); 

// good
{
  isLoggedIn ? <div>I'm logged in.</div> : null;
}

{
  isLoggedIn && <div>I'm logged in.</div>;
} 
```
当有多个if-else时，推荐使用swith-case，或者使用策略模式改善
```
const ALERT_STATUS = {
  warning: <AlertComponent status="warning" />,
  error: <AlertComponent status="error" />,
  success: <AlertComponent status="success" />,
  info: <AlertComponent status="info" />,
};

return <div>{ALERT_STATUS[status]}</div>; 
```
## 组件代码顺序
```js
class Example extends Component {
    // 静态属性
    static defaultProps = {}

    // 构造函数
    constructor(props) {
        super(props);
        this.state={}
    }

    // 声明周期钩子函数
    // 按照它们执行的顺序
    // 1. componentWillMount
    // 2. componentWillReceiveProps
    // 3. shouldComponentUpdate
    // 4. componentDidMount
    // 5. componentDidUpdate
    // 6. componentWillUnmount
    componentDidMount() { ... }

    // 事件函数/普通函数
    handleClick = (e) => { ... }

    // 最后，render 方法
    render() { ... }
}
```

# 命令规范
## JS中命名
### 1. 变量采用小驼峰命名法

第一个单词以小写字母开始，第二个单词的首字母大写。例如：firstName、lastName。一般的变量、函数均采用小驼峰式命名。

### 2. 枚举字段采用全大写式命名

常量通常采用全大写式命名，单词间以下划线“_”分割。
```js
export const DEFAULT_WEIGHT = 50;
```
### 3. 函数命名规范


函数的命名采用动词前缀+名词修饰，小驼峰的命名方式
**前缀**    | **说明**    |
| ---------------- | ------ |
| can       | 是否可以执行某操作 |
| is        | 是否xxx     |
| has       | 是否有xxx    |
| calc      | 计算        |
| change    | 改变        |
| fetch/get | 获取（数据)    |
| handle    | 操作        |
| judge     | 判断        |
| set       | 设置      |
| create    | 创建      |
| ......|......|

例子：
```js
const handleSubmit = () => {}
const createForm = () => {}
```

## React中命名
### 组件命名
组件命名尽量和文件名保持一致，并采用大驼峰命名规则
```js
// bad
import StandardTable from '@/components/index'

// good
import StandardTable from '@/components/StandardTable';
```
### 属性命名
属性名称：  React DOM 使用小驼峰命令来定义属性的名称，而不使用 HTML 属性名称的命名约定；
```js
// 属性名称 
onClick
```


