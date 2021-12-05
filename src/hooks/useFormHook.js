import { useCallback } from "react";
import { useForm } from "react-hook-form";

export const useYupValidationResolver = (validationSchema) =>
  useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

export const useFormHook = (validationSchema, mode = "onBlur") => {
  const resolver = useYupValidationResolver(validationSchema);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    ...rest
  } = useForm({
    mode,
    resolver,
  });

  return {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    ...rest,
  };
};
