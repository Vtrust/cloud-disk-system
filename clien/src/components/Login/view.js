import React,{Component} from 'react';
import * as actions from '../Register/actions'
import {connect} from 'react-redux';
import {
  Form, Input, Tooltip, Icon, Button, Select
} from 'antd';

const { Option } = Select;

class RegistrationForm extends Component {
  constructor() {
    super(...arguments);
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      this.props.submitRegister(values);
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    return (
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item
            label={(
              <span>
                Nickname&nbsp;
                <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            label="Password"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Login</Button>
          </Form.Item>
        </Form>
    );
  }
}

const WrappedLoginForm = Form.create({
   name: 'Login',
   mapPropsToFields(props) {
     //console.log('props',props);
     return {
      'nickname': Form.createFormField({
        value:props.nickname
      })
    };
  },
 })(RegistrationForm);

 function LoginBox({data, submitLogin}) {
    //console.log('userinfo',data, submitRegister);
   return (
     <WrappedLoginForm {...data} submitLogin = {submitLogin}/>
   )
 }

 function mapStateToProps(state) {
   return {data:state.user};
 }

 function mapDispatchToProps(dispatch) {
   return {
     submitRegister: (userinfo) => {
       dispatch(actions.fetchRegister(userinfo));
     }
   }
 }

export default connect(mapStateToProps,mapDispatchToProps)(LoginBox);
