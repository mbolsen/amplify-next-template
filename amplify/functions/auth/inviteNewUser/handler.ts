import { Schema } from "../../../data/resource";
import { AdminCreateUserCommand, CognitoIdentityProviderClient, ListUsersInGroupCommand, } from "@aws-sdk/client-cognito-identity-provider";
// import { GROUPS } from "../../../auth/resource";
import { env } from "$amplify/env/userGroups"
import { GROUPS } from "../../../auth/resource";

const client = new CognitoIdentityProviderClient();

export const handler: Schema['inviteNewUser']['functionHandler'] = async (event): Promise<any> => {
  console.log('____CHANGE USER GROUPS TRIGGER FIRED____');

  let result: Record<string, string[]> = {};

  const groupPromises = ['EVERYONE', "ADMIN"].map(async (GroupName) => {
    const input = {
      // "DesiredDeliveryMediums": ["EMAIL"],
      // "MessageAction": "SUPPRESS",
      // "TemporaryPassword": "ThisisaTemporaryPassword123!",
      // "UserAttributes": [
      //   {
      //     "Name": "name",
      //     "Value": "John"
      //   },
      //   {
      //     "Name": "email",
      //     "Value": "testuser@example.com"
      //   }
      // ],
      "UserPoolId": env.AMPLIFY_AUTH_USERPOOL_ID,
      "Username": event.arguments.email?.toString()
    };

    const result = await client.send(new AdminCreateUserCommand(input));

  });

  await Promise.all(groupPromises);

  return result;
  // return { hello: "hi" }
};