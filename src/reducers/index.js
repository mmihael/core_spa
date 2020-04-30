import Roles from 'constants/Roles';

const initialState = {
  config: null
};

function rootReducer(state = initialState, action) {
  if (action.type === 'SET_CONFIG') {
    let config = {};
    config.user = action.payload.user;
    config.organizations = action.payload.organizations;
    config.isSuperAdmin = false;
    config.activeOrganization = null;
    config.activeOrganizationOwner = false;
    config.activeOrganizationMember = false;
    if (config.user.userRoles) {
      if (config.user.userRoles.find(userRole => userRole.organizationId === null && userRole.roleId === Roles.SUPER_ADMIN_ROLE_ID)) {
        config.isSuperAdmin = true;
      }
      if (config.organizations && config.organizations.length > 0) {
        let organizationId = config.organizations[0].id
        config.activeOrganization = organizationId
        config.user.userRoles.filter(userRole => userRole.organizationId === organizationId).forEach(userRole => {
          if (Roles.ORGANIZATION_OWNER_ID === userRole.roleId) {
            config.activeOrganizationOwner = true;
          } else if (Roles.ORGANIZATION_MEMBER_ID === userRole.roleId) {
            config.activeOrganizationMember = true;
          }
        })
      }
    }
    console.log(config);
    return Object.assign({}, state, { config });
  }
  return state;
}

export default rootReducer;