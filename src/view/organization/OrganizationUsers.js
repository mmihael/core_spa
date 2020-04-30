import React, { Component } from 'react';
import ApiClient from 'client/ApiClient';
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import LoaderOverlay from 'component/LoaderOverlay';
import ApiTable from 'component/ApiTable';
import Select from 'component/form/Select';
import NotificationManager from 'util/NotificationManager';
import Modal from 'component/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCog
} from '@fortawesome/free-solid-svg-icons';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class OrganizationUsers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editedUser: null,
      editedUserRoles: [],
      roleOptions: [],
      requestCount: 0
    };
  }

  componentDidMount = () => {
    this.initializeData();
  }

  initializeData = () => {
    this.setState(state => ({ requestCount: state.requestCount + 1 }));
    ApiClient
      .getRolePage({ size: -1, organizationRole: true })
      .then(res => {
        this.setState({ roleOptions: res.data.content.map(item => ({ label: item.name, value: '' + item.id })) });
      })
      .catch(err => { console.log(err); NotificationManager.danger(translate('Failed to get roles')) })
      .then(() => { this.setState(state => ({ requestCount: state.requestCount - 1 })); })
  }

  handleSubmit = e => {
    e.preventDefault();
    let requestBody = {};
    requestBody.userId = this.state.editedUser.id;
    requestBody.roleIds = this.state.editedUserRoles ? this.state.editedUserRoles.map(role => parseInt(role.value)) : [];
    this.setState(state => ({ requestCount: state.requestCount + 1 }));
    ApiClient
      .setOrganizationUserRoles(this.props.match.params.id, requestBody)
      .then(res => {
        NotificationManager.success(translate('Organization roles for user updated'))
        this.__permissionAssignModal.toggle()
        this.__userTable.refreshCurrentPage()
      })
      .catch(err => { console.log(err); NotificationManager.danger(translate('Error updating roles')); })
      .then(() => { this.setState(state => ({ requestCount: state.requestCount - 1 })); })
  }

  render() {
    return (
      <>
        {this.state.requestCount > 0 ? (<LoaderOverlay />) : null}
        <ApiTable
          ref={ref => this.__userTable = ref}
          pageUri={ApiUris.USERS_PAGE_URI}
          entityUri={ApiUris.USERS_URI}
          formUri={Routes.DASHBOARD_USERS_FORM_URI}
          enableOptionsCell={true}
          additionalOptions={item => {
            return <button
              onClick={e => {
                let editedUserRoles = []
                if (item.userRoles) {
                  let inOrgRoleIds = new Set(item.userRoles
                    .filter(userRole => (userRole.organizationId + '') === this.props.match.params.id)
                    .map(userRole => userRole.roleId + ''))
                  editedUserRoles = this.state.roleOptions.filter(role => inOrgRoleIds.has(role.value))
                }
                this.setState({editedUser: item, editedUserRoles}, () => { this.__permissionAssignModal.toggle() })
              }}
              title={translate('Manage roles')}
              className='btn btn-primary btn-sm'
            ><FontAwesomeIcon icon={faUserCog}/></button>
          }}
          columnNames={[
            translate('ID'),
            translate('Username'),
            translate('Is member')
          ]}
          cellValueExtractors={[
            'id',
            'username',
            item => {
              if (item.userRoles) {
                if (item.userRoles.find(ur => '' + ur.organizationId === this.props.match.params.id)) {
                  return true;
                }
              }
              return false;
            }
          ]}
          searchOptions={[
            { label: translate('Username'), propName: 'username', type: 'text' }
          ]}
        />
        <Modal
          title={translate('Assign organization role')}
          ref={ref => this.__permissionAssignModal = ref}
          renderBody={() => {
            return <div>
              {this.state.requestCount > 0 ? (<LoaderOverlay />) : null}
              <form onSubmit={this.handleSubmit}>
                <Select
                  label={(this.state.editedUser ? this.state.editedUser.username : '') + ' ' + translate('roles')}
                  isMulti={true}
                  value={this.state.editedUserRoles}
                  options={this.state.roleOptions}
                  onChange={value => this.setState({ editedUserRoles: value })}
                />
                <div className='text-right'>
                  <button className='btn btn-primary'>{translate('Save')}</button>
                </div>
              </form>
            </div>
          }}
        />
      </>
    )
  }

}

export default OrganizationUsers;