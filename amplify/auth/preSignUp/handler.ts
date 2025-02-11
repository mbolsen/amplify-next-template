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

const cognitoClient = new CognitoIdentityProviderClient();
const dynamoClient = new DynamoDBClient();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  // Check to see if the user is in the list of approved users
  const { userName } = event.request.userAttributes;
  const { data } = await client.models.Staff.get({ id: userName });
  if (!data) {
    throw new Error("User is not approved");
  }
};
