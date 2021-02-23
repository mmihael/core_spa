import Axios from 'client/Axios';
import ApiUris from 'constants/ApiUris';

let ApiClient = {};

ApiClient.getAppConfig = () => Axios.get(ApiUris.APP_CONFIGURATION_URI);

ApiClient.getUsersPage = (params) => Axios.get(ApiUris.USERS_PAGE_URI, { params });

ApiClient.getRolePage = (params) => Axios.get(ApiUris.ROLE_PAGE_URI, { params });

ApiClient.setOrganizationUserRoles = (organizationId, payload) => Axios
  .post(ApiUris.ORGANIZATION_USER_ROLE_URI.replace('{organizationId}', organizationId), payload);

ApiClient.getOrgUsersPage = (organizationId, params) => Axios
  .get(ApiUris.ORG_USERS_PAGE_URI.replace('{organizationId}', organizationId), { params });

ApiClient.getOrgChats = (organizationId, params) => Axios
  .get(ApiUris.ORG_CHATS_PAGE_URI.replace('{organizationId}', organizationId), { params });

ApiClient.getChatMessages = (organizationId, chatId, params) => Axios
  .get(ApiUris.ORG_CHATS_ID_MESSAGE_URI.replace('{organizationId}', organizationId).replace('{chatId}', chatId), { params });

ApiClient.writeChatMessage = (organizationId, chatId, message) => Axios
  .post(ApiUris.ORG_CHATS_ID_MESSAGE_URI.replace('{organizationId}', organizationId).replace('{chatId}', chatId), { message });

export default ApiClient;