import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import config from '@/components/Exception/typeConfig';

export function getAllGroup(param){
    return request(createTheURL(Config.API.CHECKGROUP,'all'),{
        method:'GET',
        body:param
    })
}

export function getCurrentGroup(param){
    return request(createTheURL(Config.API.CHECKRULE,'group'),{
        method:'GET',
        body:param
    })
}

export function getCurrentGroupMessage(param){
    return request(createTheURL(Config.API.CHECKGROUP,'get'),{
        method:'GET',
        body:param
    })
}

export function createGroup(param){
    return request(createTheURL(Config.API.CHECKGROUP,'add'),{
        method:'POST',
        body:param
    })
}

export function EditGroup(param){
    return request(createTheURL(Config.API.CHECKGROUP,'update'),{
        method:'PUT',
        body:param
    })
}

export function DeleteGroup(param){
    return request(createTheURL(Config.API.CHECKGROUP,'delete?checkGroupId=' + param.checkGroupId),{
        method:'DELETE',
        body:null
    })
}

export function createRule(param){
    console.log('server',param);
    return request(createTheURL('/check','rule'),{
        method:'POST',
        body:param
    })
}

export function editRule(param){
    return request(createTheURL('/check','rule'),{
        method:'PUT',
        body:param
    })
}

export function deleteRule(param){
    return request(createTheURL(Config.API.CHECKRULE,'delete?groupRuleId=' + param.groupRuleId),{
        method:'DELETE',
        body:null
    })
}

export function getRule(param){
    return request(createTheURL(Config.API.CHECKRULE,'get'),{
        method:'get',
        body:param
    })
}