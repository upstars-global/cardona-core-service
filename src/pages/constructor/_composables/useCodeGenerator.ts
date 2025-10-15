import type { ParsedField } from '../types'

/**
 * Generates a full TypeScript class as a string based on parsed fields.
 * Example output:
 * export class MyForm {
 *   readonly name: TextBaseField
 *
 *   constructor(data: IMyForm) {
 *     this.name = new TextBaseField({ ... })
 *   }
 * }
 */
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

/**
 * Generates the list of class field declarations, e.g.:
 *   readonly name: TextBaseField
 *   readonly age: raw
 */
function generateClassFields(fields: ParsedField[]): string {
  return fields.map(f =>
    `  readonly ${f.name}: ${f.className === 'raw' ? f.rawType : f.className}`,
  ).join('\n')
}

/**
 * Generates all constructor lines (calls to new FieldType or raw assignment).
 */
function generateConstructor(fields: ParsedField[]): string {
  return fields.map(generateConstructorLine).join('\n')
}

/**
 * Generates one line (or block) inside the constructor for each field.
 * Handles both raw assignments and base field instantiations.
 */
function generateConstructorLine(field: ParsedField): string {
  if (field.className === 'raw') {
    // e.g. if (data?.id) this.id = data.id
    return `    ${field.args.raw}`
  }

  // Convert args object to formatted argument lines:
  const args = Object.entries(field.args)
    .map(([k, v]) => `      ${k}: ${v},`)
    .join('\n')

  // e.g.
  // this.name = new TextBaseField({
  //   key: 'name',
  //   value: data?.name,
  //   label: i18n.t('...')
  // })
  return `    this.${field.name} = new ${field.className}({\n${args}\n    })`
}
