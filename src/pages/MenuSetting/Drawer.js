import React,{PureComponent } from 'react';
import {connect} from 'dva';
import {Button,Form,Input,Row,Col} from 'antd';
import { formItemLayout} from '../../utils/globalUIConfig';
import { MENUS_DETAIL_STATUS } from '../../utils/Enum';


const FormItem=Form.Item;
@Form.create()
@connect(({sysSetting,loading})=>({
  sysSetting,
  editMenu:loading.effects['sysSetting/updateMenu']
}))
class MenuDrawer extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    const {dispatch} =this.props;
    const {menuId}=this.props;
    dispatch({
      type:'sysSetting/getMenu',
      payload:{
        id:menuId,
      }
    })
  }

  addOrUpdateMenu=()=>{
    const { form: { validateFields },menuId,menuDetailStatus,onClose} = this.props;
    const {dispatch}=this.props;
    const {sysSetting:{drawerMenuData:{type}}}=this.props;
    validateFields((error,values)=>{
      if(!error){
        if(menuDetailStatus===MENUS_DETAIL_STATUS.ADD){
          dispatch({
            type: 'sysSetting/addMenu',
            payload: {
              route:values.menuRoute,
              icon:values.menuIcon,
              name:values.menuName,
              // sort:values.menuOrder,
              parentId:menuId,
              type:parseInt(type)+1,
            }
          })
        }
        else {
          dispatch({
            type: 'sysSetting/updateMenu',
            payload: {
              route:values.menuRoute,
              icon:values.menuIcon,
              name:values.menuName,
              // sort:values.menuOrder,
              id:menuId,
            }
          })
          // //为了让更新的条数据即使更新
          // dispatch({
          //   type:'sysSetting/updateData',
          //   payload: {
          //     data:{
          //       route:values.menuRoute,
          //       icon:values.menuIcon,
          //       name:values.menuName,
          //     }
          //   }
          // })
        }
      }
    })
    onClose();
  }


  render(){
    const {menuDetailStatus,onClose,editMenu}=this.props;
    const { form:{getFieldDecorator }} = this.props;
    let {sysSetting:{drawerMenuData}}=this.props;
    if(menuDetailStatus===MENUS_DETAIL_STATUS.ADD){
      drawerMenuData={
        name:'',
        route:'',
        icon:''
      }
    }
    return(
      <div>
        <FormItem {...formItemLayout} label="菜单名称">
          {getFieldDecorator('menuName',{
            // initialValue:title==='菜单更新'?drawerMenuData.name:'',
            initialValue:drawerMenuData.name,
            rules:[{
              required:true,
              message:'请输入新增菜单的名字'
            }]
          })(
            <Input placeholder="请输入新增菜单的名字" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="菜单地址">
          {getFieldDecorator('menuRoute',{
            initialValue:drawerMenuData.route,
          })(
            <Input placeholder="请输入新建菜单的地址" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="菜单图标">
          {getFieldDecorator('menuIcon',{
            initialValue:drawerMenuData.icon,
          })(
            <Input placeholder="请输入新增菜单的图标信息" />
          )}
        </FormItem>
        <Row type="flex" justify="center">
          <Col>
            <Button type='primary' onClick={this.addOrUpdateMenu} loading={editMenu}>保存</Button>
          </Col>
          <Col span={1} />
          <Col>
            <Button onClick={onClose}>取消</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default MenuDrawer;
