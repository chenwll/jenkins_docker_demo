import React,{PureComponent} from 'react';
import {Card,message,Button,Modal,Row,Col,Form} from 'antd';
import {connect} from 'dva';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from '@/components/FooterToolbar';
import AdvancedSelect from '../../components/AdvancedSelect';
import * as SelectFieldConfig from '../../utils/globalSelectDataConfig';
import * as utils from '../../utils/utils';
import { lineItem } from '../../utils/globalUIConfig';

const {confirm}=Modal;
const FormItem=Form.Item;
@connect(({loading,expertDistributionModel})=>({
  loading,
  fetchLoading:loading.effects['expertDistributionModel/expertFetch'],
  expertDistributionModel,
}))
class ExpertDistribution extends PureComponent{

  constructor(props){
    super(props);
    this.state={
      choosedExpId:undefined,// advancedSelected选中的专家
      StandardTableData:[],
    }
  };

  componentDidMount(){
    const {dispatch}=this.props;
    const {projects}=this.props;
    dispatch({
      type:'expertDistributionModel/getExpertGroup'
    })
    this.setState({
      StandardTableData:projects
    })
  };

  distribution=()=>{
    const {processId,projects,onClose,handleSelectRows,pageInfo,searchParams}=this.props;
    const {expertDistributionModel:{expertGroup,pagination}}=this.props;
    const {dispatch}=this.props;
    const {choosedExpId}=this.state;
    if(choosedExpId){
      confirm({
        title: `是否确认给选中项目分配该专家组`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const projectIds=projects.map(item=>item.projectId);
          const reviewYear=projects.map(item=>item.reviewYear);
          let groupName='';
          let expertIds="";
          expertGroup.forEach((item)=>{
            if(item.groupId==choosedExpId){
              groupName=item.groupName
              expertIds=item.expertIds
            }
          });
          dispatch({
            type:'expertDistributionModel/CloudeExpertDistrbution',
            payload:{
              expertDis:{
                depExpIds:expertIds,
                groupName,
                processId,
                projectIds,
                reviewYear:reviewYear[0],
              },
              fetch:{
                state:1,
                flag:0,
                expOrDep:2,// 2表示专家
                processId,
                ...pageInfo,
                ...searchParams,
                ...pagination
              }
            }
          })
          onClose();
          handleSelectRows([])
        }
      })
    }
    else{
      message.warning('尚未选择需要分配的专家')
    }
  };

  expertsWithSchooltype(allExpert=[],schoolType){
    let expertsWithSchooltype=[];
    expertsWithSchooltype=allExpert.filter(item=>{
      if(item.schoolType==schoolType){
        item.expertId=item.expertId.toString()
        return item
      }
    })
    return expertsWithSchooltype
  };

  render(){
    const {form:{getFieldDecorator}}=this.props;
    const {choosedExpId,StandardTableData}=this.state;
    const {projects}=this.props;
    const {fetchLoading,onClose}=this.props;
    const {gDictData}=this.props;
    let {expertDistributionModel:{expertGroup}}=this.props;
    expertGroup=expertGroup.map((item)=>{
      item['groupId']=String(item.groupId);
      return item
    });
    const columns=[
      {
        title : '项目序号',
        dataIndex : 'key',
        key : 'key',
        align: 'center',
        render:(text,record,index)=> <span>{index+1}</span>
      },
      {
        title:"项目名称",
        key:'projectName',
        dataIndex:'projectName',
      },
      {
        title : '项目负责人',
        dataIndex : 'prjOwner',
        key : 'prjOwner',
      },
      {
        title: '类型',
        dataIndex: 'schoolType',
        key: 'schoolType',
        render: (text)=> <>{utils.getAllDictNameById(gDictData,'schoolType',String(text))}</>
      },
    ];

    return(
      <>
        <Card bordered={false}>
          <Row>
            <Col span={24}>
              <FormItem {...lineItem} label="专家组">
                {getFieldDecorator('expertType', {
                  initialValue : undefined,
                  rules : [
                    {
                      required : true,
                      whitespace:true,
                      message : '请选择专家组',
                    },
                  ],
                })(<AdvancedSelect style={{'width':'100%'}} dataSource={expertGroup} placeholder="请选择专家组" fieldConfig={SelectFieldConfig.expertGroup} onChange={(value) => {this.setState({choosedExpId:value})}} />)}
              </FormItem>
            </Col>
          </Row>
          <StandardTable
            data={{list:StandardTableData}}
            columns={columns}
            loading={fetchLoading}
            selectedRows={projects}
            onSelectRow={this.handleSelectRows}
            rowKey={record => record.projectId}
            rowSelection={null}
          />
          <FooterToolbar style={{ width : '100%' }}>
            <Button type="primary" onClick={this.distribution} disabled={!choosedExpId}>
              确认分配
            </Button>
            <Button style={{ marginLeft : 8 }} onClick={onClose}>
              返回
            </Button>
          </FooterToolbar>
        </Card>
      </>
    )
  }
}
export default ExpertDistribution;
