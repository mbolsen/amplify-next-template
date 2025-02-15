import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./postConfirmation/resource";
import { preSignUp } from "./preSignUp/resource";
import { changeUserGroup } from "../functions/auth/changeUserGroup/resource";
import { userGroups } from "../functions/auth/userGroups/resource";
import { inviteNewUser } from "../functions/auth/inviteNewUser/resource";
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

// These groups should be based off what a person can do in the app
export const GROUPS = {
  everyone: 'EVERYONE',
  admin: 'ADMIN',
  staff: 'STAFF',
  staffPay: 'STAFF_PAY',
}

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to the Toolbox app!",
      verificationEmailBody: (createCode) => `Use this code to confirm your account: ${createCode()}`,
    },
  },
  groups: Object.values(GROUPS),
  triggers: {
    postConfirmation,
    // preSignUp  // uncomment this line to enable the preSignUp trigger (it works)
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"]),
    allow.resource(changeUserGroup).to(["addUserToGroup", "removeUserFromGroup", "getGroup"]),
    allow.resource(userGroups).to(["listUsersInGroup"]),
    allow.resource(inviteNewUser).to(["createUser"])
  ]
});
