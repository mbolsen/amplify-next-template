import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js'
import { changeUserGroup } from './functions/change-user-group/resource.js';

const backend = defineBackend({
  auth,
  data,
  storage,
  changeUserGroup,
});

// const { groups } = backend.auth.resources

// groups["ADMINS"].role