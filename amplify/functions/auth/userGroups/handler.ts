import { Schema } from "../../../data/resource";
import { CognitoIdentityProviderClient, ListUsersInGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
// import { GROUPS } from "../../../auth/resource";
import { env } from "$amplify/env/userGroups"
import { GROUPS } from "../../../auth/resource";

const client = new CognitoIdentityProviderClient();

export const handler: Schema['userGroups']['functionHandler'] = async (event): Promise<any> => {
  console.log('____CHANGE USER GROUPS TRIGGER FIRED____');

  let result: Record<string, string[]> = {};

  const groupPromises = ['EVERYONE', "ADMIN", "STAFF_PAY", "STAFF"].map(async (GroupName) => {
    const { Users } = await client.send(new ListUsersInGroupCommand({
      GroupName: GroupName,
      UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
      Limit: 5,
    }));

    Users?.forEach((user) => {
      // console.log('USER', user);
      if (user.Username) {
        if (!result[user.Username]) {
          result[user.Username] = [];
        }
        result[user.Username].push(GroupName);
      }
    });
  });

  await Promise.all(groupPromises);

  return result;
};