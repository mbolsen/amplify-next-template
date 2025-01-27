import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./postConfirmation/resource";
import { changeUserGroup } from "../functions/auth/changeUserGroup/resource";
import { userGroups } from "../functions/auth/userGroups/resource";
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

export const GROUPS = {
  everyone: 'EVERYONE',
  admin: 'ADMIN'
}

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: Object.values(GROUPS),
  triggers: {
    postConfirmation
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"]),
    allow.resource(changeUserGroup).to(["addUserToGroup", "removeUserFromGroup", "getGroup"]),
    allow.resource(userGroups).to(["listUsersInGroup"])
  ]
});
