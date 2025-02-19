'use client'

import { Button, FormControl, FormHelperText, Grid2 as Grid, Input, InputLabel, keyframes } from "@mui/material"
import { Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import './page.css'
import React from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

// import { GROUPS } from "@/amplify/auth/resource";
const GROUPS = [
  { name: "EVERYONE", displayName: "Everyone" },
  { name: "STAFF", displayName: "Staff" },
  { name: "STAFF_PAY", displayName: "Staff Pay" },
  { name: "ADMIN", displayName: "Admin" }
]
Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function Page() {
  const [userGroupList, setUserGroupList] = React.useState<any>([])
  const [email, setEmail] = React.useState<string>('');
  const [emailError, setEmailError] = React.useState<string>('');

  const handleInviteNewUser = () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }
    setEmailError('');
    console.log('Inviting user with email:', email);
    // Add your invite logic here
    client.mutations.inviteNewUser({ email }, { authMode: "userPool" })
      .then((result) => {
        console.log('Invite result:', result);
        // Handle success or error
      })
      .catch((error) => {
        console.error('Error inviting user:', error);
        // Handle error
      });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClick = () => {
    console.log('click')
    client.mutations.addStaff({}, { authMode: "userPool" })
  }

  async function handleGetUserGroups() {
    const { data } = await client.mutations.userGroups({}, { authMode: "userPool" })
    const result = JSON.parse(data as string)
    const resultGroupList = Object.entries(result).map(([key, value]) => {
      const user = value as { email: string, groups: string[], status: string };
      return { id: key, email: user.email, groups: user.groups, status: user.status };
    });
    setUserGroupList(resultGroupList)
  }

  const handleCheckboxChange = (userId: string, groupName: string, checked: boolean) => {
    
    client.mutations.changeUserGroup({ userName: userId, groupName, action: checked ? 'add' : 'remove' }, { authMode: "userPool" })
      .then((result: any) => {
        console.log('Group change result:', result);
        // Update the userGroupList state to reflect the change
        setUserGroupList((prevList: any) => prevList.map((user: any) => {
          if (user.id === userId) {
            const newGroups = checked
              ? [...user.groups, groupName]
              : user.groups.filter((group: string) => group !== groupName);
            return { ...user, groups: newGroups };
          }
          return user;
        }));
      })
      .catch((error: any) => {
        console.error('Error changing group:', error);
      });
  };

  React.useEffect(() => {
    handleGetUserGroups()
  },[])

  return (
    <div className="wrapper">
      <h1>Admin Set User Permissions Page</h1>
      <p>TODO: This page will list all the users.  Show their name and checkboxes for which user groups they belong to.  When they click on a checkbox it will be a different color from the default checkbox color.  When a person clicks 'save' it will go to the api and all the users to particular groups, returning the changes, then the check boxes turn to the default color.  Success or fail alert at the top of page too.</p>
      <hr />
      <h2>Invite a new user</h2>
      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
          type="email"
          placeholder="Enter email address"
          error={email !== '' && !!emailError}
        />
        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
        <Button variant="contained" color="primary" onClick={handleInviteNewUser}>
          Invite
        </Button>
      </FormControl>
      <UserPermissionTable userGroupList={userGroupList} handleCheckboxChange={handleCheckboxChange} />

      {/* <Button onClick={handleClick}>Test add to DB</Button> */}
    </div>
  )
}
 
export function UserPermissionTable(
  { userGroupList, handleCheckboxChange }:
  { userGroupList: any[], handleCheckboxChange: (userId: string, groupName: string, checked: boolean) => void }
  ): JSX.Element {
    return (
      <Box sx={{ flexGrow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              {GROUPS.map((group) => (
                <TableCell key={group.displayName}>{group.displayName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userGroupList.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                {GROUPS.map((group) => (
                  <TableCell key={group.displayName}>
                    <Checkbox
                      checked={user.groups.includes(group.name)}
                      onChange={(e) => handleCheckboxChange(user.id, group.name, e.target.checked)}
                      sx={{
                        color: user.groups.includes(group) ? 'default' : 'default',
                        '&.Mui-checked': {
                          color: 'default',
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  };