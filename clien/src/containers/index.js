import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Layout } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { actions } from '../reducers/user';

import Navigation from './navigation/Navigation';
import Register from './register/Register';
import Login from './login/Login';
import ShowFiles from './showFiles/ShowFiles';
import Home from './home/Home';

const { user_auth } = actions;

const { Header, Content, Footer } = Layout;

class App extends Component {
  componentDidMount() {
    this.props.user_auth();
  }

  render() {
    return (
      <Router>
        <Layout>
          <Navigation />
          <Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
            <Header style={{ backgroundColor: "#fff" }}>我的云盘</Header>
            <Content style={{ padding: '10px 20px' }}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/disk" component={ShowFiles} />
                <Redirect to="/" />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.user.userInfo,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    user_auth: bindActionCreators(user_auth, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);