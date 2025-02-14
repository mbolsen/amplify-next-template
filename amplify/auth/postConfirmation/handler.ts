// import { Amplify } from "aws-amplify";
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { type Schema } from "../../data/resource";

// import type { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
Amplify.configure(outputs);
const client = generateClient<Schema>();
// import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';  // Why is this giving me an import error?
// ^ Maybe I don't need this?

import { env } from '$amplify/env/post-confirmation';
// import { profile } from "console";

// import { type Schema } from "../../data/resource";
// import { generateClient } from "aws-amplify/data";

// const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
//   env
// );

// Amplify.configure(resourceConfig, libraryOptions);
// Amplify.configure(env);

// const client = generateClient<Schema>();

const cognitoClient = new CognitoIdentityProviderClient();
const dynamoClient = new DynamoDBClient();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  // Add user to Cognito group
  const addUserToGroupCommand = new AdminAddUserToGroupCommand({
    GroupName: env.GROUP_NAME,
    Username: event.userName,
    UserPoolId: event.userPoolId,
  });
  await cognitoClient.send(addUserToGroupCommand);

  console.log('-------- Adding staff...', event);
  try {
    const result = await client.models.Staff.create({
      name: event.userName,
      email: event.userName,
      orgGroup: env.GROUP_NAME,
      profileOwner: 'testuser',
    })
    console.log('Result:', result);
  } catch (error) {
    console.error('Error adding staff:', error);
    return 'Error adding staff';
  }

  return event;
};
