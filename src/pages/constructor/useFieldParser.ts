import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as recast from 'recast'
import { createField } from './fieldFactory'
import type { BaseFieldConfig } from './types'

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
      className = `${path.node.id.name.replace(/^I/, '')}Form`

      const props = path.node.body.body

      props.forEach((prop: any) => {
        if (!t.isTSPropertySignature(prop) || !t.isIdentifier(prop.key))
          return
        const name = prop.key.name

        let type = 'any'
        const typeAnnotation = prop.typeAnnotation?.typeAnnotation
        if (t.isTSStringKeyword(typeAnnotation))
          type = 'string'
        else if (t.isTSBooleanKeyword(typeAnnotation))
          type = 'boolean'
        else if (t.isTSNumberKeyword(typeAnnotation))
          type = 'number'
        else if (t.isTSTypeReference(typeAnnotation) && t.isIdentifier(typeAnnotation.typeName))
          type = typeAnnotation.typeName.name

        fields.push(name)

        // --- Якщо треба тільки список полів ---
        if (options.returnFields)
          return

        // --- Якщо треба масив parsedFields для UI ---
        if (options.returnParsedFields) {
          if (name === 'id') {
            parsedFields.push({
              name,
              className: 'raw',
              args: { raw: 'if (data?.id) this.id = data.id' },
              readonly: true,
              rawType: type,
              isRaw: true,
            })
          }
          else {
            parsedFields.push({
              name,
              className: 'TextBaseField',
              args: {
                key: `'${name}'`,
                value: `data?.${name}`,
                label: `i18n.t('page.meta.${name}')`, // дефолт
              },
              readonly: false,
              rawType: type,
              isRaw: false,
              extra: {
                placeholder: false,
                info: false,
                validationRules: false,
                selectedRules: [],
                rulesParams: {},
              },
            })
          }
        }
      })

      if (!options.returnParsedFields && !options.returnFields) {
        // будуємо classProperties для AST-генерації
        const classProps = props.map((prop: any) => {
          if (!t.isTSPropertySignature(prop) || !t.isIdentifier(prop.key))
            return null
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

          return classProp
        }).filter(Boolean) as t.ClassProperty[]

        classBody = t.classBody(classProps)
      }

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
