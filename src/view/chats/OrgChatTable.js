import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ApiUris from 'constants/ApiUris';
import Routes from 'constants/Routes';
import ApiTable from 'component/ApiTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentDots
} from '@fortawesome/free-solid-svg-icons';
import Translator from 'multilanguage/Translator';
const translate = Translator.translate;

class OrgChatTable extends Component {

  render() {
    const orgChatsFormUri = Routes.DASHBOARD_ORG_CHATS_FORM_URI
      .replace(':organizationId', this.props.match.params.organizationId)
    return (
      <>
        <div>
          <Link
            className={'btn btn-success'}
            to={orgChatsFormUri}
          >{translate('Create chat')}</Link>
        </div>
        <br />
        <ApiTable
          pageUri={ApiUris.ORG_CHATS_PAGE_URI.replace('{organizationId}', this.props.match.params.organizationId)}
          entityUri={ApiUris.ORG_USERS_URI}
          formUri={orgChatsFormUri}
          enableOptionsCell={true}
          enableEdit={true}
          enableDelete={true}
          additionalOptions={item => { return (
            <>
              <Link
                title={translate('Open chat')}
                to={Routes.DASHBOARD_ORG_CHATS_VIEW_URI.replace(':organizationId', this.props.match.params.organizationId).replace(':chatId', item.id)}
                className='btn btn-primary btn-sm'
              ><FontAwesomeIcon icon={faCommentDots}/></Link>
            </>
          ); }}
          columnNames={[
            translate('ID'),
            translate('Name'),
            translate('Created at'),
            translate('Updated at')
          ]}
          cellValueExtractors={[
            'id',
            'name',
            item => (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : null),
            item => (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : null)
          ]}
          searchOptions={[
            { label: translate('Name'), propName: 'name', type: 'text' }
          ]}
        />
      </>
    )
  }

}

export default OrgChatTable;