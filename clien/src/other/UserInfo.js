import React, { Component } from 'react';
class Userinfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userinfo:null
    };
  }
  componentDidMount() {
    const apiUrl = `http://localhost:3001/users/info`;
    const option = {
     mod:'cors',
     method:'GET'
    }
    console.log('componentDidMount');
    fetch(apiUrl,option).then(response =>{
      if(response.status !== 200){
        throw new Error('Fail to get response with status'+response.status);
      }
      console.log('get data',response);
      response.json().then(responseJson => { 
        console.log('responseJson',responseJson[0]);
        this.setState({
          userinfo:responseJson[0]
        });
      }).catch(error => {
        this.setState({
          userinfo:null
        });
      });
    }).catch(error => {
      this.setState({
        userinfo:null
      });
    })
  }

  render() {
    if(!this.state.userinfo){
      return (
        <div>暂无用户信息</div>
      )
    }
    return (
      <div>
        获取到用户信息
        id:{this.state.userinfo.user_id},
        username:{this.state.userinfo.user_name}
      </div>
    );
  }
}

export default Userinfo;
