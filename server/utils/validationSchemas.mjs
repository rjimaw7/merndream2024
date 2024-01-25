export const createDreamsValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Title must be 32 characters or less.",
    },
    notEmpty: {
      errorMessage: "Title cannot be empty",
    },
  },
  date: {
    notEmpty: {
      errorMessage: "Date cannot be empty",
    },
  },
  dream: {
    notEmpty: {
      errorMessage: "Dream cannot be empty",
    },
  },
};
