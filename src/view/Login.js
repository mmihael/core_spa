import React, { Component } from 'react';
import Input from 'component/form/Input';
import MainRouter from 'util/MainRouter';
import Axios from 'client/Axios';
import Routes from 'constants/Routes';
import NotificationManager from 'util/NotificationManager'
import Translator from 'multilanguage/Translator'
const translate = Translator.translate;

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 col-lg-2'></div>
          <div className='col-md-12 col-lg-8'>
            <div className='login_component border-radius-none card margin-top-first-item'>
              <div className="card-body">
                <form onSubmit={e => {
                  e.preventDefault();
                  var formData = new URLSearchParams();
                  formData.append('username', this.state.username.trim());
                  formData.append('password', this.state.password.trim());
                  Axios
                    .post('/api/login', formData)
                    .then(res => {
                      if (res.status === 202) {
                          MainRouter.getRouter().history.push(Routes.DASHBOARD_URI);
                      }
                    })
                    .catch(err => { NotificationManager.danger(translate('Failed to login')); })
                }}>
                  <Input
                    label={translate('Username')}
                    inputPlaceholder={translate('Username')}
                    inputType='text'
                    inputId='username'
                    onChange={e => { this.setState({ username: e.target.value }); }}
                    value={this.state.username}
                  />
                  <Input
                    label={translate('Password')}
                    inputPlaceholder={translate('Password')}
                    inputType='password'
                    inputId='password'
                    onChange={e => { this.setState({ password: e.target.value }); }}
                    value={this.state.password}
                  />
                  <button className='btn bg-bright text-light' style={{ width: '100%' }} type='submit'>{translate('Login')}</button>
                </form>
              </div>
            </div>
          </div>
          <div className='col-md-12 col-lg-2'></div>
        </div>
      </div>
    );
  }
}

export default Login;