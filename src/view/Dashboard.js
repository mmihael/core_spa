import React, { Component } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import UserTable from 'view/users/UserTable';
import UserForm from 'view/users/UserForm';
import OrganizationTable from 'view/organization/OrganizationTable';
import OrganizationForm from 'view/organization/OrganizationForm';
import OrganizationUsers from 'view/organization/OrganizationUsers';
import OrgUserTable from 'view/users/OrgUserTable';
import OrgUserForm from 'view/users/OrgUserForm';
import Index from 'view/Index';
import Routes from 'constants/Routes';
import MainRouter from 'util/MainRouter';
import LocalStorage from 'util/LocalStorage';
import Modal from 'component/Modal';
import NotificationManager from 'util/NotificationManager';
import Translator from 'multilanguage/Translator';
import Axios from 'client/Axios';
import ApiClient from 'client/ApiClient';
import { setConfig } from 'actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from "react-redux";
import {
  faUser,
  faUsers,
  faTachometerAlt,
  faSignOutAlt,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
const translate = Translator.translate;

function mapDispatchToProps(dispatch) {
  return {
    setConfig: config => dispatch(setConfig(config)),
  }
}

const mapStateToProps = state => {
  return { config: state.config }
};

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlayCount: 0
    }
  }

  handleLogout(e) {
    e.preventDefault();
    Axios
      .get('/api/logout')
      .then(res => {
        MainRouter.getRouter().history.push(Routes.LOGIN_URI)
      })
      .catch(err => { NotificationManager.danger(translate('Failed to log out')) })
  }

  componentDidMount = () => {
    ApiClient
      .getAppConfig()
      .then(res => {
        this.props.setConfig(res.data);
      })
      .catch(err => { NotificationManager.danger(translate('Failed to get user settings')) })
  }

  renderOrganizationOwnerMenuItems = (currentUri) => {
    let orgPlaceHolder = ':organizationId'
    let activeOrganizationId = this.props.config.activeOrganization
    let usersUris = [
      Routes.DASHBOARD_ORG_USERS_URI,
      Routes.DASHBOARD_ORG_USERS_FORM_URI
    ].map(r => r.replace(orgPlaceHolder, activeOrganizationId))
    return (
      <React.Fragment key={'OrganizationOwnerMenuItems'}>
        <Link
          className={'list-group-item list-group-item-action' + (usersUris.indexOf(currentUri) >= 0 ? ' active' : '')}
          to={Routes.DASHBOARD_ORG_USERS_URI.replace(orgPlaceHolder, activeOrganizationId)}
        ><FontAwesomeIcon icon={faUsers}/> {translate('Users')}</Link>
      </React.Fragment>
    )
  }

  renderSuperAdminMenuItems = (currentUri) => {
    let usersUris = [Routes.DASHBOARD_USERS_URI, Routes.DASHBOARD_USERS_FORM_URI]
    return (
      <React.Fragment key='SuperAdminMenuItems'>
        <Link
          className={'list-group-item list-group-item-action' + (usersUris.indexOf(currentUri) >= 0 ? ' active' : '')}
          to={Routes.DASHBOARD_USERS_URI}
        ><FontAwesomeIcon icon={faUsers}/> {translate('Users')}</Link>
        <Link
          className={'list-group-item list-group-item-action' + (currentUri.startsWith(Routes.DASHBOARD_ORGANIZATIONS_URI) === true ? ' active' : '')}
          to={Routes.DASHBOARD_ORGANIZATIONS_URI}
        ><FontAwesomeIcon icon={faBuilding}/> {translate('Organizations')}</Link>
      </React.Fragment>
    )
  }

  renderMenu = () => {
    const currentUri = this.props.location.pathname;
    let menuItems = []
    if (this.props.config) {
      if (this.props.config.activeOrganizationOwner === true) {
        menuItems.push(this.renderOrganizationOwnerMenuItems(currentUri));
      }
      if (this.props.config.isSuperAdmin === true) {
        if (menuItems.length > 0) {
          menuItems.push(
            <div key='SuperAdminOptionsSeparator' className='dashboard-side-menu-item-sub-section-title'>
              <div className='text-holder'>&nbsp;&nbsp;{translate('Super-Admin')}</div>
            </div>
          );
        }
        menuItems.push(this.renderSuperAdminMenuItems(currentUri));
      }
    }
    return(
      <div id='dashboard-side-menu'>
        <div className='side-menu-logo-container'>
          {this.props.config ? (
            <div className='text-gray'>
              <div className='text-center'><FontAwesomeIcon icon={faUser}/></div>
              <div className='text-center'>{this.props.config.user.username}</div>
            </div>
          ) : null}
        </div>
        <div className="list-group">
          <Link
            className={'submenu-container list-group-item list-group-item-action' + ([Routes.DASHBOARD_URI].indexOf(currentUri) >= 0 ? ' active' : '')}
            to={Routes.DASHBOARD_URI}
          >
            <div><FontAwesomeIcon icon={faTachometerAlt}/> {translate('Dashboard')}
              <div className="list-group submenu">
                {[1, 2].map(val => (
                  <button
                    key={val}
                    type="button"
                    className={"list-group-item list-group-item-action"}
                    onClick={e => e.preventDefault()}
                  >{val}. {translate('Option')}</button>
                ))}
              </div>
            </div>
          </Link>
          {menuItems}
        </div>
      </div>
    )
  }

  render() {
    // if (this.props.config == null) { return (<div>{translate('Configuration not loaded')}</div>); } // todo: make better UX
    return (
      <div className='dashboard-root'>
        <div id='dashboard-container'>
          {this.renderMenu()}
          <div id='dashboard-content'>
            <div className='top-nav'>
              <div className="logo text-center">
              </div>
              <div style={{ flex: 1 }}></div>
              <div>
                {/*<a className='nav-item' href='/language' onClick={e => { e.preventDefault(); this._langModal.toggle(); }}>Lang</a>*/}
                <a className='nav-item' href='/logout' onClick={this.handleLogout}><FontAwesomeIcon icon={faSignOutAlt}/> {translate('Logout')}</a>
              </div>
            </div>
            <div id='dashboard-content-inner'>
            <Switch>
              <Route exact path={Routes.DASHBOARD_URI} component={Index} />
              <Route exact path={Routes.DASHBOARD_USERS_URI} component={UserTable} />
              <Route exact path={Routes.DASHBOARD_USERS_FORM_URI} component={UserForm} />
              <Route exact path={Routes.DASHBOARD_ORGANIZATIONS_URI} component={OrganizationTable} />
              <Route exact path={Routes.DASHBOARD_ORGANIZATIONS_FORM_URI} component={OrganizationForm} />
              <Route exact path={Routes.DASHBOARD_ORGANIZATIONS_USERS_URI} component={OrganizationUsers} />
              <Route exact path={Routes.DASHBOARD_ORG_USERS_URI} component={OrgUserTable} />
              <Route exact path={Routes.DASHBOARD_ORG_USERS_FORM_URI} component={OrgUserForm} />
            </Switch>
            </div>
          </div>
        </div>
        <Modal
          ref={r => this._langModal = r}
          renderBody={() => {
            const updateLanguage = (lang) => {
              LocalStorage.setActiveLanguage(lang);
              MainRouter.getRouter().forceUpdate();
              this._langModal.toggle();
            };
            return (
              <div>
                <button type='button' className='btn btn-primary' onClick={e => { updateLanguage('en'); }}>English</button>&nbsp;
                <button type='button' className='btn btn-primary' onClick={e => { updateLanguage('hr'); }}>Hrvatski</button>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

const DashboardConnected = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default DashboardConnected;
