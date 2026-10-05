import '../../mocks/base-list/static-mock'
import { createBaseListContract } from '../../templates/contracts/createBaseListContract'
import { useDemoList } from '../../../../src/pages/demo/useDemo'

// Raw backend shape fed into `new DemoListItem(...)` — satisfies IDemoListItem so the model
// doesn't throw, and gives every field a value coherent enough to drive rendering checks.
const sampleBackendResponse = {
  id: '1',
  partnerCode: 'PC-1',
  name: 'Demo Item',
  isActive: true,
  status: 'active',
  amount: 100,
  currency: 'USD',
  wagerValue: '10',
  wagerLimit: '20',
  date: '2026-01-01T00:00:00Z',
  newDate: '2026-01-02T00:00:00Z',
  email: 'demo@example.com',
  period: { dateFrom: '2026-01-01', dateTo: '2026-01-31' },
  buttonName: 'Click me',
  login: 'demo-login',
  localization: 'en',
  country: 'UA',
  position: 1,
  positionByInputWrapper: 1,
  imagePath: '/img.png',
  tags: [],
  type: { id: 'DEPOSIT', name: 'Deposit' },
  gameId: 'game-1',
  state: true,
  comment: 'A comment',
  editableField: { from: 1, to: 2 },
  imageFull: { id: '1', imagePath: '/img-full.png' },
}

createBaseListContract({
  useList: useDemoList,
  sampleBackendResponse,

  // Only keys that are BOTH a TableField and a real DemoListItem property render raw text
  // we can assert verbatim (login/gameId have no `type`, so BaseListCell's default branch
  // just interpolates the value). Several TableField keys in useDemoList don't correspond to
  // any DemoListItem property at all — 'shortId', 'nameSlot', 'innerLink', 'sumPeriod',
  // 'winBack' render as empty cells today; that's an existing gap in the demo page itself
  // (out of scope here), and those keys intentionally stay existence-only below.
  expectedFieldValues: {
    gameId: 'game-1',
    login: 'demo-login',
  },

  actions: {
    fetch: { expect: 'fetchEntityList', assertPayload: true },
    delete: { expect: 'deleteEntity', refetchesAfter: true },
    toggleStatus: { expect: 'baseStoreCore.updateEntity' },
    multiDelete: { expect: 'multipleDeleteEntity' },
  },
})
