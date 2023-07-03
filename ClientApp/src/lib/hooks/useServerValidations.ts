import { FormInstance } from "antd";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ValidationResponse } from "../../types/responses/errors/ValidationResponse";

export function useServerValidations(form: FormInstance): [(e:any) => void, (values: any) => void] {
    const [validationErrors, setValidationErrors] = useState(new Map<string, string>());

    const handleValidationErrors = (e: any) => {
        try {
            const error = (e as AxiosError).response?.data! as ValidationResponse;
            var newValidationErrors: Map<string, string> = new Map<string, string>();
            error.errors.forEach((error) => {
                newValidationErrors.set(error.fieldName, error.message);
            });
            setValidationErrors(newValidationErrors);
        } catch (e) {
            throw e;
        }
    }

    const onValuesChange = (values: any) => {
        const updatedFields = Object.keys(values)
            .filter(name => form.getFieldError(name).length)
            .map(name => ({ name, errors: [] }));
        form.setFields(updatedFields);
        setValidationErrors(new Map());
    };

    useEffect(() => {
        Array.from(validationErrors.keys()).map((error) => {
            const fieldName = error === "E-mail" ? "email" : error.toLowerCase();
            const validationError = fieldName === "username" ? `Korisničko ime ${validationErrors.get(error) as string}` : `${validationErrors.get(error) as string}`
            return form.setFields([
                {
                    name: fieldName,
                    errors: [validationError]
                },
            ]);
        });
    }, [form, validationErrors]);

    return [handleValidationErrors, onValuesChange];
}
