import { Schema } from "../../../data/resource";
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand, AdminRemoveUserFromGroupCommand, GetGroupCommand } from '@aws-sdk/client-cognito-identity-provider'
import { env } from "$amplify/env/changeUserGroup"

// import { AwsJwtVerifier } from 'aws-jwt-verifier'
// import { Handler } from "aws-lambda";

const client = new CognitoIdentityProviderClient();
// TODO: This change-user-group folder should be in the functions folder
// const verifier = AwsJwtVerifier.create({
//   userPoolId: "<user_pool_id>", // mandatory, can't be overridden upon calling verify
//   tokenUse: "id", // needs to be specified here or upon calling verify
//   clientId: "<client_id>", // needs to be specified here or upon calling verify
//   groups: "admins", // optional
//   graceSeconds: 0, // optional
//   scope: "my-api/read", // optional
//   customJwtCheck: (payload, header, jwk) => {}, // optional
// });

// add user to group
export const handler: Schema["changeUserGroup"]["functionHandler"] = async (event, context): Promise<any> => {
  const { userName, groupName, action, orgGroup, userNameOfRequester } = event.arguments
  let response;
  let result = '';
  const groupsOfRequester = await client.send(new GetGroupCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    // AttributesToGet: null,
    GroupName: "ADMIN",
  }))

  const identity = event.identity as any
  const claims = identity.claims
  const reqGroup = claims["cognito:groups"]
  const eventUser = claims.username

  if (userName) {
    // First, ask cognito which groups the requester is a part of.  Confirm that the orgGroup received in params is there.
    // JSON.parse(reqGroup).includes(orgGroup) > 0
    result = reqGroup.indexOf(orgGroup);
    if (reqGroup.indexOf(orgGroup) > -1 && userName === eventUser) {
      result = 'success'
    }

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

  // event.request.headers.authorization
  return { result, response, reqGroup: reqGroup, orgGroup, eventUser }
}

// TODO: If user is a part of the ADMIN group they can call this function
