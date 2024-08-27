const allRoles = {
  user: ['getInfo'],
  admin: ['getUsers', 'manageUsers', 'getInfo'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
