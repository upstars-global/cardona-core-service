export enum ActionType {
  Creation = 'creating',
  Updating = 'updating',
  Deleting = 'deleting',
  Reporting = 'reporting',
}

export enum ActionVariant {
  creation = 'success',
  creating = 'success',
  updating = 'secondary',
  deleting = 'error',
  reporting = 'secondary',
}
export default {}
