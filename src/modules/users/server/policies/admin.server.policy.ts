import * as acl from 'acl';

const _acl = new acl(new acl.memoryBackend());

function invokeRolesPolicies(){
  _acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users',
      permissions: '*'
    }]
  }]);
};

function isAllowed(req, res, next) {
  const roles = (req.user) ? req.user.roles : ['guest'];

  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
    if (err) {
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

export {
  invokeRolesPolicies, isAllowed 
}
