import { Schema } from "../../data/resource";
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider'
import outputs from "../../../amplify_outputs.json";

const client = new CognitoIdentityProviderClient();

// add user to group
export const handler: Schema["changeUserGroup"]["functionHandler"] = async (event) => {
  const { userName, groupName, userPoolId } = event.arguments
  let response;

  if (userName && userPoolId) {
    const command = new AdminAddUserToGroupCommand({
      GroupName: 'ADMIN',
      Username: userName,
      UserPoolId: outputs.auth.user_pool_id,
    });
    response = await client.send(command);
    console.log('processed', response.$metadata.requestId);
  }
  return `Success, changed ${userName} to group: ${groupName} --- \n\n ${response}`
}