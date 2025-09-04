// Remove after resolve task https://upstars.atlassian.net/browse/BAC-6078

export enum StatusVariants {

  // Secondary
  initial = 'secondary',
  New = 'secondary',
  new = 'secondary',
  waiting = 'secondary',
  received = 'secondary',
  updating = 'secondary',
  reporting = 'secondary',

  // Success
  active = 'success',
  activated = 'success',
  finished = 'success',
  approved = 'success',
  read = 'success',
  Confirmed = 'success',
  wager = 'success',
  'wager_done' = 'success',
  creation = 'success',
  cooling_off_active = 'success',
  self_exclusion_active = 'success',

  // Warning
  inactive = 'warning',
  'in progress' = 'warning',
  pending = 'warning',
  're-check' = 'warning',
  Processing = 'warning',
  Waiting = 'warning',
  'wait_activation' = 'warning',
  processing = 'warning',
  used = 'warning',
  self_exclusion_waiting_to_confirm = 'warning',
  waiting_to_confirm = 'warning',
  waiting_disable = 'warning',

  // Danger
  delete = 'error',
  expired = 'error',
  rejected = 'error',
  Canceled = 'error',
  Error = 'error',
  'Canceled by user' = 'error',
  'Marbella cancel processing' = 'error',
  removed = 'error',
  canceled = 'error',
  lost = 'error',
  cancelled = 'error',
  'erased_by_withdraw' = 'error',
  deleting = 'error',
  disabled = 'error',

  // TODO: Add status variant here
}
