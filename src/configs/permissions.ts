import { PermissionUpdatableTable } from 'src/@model/permission'
import { PermissionFormType } from '../@model/enums/permissions'

export enum PermissionType {
  DemoPage = 'demo-demo',
  DemoPageReport = 'demo-demo-report',
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
  ] as PermissionUpdatableTable[],
}
