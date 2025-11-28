import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as recast from 'recast'
import { createField } from '../fieldFactory'
import { applyConfigOptions } from '../_composables/useFields'
import type { BaseFieldConfig } from '../types'
import textConfig from '../fieldConfigs/text.config'
import type { ConstructorFieldType } from '../constants'

// Optional return configuration
interface ParseOptions {
  returnFields?: boolean
  returnParsedFields?: boolean
}

/**
 * Parses a TypeScript interface and transforms it into:
 * - A class declaration string
 * - Or: an array of field names
 * - Or: an array of ParsedField objects
 */
export function parseInterfaceToClass(
  code: string,
  fieldConfigs: Record<ConstructorFieldType, BaseFieldConfig>,
  options: ParseOptions = {},
): string | string[] | any[] {
  // Parse input TypeScript code into AST
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript'],
  })

  let classBody: t.ClassBody | null = null
  let className = 'GeneratedClass'
  const fields: string[] = []
  const parsedFields: unknown[] = []

  // Traverse the AST to find the interface declaration
  traverse(ast, {
    TSInterfaceDeclaration(path) {
      className = getClassName(path.node.id.name)

      const props = path.node.body.body

      for (const prop of props) {
        if (!isValidProperty(prop))
          continue

        const name = (prop.key as t.Identifier).name
        const type = resolveTSType(prop.typeAnnotation?.typeAnnotation)

        fields.push(name)

        // Return raw field names only
        if (options.returnFields)
          continue

        // Return ParsedField[] for constructor UI/editor
        if (options.returnParsedFields) {
          parsedFields.push(
            name === 'id'
              ? createRawParsedField(name, type)
              : createParsedField(name, type, fieldConfigs),
          )
        }
      }

      // Default: generate full class
      if (!options.returnFields && !options.returnParsedFields)
        classBody = generateClassBody(props, fieldConfigs)

      path.stop() // stop after first interface
    },
  })

  if (options.returnFields)
    return fields
  if (options.returnParsedFields)
    return parsedFields
  if (!classBody)
    return ''

  // Generate the class AST and convert to code string
  const classAst = t.classDeclaration(
    t.identifier(className),
    null,
    classBody,
    [],
  )

  return recast.print(classAst).code
}

// Converts interface name like "IMetaData" → "MetaDataForm"
function getClassName(interfaceName: string): string {
  return `${interfaceName.replace(/^I/, '')}Form`
}

// Ensures that a property is a valid TS property signature
function isValidProperty(prop: any): prop is t.TSPropertySignature {
  return t.isTSPropertySignature(prop) && t.isIdentifier(prop.key)
}

// Extracts type name from TypeScript AST node
function resolveTSType(typeNode: t.TSType | undefined): string {
  if (t.isTSStringKeyword(typeNode))
    return 'string'
  if (t.isTSBooleanKeyword(typeNode))
    return 'boolean'
  if (t.isTSNumberKeyword(typeNode))
    return 'number'
  if (t.isTSTypeReference(typeNode) && t.isIdentifier(typeNode.typeName))
    return typeNode.typeName.name

  return 'any' // fallback
}

// Returns raw field (e.g. for `id`) with manual assignment
function createRawParsedField(name: string, type: string) {
  return {
    name,
    className: 'raw',
    args: { raw: 'if (data?.id) this.id = data.id' },
    readonly: true,
    rawType: type,
    isRaw: true,
  }
}

// Creates a ParsedField object with config and default UI bindings
function createParsedField(
  name: string,
  type: string,
  fieldConfigs: Record<string, BaseFieldConfig>,
) {
  const config = fieldConfigs[name] ?? textConfig

  const field = {
    name,
    className: config.className || 'TextBaseField',
    args: {
      key: `'${name}'`,
      value: `data?.${name}`,
      label: `i18n.t('page.meta.${name}')`,
    },
    readonly: false,
    rawType: type,
    isRaw: false,
    extra: {},
  }

  // Apply dynamic config options (e.g. clearable, placeholder, etc.)
  applyConfigOptions(field, config.options)

  return field
}

// Generates the body of a class from interface properties
function generateClassBody(
  props: readonly t.TSTypeElement[],
  fieldConfigs: Record<string, BaseFieldConfig>,
): t.ClassBody {
  const classProps: t.ClassProperty[] = []

  for (const prop of props) {
    if (!isValidProperty(prop))
      continue

    const name = prop.key.name
    const config = fieldConfigs[name] ?? fieldConfigs.text

    // Inject key and label into config options
    config.options.key = name
    config.options.label ||= name

    // Create field expression via fieldFactory (as code string)
    const initExpression = recast.parse(createField(config)).program.body[0] as t.ExpressionStatement

    const classProp = t.classProperty(
      t.identifier(name),
      initExpression.expression,
      undefined,
      null,
    )

    ;(classProp as t.ClassProperty).readonly = true

    classProps.push(classProp)
  }

  return t.classBody(classProps)
}
