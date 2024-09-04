import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";
import { changeUserGroup } from "../functions/change-user-group/resource";
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['EVERYONE', "ADMIN"],
  triggers: {
    postConfirmation
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"]),
    allow.resource(changeUserGroup).to(["addUserToGroup", "removeUserFromGroup"])
  ]
});
