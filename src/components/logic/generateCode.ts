import type { FormDataItem, GlobalState } from "little-state-machine"

function generateField({
  type,
  name,
  required,
  max,
  min,
  maxLength,
  minLength,
  pattern,
  options,
}: FormDataItem) {
  const rules = required ? ["required: true"] : []

  for (const [rule, value] of Object.entries({
    max,
    min,
    minLength,
    maxLength,
  })) {
    // Empty controls are absent rules; zero is still a valid limit.
    if (value != null && value !== "" && Number.isFinite(Number(value))) {
      rules.push(`${rule}: ${Number(value)}`)
    }
  }

  if (pattern) {
    rules.push(`pattern: new RegExp(${JSON.stringify(pattern)}, "i")`)
  }

  const register = `{...register(${JSON.stringify(name)}${
    rules.length ? `, { ${rules.join(", ")} }` : ""
  })}`
  const values = (options || "").split(";").filter(Boolean)

  if (type === "select") {
    return `      <select ${register}>\n${values
      .map((option) => {
        const value = JSON.stringify(option)
        return `        <option value={${value}}>{${value}}</option>\n`
      })
      .join("")}      </select>\n`
  }

  if (type === "radio") {
    return values
      .map(
        (option) =>
          `      <input ${register} type="radio" value={${JSON.stringify(option)}} />\n`
      )
      .join("")
  }

  if (type === "textarea") {
    return `      <textarea ${register} />\n`
  }

  return `      <input type={${JSON.stringify(type)}} placeholder={${JSON.stringify(name)}} ${register} />\n`
}

export default (formData: GlobalState["formData"]) => {
  return `import React from 'react';
import { useForm } from 'react-hook-form';

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
${Array.isArray(formData) ? formData.map(generateField).join("") : ""}
      <input type="submit" />
    </form>
  );
}`
}
