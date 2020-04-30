import React, { Component }  from 'react';
import 'scss/Main.scss';
import { BrowserRouter as Router, Switch, Redirect, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from 'store/index';
import Routes from 'constants/Routes';
import MainRouter from "util/MainRouter";
import Dashboard from 'view/Dashboard';
import Login from 'view/Login';
import SideNotifications from 'component/SideNotifications';
import NotificationManager from 'util/NotificationManager';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <SideNotifications ref={ref => { NotificationManager.setSideNotificationsElement(ref); }} />
        <Router ref={ref => MainRouter.setRouter(ref)}>
          <Switch>
            <Route path={Routes.LOGIN_URI} exact component={Login} />
            <Route path={Routes.DASHBOARD_URI} component={Dashboard} />
            <Redirect to={Routes.DASHBOARD_URI} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
