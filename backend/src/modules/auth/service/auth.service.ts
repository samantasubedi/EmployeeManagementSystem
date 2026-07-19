export const authService = {
  login: ({ email, username }: { email: string; username: string }) => {
    return {
      message: "this is login service",
      data: {
        message: "this is the data extracted from the user request",
        email: email,
        username: username,
      },
    };
  },
  register: ({ email, username }: { email: string, username: string }) => {
    
    return {
      message: "this is register service",
      data: {
        message: "this is the data extracted from the user request",
        email: email,
        username: username,
      },
    };
  },
};
