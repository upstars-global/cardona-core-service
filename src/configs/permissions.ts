import { PermissionFormType, PermissionType, PermissionUpdatableTable } from '../@model/permission'

export default {
  alaroManageAccess: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.BackofficGroups,
    },
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroUsers,
    },
  ] as PermissionUpdatableTable[],
  configurationsDistributors: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroDistributors,
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroDistributorsReport,
    },
  ] as PermissionUpdatableTable[],
  configurationsConnections: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroConnections,
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroConnectionsReport,
    },
  ] as PermissionUpdatableTable[],
  configurationsOrganizations: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroOrganizations,
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroOrganizationsReport,
    },
  ] as PermissionUpdatableTable[],
  configurationsBrands: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroBrands,
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroBrandsReport,
    },
  ] as PermissionUpdatableTable[],
  gamesCatalog: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroGames,
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroGamesReport,
    },
  ] as PermissionUpdatableTable[],
  reportsGames: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroReportsGame,
      notAccessLevel: [2, 3, 4],
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroReportsGameActivityReport,
    },
  ] as PermissionUpdatableTable[],
  reportsRoundHistory: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroReportsRoundHistory,
      notAccessLevel: [2, 3, 4],
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroReportsRoundHistoryReport,
    },
  ] as PermissionUpdatableTable[],
  reportsBonuses: [
    {
      type: PermissionFormType.Table,
      target: PermissionType.AlaroReportsBonuses,
      notAccessLevel: [2, 3, 4],
    },
    {
      type: PermissionFormType.Switch,
      target: PermissionType.AlaroReportsBonusesReports,
    },
  ] as PermissionUpdatableTable[],
}
