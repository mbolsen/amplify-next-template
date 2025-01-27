import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { changeUserGroup } from "../functions/auth/changeUserGroup/resource";
import { userGroups } from "../functions/auth/userGroups/resource";
import { GROUPS } from "../auth/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      key: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  changeUserGroup: a
    .mutation()
    .arguments({
      groupName: a.string(),
      userName: a.string(),
      action: a.string(),
      orgGroup: a.string(),
      userNameOfRequester: a.string()
    })
    .authorization((allow) => [allow.groups([GROUPS.everyone])]) // this will be admin, but need to also add the org group they are a part of, which might have to be at the api level.
    .returns(a.string())
    .handler(a.handler.function(changeUserGroup)),
  userGroups: a
    .mutation()
    .arguments({ name: a.string() })
    .authorization((allow) => [allow.groups([GROUPS.admin])])
    .returns(a.json())
    .handler(a.handler.function(userGroups))
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
