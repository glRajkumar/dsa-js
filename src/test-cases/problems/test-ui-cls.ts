
export const metadata: jsonMetaDataT = {
  testCases: [],
  meta: {
    hashFn: {
      type: "function",
      name: "hashFn",
      description: "Generate a hash value for a string based on table size.",
      params: [
        {
          name: "str",
          type: "string",
          defaultValue: "",
          description: "Input string to hash.",
        },
        {
          name: "tableSize",
          type: "number",
          defaultValue: 7,
          description: "Size of the hash table.",
        },
      ],
    },
    HashTable: {
      type: "class",
      name: "HashTable",
      description: "A hash table implementation using separate chaining (Map).",
      construct: [
        {
          name: "size",
          type: "number",
          defaultValue: 7,
        },
      ],
      methods: [
        {
          type: "function",
          name: "add",
          description: "Add a key-value pair to the hash table.",
          params: [
            { name: "key", type: "string", defaultValue: "key" },
            { name: "data", type: "string", defaultValue: "value" },
          ],
        },
        {
          type: "function",
          name: "remove",
          description: "Remove a key from the table.",
          params: [{ name: "key", type: "string", defaultValue: "key1" }],
        },
        {
          type: "function",
          name: "find",
          description: "Find a value by key.",
          params: [{ name: "key", type: "string", defaultValue: "key1" }],
        },
        {
          type: "function",
          name: "isEmpty",
          description: "Check whether table is empty.",
        },
        {
          type: "function",
          name: "getData",
          description: "Return raw table structure (array of Maps).",
        },
        {
          type: "function",
          name: "getLength",
          description: "Return number of stored entries.",
        },
      ],
    },
    MathTools: {
      type: "class",
      name: "MathTools",
      description: "Utility class providing simple math operations.",
      methods: [
        {
          type: "function",
          name: "multiply",
          description: "Multiply two numbers.",
          params: [
            { name: "a", type: "number", defaultValue: 2 },
            { name: "b", type: "number", defaultValue: 3 },
          ],
        },
        {
          type: "function",
          name: "delayedMultiply",
          description: "Multiply two numbers but return result after delay.",
          params: [
            { name: "a", type: "number", defaultValue: 2 },
            { name: "b", type: "number", defaultValue: 3 },
          ],
        },
      ],
    },
    UserProfile: {
      type: "class",
      name: "UserProfile",
      description: "Represents a user profile with authentication logic.",
      construct: [
        {
          name: "name",
          type: "string",
          defaultValue: "John Doe",
          description: "User's display name.",
        },
        {
          name: "age",
          type: "number",
          defaultValue: 25,
          description: "User's age.",
        },
        {
          name: "id",
          type: "string",
          defaultValue: "UID123",
          description: "Unique identifier for user.",
        },
        {
          name: "password",
          type: "string",
          defaultValue: "password123",
          description: "Private login password.",
        },
      ],
      methods: [
        {
          type: "function",
          name: "updateAge",
          description: "Update user's age.",
          params: [{ name: "newAge", type: "number", defaultValue: 30 }],
        },
        {
          type: "function",
          name: "authenticate",
          description: "Validate the user's password and track login attempts.",
          params: [{ name: "pass", type: "string", defaultValue: "password123" }],
        },
        {
          type: "function",
          name: "getProfile",
          description: "Get public profile information.",
        },
      ],
    },
    DataStore: {
      type: "class",
      name: "DataStore",
      methods: [
        {
          type: "function",
          name: "getName",
          description: "Get the name string",
        },
        {
          type: "function",
          name: "getAge",
          description: "Get the age number",
        },
        {
          type: "function",
          name: "getIsActive",
          description: "Get the active status boolean",
        },
        {
          type: "function",
          name: "getTags",
          description: "Get a copy of the tags Set",
        },
        {
          type: "function",
          name: "getScores",
          description: "Get a copy of the scores Map",
        },
        {
          type: "function",
          name: "getScore",
          description: "Get a specific subject score from the Map",
          params: [
            {
              name: "subject",
              type: "string",
              description: "The subject name to get the score for"
            }
          ],
        },
        {
          type: "function",
          name: "getHobbies",
          description: "Get a copy of the hobbies array",
        },
        {
          type: "function",
          name: "getProfile",
          description: "Get a copy of the profile object",
        },
        {
          type: "function",
          name: "getUsers",
          description: "Get a deep copy of the users array with nested structures",
        },
        {
          type: "function",
          name: "getUserById",
          description: "Get a specific user by their ID",
          params: [
            {
              name: "id",
              type: "number",
              description: "The user ID to search for",
              constraints: {
                min: 1
              }
            }
          ],
        },
        {
          type: "function",
          name: "getProductsByCategory",
          description: "Get all products in a specific category",
          params: [
            {
              name: "category",
              type: "string",
              description: "The category name to get products for"
            }
          ],
        },
        {
          type: "function",
          name: "getCategoryTags",
          description: "Get tags for a specific category",
          params: [
            {
              name: "category",
              type: "string",
              description: "The category name to get tags for"
            }
          ],
        },
        {
          type: "function",
          name: "getNestedArray",
          description: "Get a copy of the nested array containing items and metadata",
        },
        {
          type: "function",
          name: "updateName",
          description: "Update the name string",
          params: [
            {
              name: "name",
              type: "string",
              description: "The new name to set",
              constraints: {
                minLength: 1,
                maxLength: 100
              }
            }
          ],
        },
        {
          type: "function",
          name: "updateAge",
          description: "Update the age number",
          params: [
            {
              name: "age",
              type: "number",
              description: "The new age to set",
              constraints: {
                min: 0,
                max: 150
              }
            }
          ],
        },
        {
          type: "function",
          name: "updateIsActive",
          description: "Update the active status boolean",
          params: [
            {
              name: "isActive",
              type: "boolean",
              description: "The new active status"
            }
          ],
        },
        {
          type: "function",
          name: "addTag",
          description: "Add a tag to the Set",
          params: [
            {
              name: "tag",
              type: "string",
              description: "The tag to add to the set"
            }
          ],
        },
        {
          type: "function",
          name: "removeTag",
          description: "Remove a tag from the Set",
          params: [
            {
              name: "tag",
              type: "string",
              description: "The tag to remove from the set"
            }
          ],
        },
        {
          type: "function",
          name: "updateScore",
          description: "Update or add a score in the Map",
          params: [
            {
              name: "subject",
              type: "string",
              description: "The subject name"
            },
            {
              name: "score",
              type: "number",
              description: "The score value",
              constraints: {
                min: 0,
                max: 100
              }
            }
          ],
        },
        {
          type: "function",
          name: "deleteScore",
          description: "Delete a score from the Map",
          params: [
            {
              name: "subject",
              type: "string",
              description: "The subject name to delete"
            }
          ],
        },
        {
          type: "function",
          name: "addHobby",
          description: "Add a hobby to the array",
          params: [
            {
              name: "hobby",
              type: "string",
              description: "The hobby to add to the array"
            }
          ],
        },
        {
          type: "function",
          name: "removeHobby",
          description: "Remove a hobby from the array",
          params: [
            {
              name: "hobby",
              type: "string",
              description: "The hobby to remove from the array"
            }
          ],
        },
        {
          type: "function",
          name: "updateProfile",
          description: "Update the profile object properties",
          params: [
            {
              name: "username",
              type: "string",
              description: "The new username"
            },
            {
              name: "bio",
              type: "string",
              description: "The new bio"
            }
          ],
        },
        {
          type: "function",
          name: "addUser",
          description: "Add a new user to the users array with nested address array and metadata Map",
          params: [
            {
              name: "user",
              type: "object",
              description: "The user object with id, name, email, addresses array, and metadata Map",
              constraints: {
                by: {
                  id: { type: "number", constraints: { min: 1 } },
                  name: { type: "string", constraints: { minLength: 1 } },
                  email: { type: "string", constraints: { pattern: "^[^@]+@[^@]+\\.[^@]+$" } },
                  addresses: { type: "array" },
                  metadata: { type: "object" }
                }
              }
            }
          ],
        },
        {
          type: "function",
          name: "updateUserEmail",
          description: "Update a user's email by their ID",
          params: [
            {
              name: "userId",
              type: "number",
              description: "The user ID",
              constraints: {
                min: 1
              }
            },
            {
              name: "newEmail",
              type: "string",
              description: "The new email address",
              constraints: {
                pattern: "^[^@]+@[^@]+\\.[^@]+$"
              }
            }
          ],
        },
        {
          type: "function",
          name: "addAddressToUser",
          description: "Add an address to a user's addresses array",
          params: [
            {
              name: "userId",
              type: "number",
              description: "The user ID",
              constraints: {
                min: 1
              }
            },
            {
              name: "address",
              type: "object",
              description: "The address object with street, city, and zipCode",
              constraints: {
                by: {
                  street: { type: "string", constraints: { minLength: 1 } },
                  city: { type: "string", constraints: { minLength: 1 } },
                  zipCode: { type: "number", constraints: { min: 0 } }
                }
              }
            }
          ],
        },
        {
          type: "function",
          name: "updateUserMetadata",
          description: "Update a key-value pair in a user's metadata Map",
          params: [
            {
              name: "userId",
              type: "number",
              description: "The user ID",
              constraints: {
                min: 1
              }
            },
            {
              name: "key",
              type: "string",
              description: "The metadata key"
            },
            {
              name: "value",
              description: "The metadata value (can be any type)"
            }
          ],
        },
        {
          type: "function",
          name: "addProductToCategory",
          description: "Add a product to a category in the Map of arrays",
          params: [
            {
              name: "category",
              type: "string",
              description: "The category name"
            },
            {
              name: "product",
              type: "object",
              description: "The product object with id, name, price, and tags Set",
              constraints: {
                by: {
                  id: { type: "number", constraints: { min: 1 } },
                  name: { type: "string", constraints: { minLength: 1 } },
                  price: { type: "number", constraints: { min: 0 } },
                  tags: { type: "object" }
                }
              }
            }
          ],
        },
        {
          type: "function",
          name: "addTagToProduct",
          description: "Add a tag to a product's tags Set",
          params: [
            {
              name: "category",
              type: "string",
              description: "The category name"
            },
            {
              name: "productId",
              type: "number",
              description: "The product ID",
              constraints: {
                min: 1
              }
            },
            {
              name: "tag",
              type: "string",
              description: "The tag to add to the product's tags Set"
            }
          ],
        },
        {
          type: "function",
          name: "addCategoryTag",
          description: "Add a tag to a category's tags Set in the Map",
          params: [
            {
              name: "category",
              type: "string",
              description: "The category name"
            },
            {
              name: "tag",
              type: "string",
              description: "The tag to add to the category"
            }
          ],
        },
        {
          type: "function",
          name: "addNestedItem",
          description: "Add a new item to the nested array containing items array and metadata Map",
          params: [
            {
              name: "items",
              type: "array",
              description: "The array of numbers",
              constraints: {
                template: { type: "number" }
              }
            },
            {
              name: "metadata",
              type: "object",
              description: "The metadata Map with string key-value pairs"
            }
          ],
        },
        {
          type: "function",
          name: "updateNestedItemMetadata",
          description: "Update a metadata key in a nested array item's Map",
          params: [
            {
              name: "index",
              type: "number",
              description: "The index of the nested item",
              constraints: {
                min: 0
              }
            },
            {
              name: "key",
              type: "string",
              description: "The metadata key to update"
            },
            {
              name: "value",
              type: "string",
              description: "The new metadata value"
            }
          ],
        },
        {
          type: "function",
          name: "displayAll",
          description: "Display all data in the store to console for debugging",
        }
      ]
    }
  }
}