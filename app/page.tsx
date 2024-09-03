"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { StorageImage, StorageManager } from "@aws-amplify/ui-react-storage";
import { Card, Flex, Text, Button } from "@aws-amplify/ui-react";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  
  function createTodo({ key, content }: { key: string;  content: string }) {
    client.models.Todo.create({
      content,
      key,
    });
  }
      
  useEffect(() => {
    listTodos();
  }, []);

  return (
    <main>
      <h1>My todos</h1>
      {/* <button onClick={createTodo}>+ new</button> */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            <Flex justifyContent="space-between">
              <Text>{todo.content}</Text>
              {todo.key ? (
                <StorageImage
                  path={todo.key}
                  alt={todo.content || ""}
                  width="100px"
                />
              ) : null }
            </Flex>
          </li>
        ))}
      </ul>
      <StorageManager
        path={"medio/"}
        acceptedFileTypes={["image/*"]}
        maxFileCount={1}
        onUploadStart={({ key }) => {
          const content = window.prompt("Todos content");
          if (!key || !content) return;
          createTodo({key, content})
        }}
        components={{
          Container({ children }) {
            return <Card variation="elevated">{children}</Card>
          },
          FilePicker({ onClick }) {
            return (
              <Button variation="primary" onClick={onClick}>
                Add Todo and Choose File For Upload
              </Button>
            )
          }
        }}
      />
      {/* <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div> */}
    </main>
  );
}
