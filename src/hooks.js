import { useState } from "react";
import axios from "./axios";

export function useAuthSubmit(path, fields) {
    const [error, setError] = useState(error);

    function submit() {
        axios
            .post(path, fields)
            .then(({ data }) =>
                data.success ? location.replace("/") : setError(true)
            );
    }
    return [error, submit];
}

export function useStatefulFields() {
    const [fields, setFields] = useState({});
    function handleChange({ target }) {
        useStatefulFields({
            ...useStatefulFields,
            [target.name]: target.value,
        });
    }

    return [fields, handleChange];
}
