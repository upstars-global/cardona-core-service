import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import TransactionType from '../../../../src/components/templates/_components/TransactionType.vue'
import { findByTestId, getComponentFromWrapper, setMountComponent } from '../../utils'
import { TransactionType as TransactionTypeList } from '../../../../src/@model/enums/playersTransactions'
import { t } from '../shared-tests/locales'
import { IconsList } from '../../../../src/@model/enums/icons'

const getMountTransactionType = setMountComponent(TransactionType)

describe('transactionType', () => {
  it('renders the correct icon and text for payout transaction', async () => {
    const wrapper = getMountTransactionType({
      type: TransactionTypeList.Payout,
    })

    await nextTick()

    expect(findByTestId(wrapper, 'transaction-type-text').text()).toBe(t('common.payout'))

    expect(findByTestId(wrapper, 'transaction-type-icon').classes()).toContain(IconsList.ArrowUpRightIcon)

    expect(wrapper.classes()).toContain('text-error')
  })

  it('renders the correct icon and text for deposit transaction', () => {
    const wrapper = getMountTransactionType({
      type: TransactionTypeList.Deposit,
    })

    expect(findByTestId(wrapper, 'transaction-type-text').text()).toBe(t('common.deposit'))

    expect(getComponentFromWrapper(wrapper, 'VIcon').classes()).toContain(IconsList.ArrowDownRightIcon)

    expect(wrapper.classes()).toContain('text-success')
  })
})
