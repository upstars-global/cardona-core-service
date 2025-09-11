import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as recast from 'recast'
import { createField } from '../fieldFactory'
import { applyConfigOptions } from '../_composables/useFields'
import type { BaseFieldConfig } from '../types'

interface ParseOptions {
  returnFields?: boolean
  returnParsedFields?: boolean
}

export function parseInterfaceToClass(
  code: string,
  fieldConfigs: Record<string, BaseFieldConfig>,
  options: ParseOptions = {},
): string | string[] | any[] {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript'],
  })

  let classBody: t.ClassBody | null = null
  let className = 'GeneratedClass'
  const fields: string[] = []
  const parsedFields: any[] = []

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
        if (options.returnFields)
          continue

        if (options.returnParsedFields) {
          parsedFields.push(
            name === 'id'
              ? createRawParsedField(name, type)
              : createParsedField(name, type, fieldConfigs),
          )
        }
      }

      if (!options.returnFields && !options.returnParsedFields)
        classBody = generateClassBody(props, fieldConfigs)

      path.stop()
    },
  })

  if (options.returnFields)
    return fields
  if (options.returnParsedFields)
    return parsedFields
  if (!classBody)
    return ''

  const classAst = t.classDeclaration(
    t.identifier(className),
    null,
    classBody,
    [],
  )

  return recast.print(classAst).code
}
function getClassName(interfaceName: string): string {
  return `${interfaceName.replace(/^I/, '')}Form`
}

function isValidProperty(prop: any): prop is t.TSPropertySignature {
  return t.isTSPropertySignature(prop) && t.isIdentifier(prop.key)
}

function resolveTSType(typeNode: t.TSType | undefined): string {
  if (t.isTSStringKeyword(typeNode))
    return 'string'
  if (t.isTSBooleanKeyword(typeNode))
    return 'boolean'
  if (t.isTSNumberKeyword(typeNode))
    return 'number'
  if (t.isTSTypeReference(typeNode) && t.isIdentifier(typeNode.typeName))
    return typeNode.typeName.name

  return 'any'
}

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

function createParsedField(
  name: string,
  type: string,
  fieldConfigs: Record<string, BaseFieldConfig>,
) {
  const config = fieldConfigs[name] ?? fieldConfigs.text

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

  applyConfigOptions(field, config.options)

  return field
}

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

    config.options.key = name
    config.options.label ||= name

    const initExpression = recast.parse(createField(config)).program.body[0] as t.ExpressionStatement

    const classProp = t.classProperty(
      t.identifier(name),
      initExpression.expression,
      undefined,
      null,
    )

    ;(classProp as any).readonly = true

    classProps.push(classProp)
  }

  return t.classBody(classProps)
}
