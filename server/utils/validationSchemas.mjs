export const createDreamsValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
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
