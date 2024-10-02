import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js'
import { changeUserGroup } from './data/change-user-group/resource.js';

export const backend = defineBackend({
  auth,
  data,
  storage,
  changeUserGroup,
});

// const { groups } = backend.auth.resources

// groups["ADMINS"].role