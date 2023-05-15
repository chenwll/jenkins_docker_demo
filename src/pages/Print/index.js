import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Button,
  Col,
  Card,
  Form,
  message,
  InputNumber,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {styleObj} from './style';


@Form.create()
@connect(({ print }) => ({
  print,
}))
class PrintTable extends PureComponent {
  state = {
    printData:[],
    printCol:[],
    pageNumber:10,
    printGroupData:[],
  }

  componentDidMount() {
    const printCol = [
      {
        key:'number',
        name:'序号',
      },{
        key:'goodsName',
        name:'商品名称',
      },{
        key:'goodsType',
        name:'商品类型',
      },{
        key:'unitName',
        name:'单位',
      },{
        key:'specifications',
        name:'规格',
      }];
    const printData = [];
    const { pageNumber } = this.state;
    const { print:{ payload:{formPrintData} } } = this.props;
    formPrintData.forEach((i,index)=>{
      const colData = {};
      printCol.forEach(j=>{
        colData[j.key] = i[j.key];
      })
      colData.number = index+1;
      printData.push(colData);
    });
    const printGroupData = this.page(pageNumber,printData);
    this.setState({
      printData,
      printCol,
      printGroupData,
    })
  }

  componentWillReceiveProps(nextProps){
    const printCol = [
      {
        key:'number',
        name:'序号',
      },{
        key:'goodsName',
        name:'商品名称',
      },{
        key:'goodsType',
        name:'商品类型',
      },{
        key:'unitName',
        name:'单位',
      },{
        key:'specifications',
        name:'规格',
      }];
    const printData = [];
    const { pageNumber } = this.state;
    const { print:{ payload:{formPrintData} } } = nextProps;
    formPrintData.forEach((i,index)=>{
      const colData = {};
      printCol.forEach(j=>{
        colData[j.key] = i[j.key];
      })
      colData.number = index+1;
      printData.push(colData);
    });
    const printGroupData = this.page(pageNumber,printData);
    this.setState({
      printData,
      printCol,
      printGroupData,
    })
  }

  createTitle = (title)=>(
    <div>
      <h1 style={styleObj.title}>{title}</h1>
    </div>
    )

  createHeader = (headerData)=>{
    headerData = [
      {
        orderID:'订单编号',
        value:'P201901020002',
      },{
        people:'采购人员',
        value:'xxx',
      },{
        time:'采购时间',
        value:'2019年01月01日',
      }
    ];
    return (
      <table>
        <tbody style={styleObj.header}>
          <tr>
            <th>订单编号：</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value="P201901020002" />
            </th>
          </tr>
          <tr>
            <th>采购员：</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value="xxx" />
            </th>
            <th>采购时间：</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value="2019年01月01日" />
            </th>
          </tr>
        </tbody>
      </table>
    )
  }

  createForm = (printCol,printData)=>(
    <table style={styleObj.printTable}>
      <tbody>
        {
          (
            <tr style={styleObj.printTableTr}>
              {printCol.map(item=><th style={{...styleObj[item.key],...styleObj.printTableTh}}><div>{item.name}</div></th>)}
            </tr>
          )
        }
        {
          printData.map(item=> (
            <tr style={styleObj.printTableTr}>
              {Object.keys(item).map(i => <th style={styleObj.printTableTh}>{item[i]}</th>)}
            </tr>
            )
          )
        }
      </tbody>
    </table>
    )

  createFooter = (footerData)=>{
    return (
      <table>
        <tbody style={styleObj.footer}>
          <tr>
            <th>供应商（签字）</th>
            <th>
              <div style={styleObj.footerSpace} />
            </th>
            <th colSpan="4">
              <input style={styleObj.printInputFooter} />
            </th>
            <th>库管员（签字）</th>
            <th>
              <div style={styleObj.footerSpace} />
            </th>
            <th colSpan="4">
              <input style={styleObj.printInputFooter} />
            </th>
            <th>{`第${footerData.current}页`}</th>
            <th>{`共${footerData.total}页`}</th>
          </tr>
        </tbody>
      </table>
    )
  }

  handlePrint = () => {
    const win = window.open('','printwindow');
    win.document.write(window.document.getElementById('printArea').innerHTML);
    win.print();
    win.close();
  }

  createPrintArea = (printCol)=>{
    const {printGroupData} = this.state;
    return (
      printGroupData.map((item,index)=>{
        if(item.length){
          return (
            <div style={styleObj.printArea}>
              {this.createTitle('xxxxxxx公司xxx单')}
              {this.createHeader('asd')}
              {this.createForm(printCol,item)}
              {this.createFooter({current:index+1,total:printGroupData.length})}
            </div>
          )
        }
      })
    )
  }

  handlePage = ()=>{
    const { pageNumber, printData } = this.state;
    if(pageNumber <= 0){
      message.warning('输出正确的分页');
      return;
    }
    this.setState({
      printGroupData:this.page(pageNumber, printData)
    })
  }

  page = (pageNumber,printData)=>{
    const printDataBack = printData.concat();
    const printGroupData = [];
    while(printDataBack.length >= pageNumber){
      let tempGroup = [];
      tempGroup = printDataBack.splice(0,pageNumber);
      printGroupData.push(tempGroup);
    }
    if(printDataBack.length){
      printGroupData.push(printDataBack);
    }
    printGroupData.forEach((item)=>{
      item.forEach((i,index)=>{
        i.number = index+1;
      })
    });
    return printGroupData;
  }

  onChange = (value)=>{
    this.setState({
      pageNumber:value,
    })
  }

  render() {
    const { printCol, printData } = this.state;
    return (
      <PageHeaderWrapper title="查询表格">
        <Card>
          <Row>
            <Col span={6}>
              <Row>
                <Col span={12}>
                  <InputNumber onChange={this.onChange} placeholder='输入自定义分页数量' style={{width:'100%'}}/>
                </Col>
                <Button onClick={this.handlePage}>确认分页</Button>
              </Row>
              <Row>
                <Button onClick={this.handlePrint} type='primary'>打印</Button>
              </Row>
            </Col>
            <Col span={12}>
              <div id='printArea'>
                <div style={styleObj.printArea}>
                  {printCol.length&&printData.length? this.createPrintArea(printCol):null}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PrintTable;


