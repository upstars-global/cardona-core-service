import { describe, it } from 'vitest'
import { nextTick } from 'vue'
import TransactionType from '../../../../src/components/templates/_components/TransactionType.vue'
import {
  setMountComponent,
  testOnEqualTextValue,
  testOnExistClass,
} from '../../utils'
import { TransactionType as TransactionTypeList } from '../../../../src/@model/enums/playersTransactions'
import { t } from '../shared-tests/locales'
import { IconsList } from '../../../../src/@model/enums/icons'

const getMountTransactionType = setMountComponent(TransactionType)

const testCases = [
  {
    type: TransactionTypeList.Payout,
    expectedText: t('common.payout'),
    expectedIconClass: IconsList.ArrowUpRightIcon,
    expectedWrapperClass: 'text-error',
  },
  {
    type: TransactionTypeList.Deposit,
    expectedText: t('common.deposit'),
    expectedIconClass: IconsList.ArrowDownRightIcon,
    expectedWrapperClass: 'text-success',
  },
]

describe('TransactionType', () => {
  testCases.forEach(({ type, expectedText, expectedIconClass, expectedWrapperClass }) => {
    it(`renders the correct icon and text for ${type.toLowerCase()} transaction`, async () => {
      const wrapper = getMountTransactionType({
        type,
      })

      await nextTick()
      testOnEqualTextValue({ wrapper, testId: 'transaction-type-text' }, expectedText)
      testOnExistClass({ wrapper, testId: 'transaction-type-icon' }, expectedIconClass)
      testOnExistClass({ wrapper }, expectedWrapperClass)
    })
  })
})
