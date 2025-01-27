import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js'
import { changeUserGroup } from './functions/auth/changeUserGroup/resource.js';
import { userGroups } from './functions/auth/userGroups/resource.js';

export const backend = defineBackend({
  auth,
  data,
  storage,
  changeUserGroup,
  userGroups
});

// const { groups } = backend.auth.resources

// groups["ADMINS"].role