export const UserForReviews = {
    UserForReviews: {
      type: "object",
      required: ["userName", "avatarURL"],
      properties: {
        _id: {
          type: "string",
          description: "Backend-generated unique identifier.",
          example: "63fa1eb8ed1b46fa6fd8e857",
        },
        userName: {
          type: "string",
          description: "User's name",
          example: "Steve Jobs",
        },
        avatarURL: {
          type: "string",
          description: "User's avatar URL",
          example: "https://s.gravatar.com/avatar/2a745bb2c0f4cbe6102562e535b00508",
        },
      },
    }
  };