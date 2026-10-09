import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import vm from "node:vm"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { useForm } from "react-hook-form"
import { test } from "vitest"
import ts from "typescript"

const sourceRoot = process.env.BUILDER_SOURCE_ROOT || process.cwd()

function compile(source, fileName, dependencies = {}) {
  const result = ts.transpileModule(source, {
    fileName,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  })
  assert.deepEqual(
    (result.diagnostics || []).map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
    ),
    [],
    `Generated source must parse: ${source}`
  )
  const exports = {}
  const evaluate = vm.runInThisContext(
    `(function(exports, require, console) {\n${result.outputText}\n})`
  )
  evaluate(
    exports,
    (name) => {
      assert.ok(name in dependencies, `Unexpected import: ${name}`)
      return dependencies[name]
    },
    { log() {} }
  )
  return exports.default
}

const generateCode = compile(
  fs.readFileSync(
    path.join(sourceRoot, "src/components/logic/generateCode.ts"),
    "utf8"
  ),
  "generateCode.ts"
)

const field = (overrides = {}) => ({
  name: "example",
  type: "text",
  required: false,
  min: "",
  max: "",
  minLength: "",
  maxLength: "",
  pattern: "",
  ...overrides,
})

function renderForm(fields) {
  let form
  const registrations = []
  const App = compile(generateCode(fields), "generated.tsx", {
    react: React,
    "react-hook-form": {
      useForm() {
        form = useForm()
        return {
          ...form,
          register(name, options) {
            registrations.push({ name, options })
            return form.register(name, options)
          },
        }
      },
    },
  })
  const html = renderToStaticMarkup(React.createElement(App))
  return { form, registrations, html }
}

for (const type of [
  "text",
  "number",
  "checkbox",
  "textarea",
  "select",
  "radio",
]) {
  test(`${type} without validation registers its field name`, async () => {
    const { form, registrations } = renderForm([
      field({ type, options: "Yes;No" }),
    ])
    assert.equal(registrations.length, type === "radio" ? 2 : 1)
    assert.ok(registrations.every(({ name }) => name === "example"))
    form.setValue("example", "Yes")
    let submitted
    await form.handleSubmit((data) => {
      submitted = data
    })()
    assert.equal(submitted.example, "Yes")
  })
}

for (const [rule, limit, invalid, valid] of [
  ["required", true, "", "present"],
  ["min", "2", "1", "2"],
  ["max", "2", "3", "2"],
  ["minLength", "2", "a", "ab"],
  ["maxLength", "2", "abc", "ab"],
  ["pattern", "^ab$", "ac", "AB"],
]) {
  test(`${rule} alone produces working validation`, async () => {
    const { form, registrations } = renderForm([field({ [rule]: limit })])
    assert.equal(registrations.length, 1)
    form.setValue("example", invalid)
    assert.equal(await form.trigger(), false)
    assert.equal(form.getFieldState("example").error.type, rule)
    form.setValue("example", valid)
    assert.equal(await form.trigger(), true)
  })
}

test("combined rules preserve zero and numeric strings with leading zeroes", () => {
  const { registrations } = renderForm([
    field({
      required: true,
      min: "0",
      max: "08",
      minLength: "0",
      maxLength: "08",
    }),
  ])
  assert.deepEqual(JSON.parse(JSON.stringify(registrations[0].options)), {
    required: true,
    max: 8,
    min: 0,
    minLength: 0,
    maxLength: 8,
  })
})

test("names and placeholders preserve quotes, backslashes and JSX characters", () => {
  const name = 'a"\\\n<&{value}'
  const { registrations, html } = renderForm([field({ name })])
  assert.equal(registrations[0].name, name)
  assert.ok(html.includes("&quot;"))
  assert.ok(html.includes("&lt;&amp;{value}"))
})

for (const type of ["select", "radio"]) {
  test(`${type} preserves option text without interpreting JSX or entities`, () => {
    const option = '"\\<&{value}\n'
    const { html } = renderForm([
      field({ type, options: `;${option};;plain;` }),
    ])
    assert.ok(html.includes("&quot;\\&lt;&amp;{value}\n"))
    assert.equal(
      (html.match(type === "select" ? /<option /g : /type="radio"/g) || [])
        .length,
      2
    )
  })
}

test("regex source preserves slash, backslash, quotes and newlines", async () => {
  const pattern = '^a/"\\\\\nb$'
  const { form, registrations } = renderForm([field({ pattern })])
  assert.equal(
    registrations[0].options.pattern.source,
    new RegExp(pattern, "i").source
  )
  form.setValue("example", 'a/"\\\nb')
  assert.equal(await form.trigger(), true)
  form.setValue("example", "wrong")
  assert.equal(await form.trigger(), false)
})

test("numeric validation values cannot inject code", () => {
  const { registrations } = renderForm([
    field({ min: "1, validate: () => true", maxLength: "Infinity" }),
  ])
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].options, undefined)
})

for (const type of ["textarea", "select", "radio"]) {
  test(`${type} receives the same configured validation rules`, async () => {
    const { form, registrations } = renderForm([
      field({ type, options: "a;abc", minLength: "2" }),
    ])
    assert.ok(registrations.every(({ options }) => options.minLength === 2))
    form.setValue("example", "a")
    assert.equal(await form.trigger(), false)
    form.setValue("example", "abc")
    assert.equal(await form.trigger(), true)
  })
}

test("field types are serialized as data", () => {
  const { html, registrations } = renderForm([
    field({ type: 'text" /><script>{alert(1)}</script><input type="text' }),
  ])
  assert.equal(registrations.length, 1)
  assert.ok(!html.includes("<script>"))
  assert.ok(html.includes("&lt;script&gt;"))
})

test("empty forms still produce a valid form", () => {
  const { registrations, html } = renderForm([])
  assert.equal(registrations.length, 0)
  assert.ok(html.includes('type="submit"'))
})
