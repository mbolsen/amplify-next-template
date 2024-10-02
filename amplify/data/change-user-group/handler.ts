import { Schema } from "../resource";
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand, AdminRemoveUserFromGroupCommand } from '@aws-sdk/client-cognito-identity-provider'
import { env } from "$amplify/env/change-user-group"
import { Handler } from "aws-lambda";

const client = new CognitoIdentityProviderClient();

// add user to group
export const handler: Schema["changeUserGroup"]["functionHandler"] = async (event): Promise<any> => {
  const { userName, groupName, action } = event.arguments
  let response;

  if (userName) {

    if (action === 'add') {
      const command = new AdminAddUserToGroupCommand({
        GroupName: 'ADMIN',
        Username: userName,
        UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
      });
    response = await client.send(command);
    console.log('added user to group', response.$metadata.requestId);
    }

    else if (action === 'remove') {
      const command = new AdminRemoveUserFromGroupCommand({
        GroupName: 'ADMIN',
        Username: userName,
        UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
      })
      response = await client.send(command);
      console.log('removed user from group', response.$metadata.requestId);
    }
  }
  return response
}