import Axios from 'client/Axios';
import ApiUris from 'constants/ApiUris';

let ApiClient = {};

ApiClient.getAppConfig = () => Axios.get(ApiUris.APP_CONFIGURATION_URI);

ApiClient.getUsersPage = (params) => Axios.get(ApiUris.USERS_PAGE_URI, { params });

ApiClient.getRolePage = (params) => Axios.get(ApiUris.ROLE_PAGE_URI, { params });

ApiClient.setOrganizationUserRoles = (organizationId, payload) => Axios
  .post(ApiUris.ORGANIZATION_USER_ROLE_URI.replace('{organizationId}', organizationId), payload);

export default ApiClient;