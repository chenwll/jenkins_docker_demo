export function getTypeByUrl(dispatch, url, reducerType = 'regProjectApprovalModal/save') {

  const payloadList = {
    regType : {
      urlWay : '/AreaDepartmentSetting/regProjectApproval',
      APIType : 'reg',
    },
    eduType : {
      urlWay : '/projectEducation/edu',
      APIType : 'edu',
    },
    depType : {
      urlWay : '/educationDepartmentSetting/dep',
      APIType : 'dep',
    },
    expType:{
      urlWay : '/expertApproval/declaration/distribution',
      APIType : 'exp',
    }
  };
  let currPayload = {};
  if (!url) {
    // console.log('没有路径');
    return;
  }
  if (url.search(/reg/) !== -1) {
    currPayload = payloadList.regType;
  }
  else if (url.search(/edu/) !== -1) {
    currPayload = payloadList.eduType;
  }
  else if (url.search(/dep/) !== -1) {
    currPayload = payloadList.depType;
  }
  else if (url.search(/exp/) !== -1) {
    currPayload = payloadList.expType;
  }
  else{
    // console.log("getTypeByUrl没有找到路径的匹配项，请检查");
    return;
  }
  dispatch({
    type : reducerType,
    payload : currPayload,
  });

}
