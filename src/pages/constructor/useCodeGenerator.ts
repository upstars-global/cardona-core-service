import type { ParsedField } from './types'

export function generateCode(parsedFields: ParsedField[], className: string): string {
  const constructorLines = parsedFields.map(field => {
    if (field.className === 'raw')
      return `    ${field.args.raw}`

    const args = Object.entries(field.args)
      .map(([k, v]) => `      ${k}: ${v},`)
      .join('\n')

    return `    this.${field.name} = new ${field.className}({\n${args}\n    })`
  })

  return `
export class ${className} {
${parsedFields.map(f =>
    `  readonly ${f.name}: ${f.className === 'raw' ? f.rawType : f.className}`,
  ).join('\n')}

  constructor(data: I${className}) {
${constructorLines.join('\n')}
  }
}`.trim()
}
