import type { ParsedField } from '../types'

export function generateCode(parsedFields: ParsedField[], className: string): string {
  const fieldsCode = generateClassFields(parsedFields)
  const constructorCode = generateConstructor(parsedFields)

  return `
export class ${className} {
${fieldsCode}

  constructor(data: I${className}) {
${constructorCode}
  }
}`.trim()
}

function generateClassFields(fields: ParsedField[]): string {
  return fields.map(f =>
    `  readonly ${f.name}: ${f.className === 'raw' ? f.rawType : f.className}`,
  ).join('\n')
}

function generateConstructor(fields: ParsedField[]): string {
  return fields.map(generateConstructorLine).join('\n')
}

function generateConstructorLine(field: ParsedField): string {
  if (field.className === 'raw')
    return `    ${field.args.raw}`

  const args = Object.entries(field.args)
    .map(([k, v]) => `      ${k}: ${v},`)
    .join('\n')

  return `    this.${field.name} = new ${field.className}({\n${args}\n    })`
}
