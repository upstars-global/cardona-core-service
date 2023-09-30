import { PermissionFormType } from '../@model/enums/permissions'
import type { PermissionUpdatableTable } from 'src/@model/permission'

export enum PermissionType {
  DemoPage = 'demo-demo',
  DemoPageReport = 'demo-demo-report',
  DemoPageSeo = 'demo-demo-seo',
}

export default {
  demoPage: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.DemoPage,
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.DemoPageReport,
    },
    {
      type: PermissionFormType.Table,
      target: PermissionType.DemoPageSeo,
      notAccessLevel: [4],
    },
  ] as PermissionUpdatableTable[],
}
