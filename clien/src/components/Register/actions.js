import {REGISTER_FETCH_STARTED, REGISTER_FETCH_SUCCESS, REGISTER_FETCH_FAILURE} from './actionTypes';
import {message}from 'antd'
export const fetchRegisterStarted = (userinfo) => ({
  type:REGISTER_FETCH_STARTED,
  userinfo
});

export const fetchRegisterSuccess = (result) => ({
  type:REGISTER_FETCH_SUCCESS,
  result
});

export const fetchRegisterFailure = (error) => ({
  type:REGISTER_FETCH_FAILURE,
  error
});

export const fetchRegister = (userinfo) => {
  return (dispatch, getState) => {
    // message.success('提交注册信息');
    fetchRegisterStarted(userinfo);
    let formData = new FormData();
    formData.append("username",userinfo.nickname);
    formData.append("password",userinfo.password);
    formData.append("phone",userinfo.phone);
    formData.append("email",userinfo.email);
    const apiUrl = `http://localhost:3001/users/register`;
    const option = {
      mod:'cors',
      method:'POST',
      body:formData
    }

    fetch(apiUrl, option).then((response) => {
      if(response.status!== 200){
        throw new Error('Fail to get response with status'+response.status);
      }
      console.log(response);
      response.json().then((responseJson) => {
        console.log('responseJson',responseJson);
        if(responseJson.code==='1'||responseJson.code==='2'){
          message.warning(responseJson.message);
        }else{
          message.success('注册成功');
          dispatch(fetchRegisterSuccess(responseJson));
        }

      }).catch(error=>{
        console.log('error',error);
      })
    }).catch((error) => {
      dispatch(fetchRegisterFailure(error));
    })

  }
}
