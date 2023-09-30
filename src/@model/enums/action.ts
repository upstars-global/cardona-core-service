export enum ActionType {
  Creation = 'creation',
  Updating = 'updating',
  Deleting = 'deleting',
  Reporting = 'reporting',
}

export enum ActionVariant {
  creation = 'success',
  updating = 'secondary',
  deleting = 'danger',
  reporting = 'secondary',
}
