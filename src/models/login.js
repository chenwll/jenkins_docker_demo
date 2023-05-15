import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import tokenHandler from '../utils/tokenHandler';

export default {
  namespace : 'login',

  state : {
    status : undefined,
  },

  effects : {
    * login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.code == 0) {
        tokenHandler.setSessionByKey('token', response.data.accessToken);
        response.currentAuthority = response.data.roleName;
        yield put({
          type : 'changeLoginStatus',
          payload : response,
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    // * getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    * logout(_, { put }) {
      yield put({
        type : 'changeLoginStatus',
        payload : {
          status : false,
          currentAuthority : 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname : '/index',
          search : stringify({
            redirect : window.location.href,
          }),
        }),
      );
    },
  },

  reducers : {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status : payload.status,
        type : payload.type,
      };
    },
  },
};
