// data.js

export const users = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Admin",
    status: "active"
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "User",
    status: "inactive"
  }
];

export const appConfig = {
  appName: "My Dynamic App",
  version: "1.0.0",
  maxUploadSizeMb: 10,
  theme: "dark"
};

// Helper function example
export const getUserById = (id) => users.find((user) => user.id === id);
