import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js'
import { changeUserGroup } from './functions/auth/changeUserGroup/resource.js';
import { userGroups } from './functions/auth/userGroups/resource.js';
import { postConfirmation } from "./auth/postConfirmation/resource";
import { addStaff } from "./functions/staff/resource.js";

import { Stack } from "aws-cdk-lib";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
  storage,
  changeUserGroup,
  userGroups,
  postConfirmation,
  addStaff
});

// const todoTable = backend.data.resources.tables["Todo"];
// const policy = new Policy(
//   Stack.of(todoTable),
//   "MyDynamoDBFunctionStreamingPolicy",
//   {
//     statements: [
//       new PolicyStatement({
//         effect: Effect.ALLOW,
//         actions: [
//           "dynamodb:createItem",
//           "dynamodb:GetRecords",
//         ],
//         resources: ["*"],
//       }),
//     ],
//   }
// );
// backend.addStaff.resources.lambda.role?.attachInlinePolicy(policy);
