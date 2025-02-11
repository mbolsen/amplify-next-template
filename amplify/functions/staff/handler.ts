// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

// const dynamoClient = new DynamoDBClient();

// export const handler: APIGatewayProxyHandler = async (event) => {
//   const body = JSON.parse(event.body || '{}');
//   const { userName, name, email, orgGroup } = body;

//   // if (!userName || !name || !email || !orgGroup) {
//   //   return {
//   //     statusCode: 400,
//   //     body: JSON.stringify({ message: 'Missing required fields' }),
//   //   };
//   // }

//   // const putItemCommand = new PutItemCommand({
//   //   TableName: process.env.STAFF_TABLE_NAME!,
//   //   Item: {
//   //     pk: { S: `USER#${userName}` },
//   //     sk: { S: `PROFILE#${userName}` },
//   //     name: { S: name },
//   //     email: { S: email },
//   //     orgGroup: { S: orgGroup },
//   //   },
//   // });
//   const putItemCommand = new PutItemCommand({
//     TableName: process.env.STAFF_TABLE_NAME!,
//     Item: {
//       pk: { S: `USER#testuser` },
//       sk: { S: `PROFILE#testuser` },
//       name: { S: 'name' },
//       email: { S: 'email' },
//       orgGroup: { S: 'orgGroup' },
//     },
//   });

//   try {
//     await dynamoClient.send(putItemCommand);
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'Staff added successfully' }),
//     };
//   } catch (error) {
//     console.error('Error adding staff:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal server error' }),
//     };
//   }
// };

import type { Handler } from 'aws-lambda';
// import type { Schema } from '../../data/resource';
// import { Amplify } from 'aws-amplify';
// import { generateClient } from 'aws-amplify/data';

import type { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
Amplify.configure(outputs);
const client = generateClient<Schema>();
// import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/addStaff'; // replace with your function name

// const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

// Amplify.configure(resourceConfig, libraryOptions);

// const client = generateClient<Schema>();

export const handler = async () => {
  // your function code goes here

  console.log('-------- Adding staff...');
  try {
    const result = await client.models.Staff.create({
      name: 'testuser',
      email: 'fakeemail@m.com',
      orgGroup: 'testOrg',
      profileOwner: 'testuser',
    })
    console.log('Result:', result);
  } catch (error) {
    console.error('Error adding staff:', error);
    return 'Error adding staff';
  }

  return 'Staff added successfully';
}
