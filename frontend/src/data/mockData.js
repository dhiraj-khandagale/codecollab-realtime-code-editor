export const MOCK_USER = {
  id: 1,
  name: "Yash Kumar",
  email: "yash@example.com",
  avatar: "YK",
}

export const MOCK_PROJECTS = [
  {
    id: "proj-1",
    name: "my-react-app",
    description: "A React frontend project",
    language: "javascript",
    members: [
      { id: 1, name: "Yash Kumar", avatar: "YK", role: "owner" },
      { id: 2, name: "Arjun Shah",  avatar: "AS", role: "editor" },
    ],
    updatedAt: "2025-04-06",
    files: [
      {
        id: "f1", name: "src", type: "folder", children: [
          { id: "f2", name: "App.jsx",   type: "file", language: "javascript",
            content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="app">\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;` },
          { id: "f3", name: "index.css", type: "file", language: "css",
            content: `body {\n  margin: 0;\n  font-family: sans-serif;\n  background: #fff;\n}` },
          { id: "f4", name: "utils.js",  type: "file", language: "javascript",
            content: `export const formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n};\n\nexport const capitalize = (str) => {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n};` },
        ]
      },
      { id: "f5", name: "package.json", type: "file", language: "json",
        content: `{\n  "name": "my-react-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}` },
    ]
  },
  {
    id: "proj-2",
    name: "python-api",
    description: "REST API built with Python Flask",
    language: "python",
    members: [
      { id: 1, name: "Yash Kumar", avatar: "YK", role: "owner" },
    ],
    updatedAt: "2025-04-04",
    files: [
      { id: "f10", name: "app.py", type: "file", language: "python",
        content: `from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route('/api/hello')\ndef hello():\n    return jsonify({'message': 'Hello World'})\n\nif __name__ == '__main__':\n    app.run(debug=True)` },
      { id: "f11", name: "requirements.txt", type: "file", language: "plaintext",
        content: `flask==2.3.0\nrequests==2.28.0` },
    ]
  },
  {
    id: "proj-3",
    name: "java-spring-boot",
    description: "Backend API with Spring Boot",
    language: "java",
    members: [
      { id: 1, name: "Yash Kumar", avatar: "YK", role: "owner" },
      { id: 3, name: "Priya Mehta", avatar: "PM", role: "viewer" },
    ],
    updatedAt: "2025-04-01",
    files: [
      { id: "f20", name: "Main.java", type: "file", language: "java",
        content: `package com.example;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class Main {\n    public static void main(String[] args) {\n        SpringApplication.run(Main.class, args);\n    }\n}` },
    ]
  },
]