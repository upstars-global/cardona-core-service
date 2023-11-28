<script setup lang="ts">
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'
import { ref } from 'vue'

const optionCounter = ref(1)

const dropZoneRef = ref<HTMLDivElement>()
interface FileData {
  file: File
  url: string
}

const fileData = ref<FileData[]>([])
const { open, onChange } = useFileDialog({ accept: 'image/*' })

function onDrop(DroppedFiles: File[] | null) {
  DroppedFiles?.forEach(file => {
    if (file.type.slice(0, 6) !== 'image/') {
      // eslint-disable-next-line no-alert
      alert('Only image files are allowed')

      return
    }

    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    })
  },
  )
}

onChange(selectedFiles => {
  if (!selectedFiles)
    return

  for (const file of selectedFiles) {
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    })
  }
})

useDropZone(dropZoneRef, onDrop)

const content = ref('')

const activeTab = ref('Restock')
const isTaxChargeToProduct = ref(true)

const shippingList = [
  { desc: 'You\'ll be responsible for product delivery.Any damage or delay during shipping may cost you a Damage fee', title: 'Fulfilled by Seller', value: 'Fulfilled by Seller' },
  { desc: 'Your product, Our responsibility.For a measly fee, we will handle the delivery process for you.', title: 'Fulfilled by Company name', value: 'Fulfilled by Company name' },
] as const

const shippingType = ref<typeof shippingList[number]['value']>('Fulfilled by Company name')
const deliveryType = ref('Worldwide delivery')
const selectedAttrs = ref(['Biodegradable', 'Expiry Date'])

const inventoryTabsData = [
  { icon: 'tabler-cube', title: 'Restock', value: 'Restock' },
  { icon: 'tabler-car', title: 'Shipping', value: 'Shipping' },
  { icon: 'tabler-map-pin', title: 'Global Delivery', value: 'Global Delivery' },
  { icon: 'tabler-world', title: 'Attributes', value: 'Attributes' },
  { icon: 'tabler-lock', title: 'Advanced', value: 'Advanced' },
]
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Add a new product
        </h4>
        <span>Orders placed across your store</span>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn
          variant="tonal"
          color="secondary"
        >
          Discard
        </VBtn>
        <VBtn
          variant="tonal"
          color="primary"
        >
          Save Draft
        </VBtn>
        <VBtn>Publish Product</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <!-- 👉 Product Information -->
        <VCard
          class="mb-6"
          title="Product Information"
        >
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextField
                  label="Name"
                  placeholder="iPhone 14"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="SKU"
                  placeholder="FXSK123U"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="Barcode"
                  placeholder="0123-4567"
                />
              </VCol>
              <VCol>
                <span class="mb-1">Description (optional)</span>
                <TiptapEditor
                  v-model="content"
                  placeholder="Product Description"
                  class="border rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- 👉 Media -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              Media
            </template>
            <template #append>
              <span class="text-primary font-weight-medium text-sm cursor-pointer">Add Media from URL</span>
            </template>
          </VCardItem>

          <VCardText>
            <div class="flex">
              <div class="w-full h-auto relative">
                <div
                  ref="dropZoneRef"
                  class="cursor-pointer"
                  @click="() => open()"
                >
                  <div
                    v-if="fileData.length === 0"
                    class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone"
                  >
                    <IconBtn
                      variant="tonal"
                      class="rounded-sm"
                    >
                      <VIcon icon="tabler-upload" />
                    </IconBtn>
                    <div class="text-base text-high-emphasis font-weight-medium">
                      Drag and Drop Your Image Here.
                    </div>
                    <span class="text-disabled">or</span>

                    <VBtn variant="tonal">
                      Browse Images
                    </VBtn>
                  </div>

                  <div
                    v-else
                    class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap"
                  >
                    <VRow class="match-height w-100">
                      <template
                        v-for="(item, index) in fileData"
                        :key="index"
                      >
                        <VCol
                          cols="12"
                          sm="4"
                        >
                          <VCard
                            :ripple="false"
                            border
                          >
                            <VCardText
                              class="d-flex flex-column"
                              @click.stop
                            >
                              <VImg
                                :src="item.url"
                                width="200px"
                                height="150px"
                                class="w-100 mx-auto"
                              />
                              <div class="mt-2">
                                <span class="clamp-text text-wrap">
                                  {{ item.file.name }}
                                </span>
                                <span>
                                  {{ item.file.size / 1000 }} KB
                                </span>
                              </div>
                            </VCardText>
                            <VSpacer />
                            <VCardActions>
                              <VBtn
                                variant="outlined"
                                block
                                @click.stop="fileData.splice(index, 1)"
                              >
                                Remove File
                              </VBtn>
                            </VCardActions>
                          </VCard>
                        </VCol>
                      </template>
                    </VRow>
                  </div>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Variants -->
        <VCard
          title="Variants"
          class="mb-6"
        >
          <VCardText>
            <template
              v-for="i in optionCounter"
              :key="i"
            >
              <VRow>
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppSelect
                    :items="['Size', 'Color', 'Weight', 'Smell']"
                    placeholder="Select Variant"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="8"
                >
                  <AppTextField
                    placeholder="38"
                    type="number"
                  />
                </VCol>
              </VRow>
            </template>

            <VBtn
              class="mt-6"
              @click="optionCounter++"
            >
              Add another option
            </VBtn>
          </VCardText>
        </VCard>

        <!-- 👉 Inventory -->
        <VCard
          title="Inventory"
          class="inventory-card"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <div class="pe-3">
                  <VTabs
                    v-model="activeTab"
                    direction="vertical"
                    color="primary"
                    class="v-tabs-pill"
                  >
                    <VTab
                      v-for="(tab, index) in inventoryTabsData"
                      :key="index"
                    >
                      <VIcon
                        :icon="tab.icon"
                        class="me-2"
                      />
                      <div class="text-truncate font-weight-medium text-start">
                        {{ tab.title }}
                      </div>
                    </VTab>
                  </VTabs>
                </div>
              </VCol>

              <VDivider :vertical="!$vuetify.display.smAndDown" />

              <VCol
                cols="12"
                md="8"
              >
                <VWindow
                  v-model="activeTab"
                  class="w-100"
                  :touch="false"
                >
                  <VWindowItem value="Restock">
                    <div class="d-flex flex-column gap-y-4 ps-3">
                      <h5 class="text-h5">
                        Options
                      </h5>

                      <div class="d-flex gap-x-4 align-center">
                        <AppTextField
                          label="Add to Stock"
                          placeholder="Quantity"
                          density="compact"
                        />
                        <VBtn
                          prepend-icon="tabler-check"
                          class="align-self-end"
                        >
                          Confirm
                        </VBtn>
                      </div>

                      <div>
                        <div class="text-base text-high-emphasis font-weight-medium mb-1">
                          Product in stock now: 54
                        </div>
                        <div class="text-base text-high-emphasis font-weight-medium mb-1">
                          Product in transit: 390
                        </div>
                        <div class="text-base text-high-emphasis font-weight-medium mb-1">
                          Last time restocked: 24th June, 2022
                        </div>
                        <div class="text-base text-high-emphasis font-weight-medium mb-1">
                          Total stock over lifetime: 2,430
                        </div>
                      </div>
                    </div>
                  </VWindowItem>

                  <VWindowItem value="Shipping">
                    <VRadioGroup
                      v-model="shippingType"
                      label="Shipping Type"
                      class="ms-3"
                    >
                      <VRadio
                        v-for="item in shippingList"
                        :key="item.value"
                        :value="item.value"
                        class="mb-4"
                      >
                        <template #label>
                          <div>
                            <div class="text-high-emphasis font-weight-medium mb-1">
                              {{ item.title }}
                            </div>
                            <div class="text-sm">
                              {{ item.desc }}
                            </div>
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VWindowItem>

                  <VWindowItem value="Global Delivery">
                    <div class="ps-3">
                      <h5 class="text-h5 mb-6">
                        Global Delivery
                      </h5>

                      <VRadioGroup
                        v-model="deliveryType"
                        label="Global Delivery"
                        class="ms-3"
                      >
                        <VRadio
                          value="Worldwide delivery"
                          class="mb-4"
                        >
                          <template #label>
                            <div>
                              <div class="text-high-emphasis font-weight-medium mb-1">
                                Worldwide delivery
                              </div>
                              <div class="text-sm">
                                Only available with Shipping method:
                                <span class="text-primary">
                                  Fulfilled by Company name
                                </span>
                              </div>
                            </div>
                          </template>
                        </VRadio>

                        <VRadio
                          value="Selected Countries"
                          class="mb-4"
                        >
                          <template #label>
                            <div>
                              <div class="text-high-emphasis font-weight-medium mb-1">
                                Selected Countries
                              </div>
                              <VTextField
                                placeholder="USA"
                                density="compact"
                                style="min-inline-size: 200px;"
                              />
                            </div>
                          </template>
                        </VRadio>

                        <VRadio>
                          <template #label>
                            <div>
                              <div class="text-high-emphasis font-weight-medium mb-1">
                                Local delivery
                              </div>
                              <div class="text-sm">
                                Deliver to your country of residence
                                <span class="text-primary">
                                  Change profile address
                                </span>
                              </div>
                            </div>
                          </template>
                        </VRadio>
                      </VRadioGroup>
                    </div>
                  </VWindowItem>

                  <VWindowItem value="Attributes">
                    <div class="mb-6 text-h6">
                      Attributes
                    </div>
                    <div>
                      <VCheckbox
                        v-model="selectedAttrs"
                        label="Fragile Product"
                        value="Fragile Product"
                      />
                      <VCheckbox
                        v-model="selectedAttrs"
                        value="Biodegradable"
                        label="Biodegradable"
                      />
                      <VCheckbox
                        v-model="selectedAttrs"
                        value="Frozen Product"
                      >
                        <template #label>
                          <div class="d-flex flex-column mb-1">
                            <div>Frozen Product</div>
                            <VTextField
                              placeholder="40 C"
                              type="number"
                              style="min-inline-size: 250px;"
                            />
                          </div>
                        </template>
                      </VCheckbox>

                      <VCheckbox
                        v-model="selectedAttrs"
                        value="Expiry Date"
                      >
                        <template #label>
                          <div class="d-flex flex-column mb-1">
                            <div>Expiry Date of Product</div>
                            <AppDateTimePicker
                              model-value="2025-06-14"
                              placeholder="Select a Date"
                              density="compact"
                            />
                          </div>
                        </template>
                      </VCheckbox>
                    </div>
                  </VWindowItem>

                  <VWindowItem value="Advanced">
                    <div class="ps-3">
                      <h5 class="text-h5 mb-6">
                        Advanced
                      </h5>
                      <div class="d-flex flex-sm-row flex-column flex-wrap justify-space-between gap-x-6 gap-y-4">
                        <AppSelect
                          label="Product ID Type"
                          placeholder="Select Product Type"
                          :items="['ISBN', 'UPC', 'EAN', 'JAN']"
                        />
                        <AppTextField
                          label="Product Id"
                          placeholder="100023"
                        />
                      </div>
                    </div>
                  </VWindowItem>
                </VWindow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        md="4"
        cols="12"
      >
        <!-- 👉 Pricing -->
        <VCard
          title="Pricing"
          class="mb-6"
        >
          <VCardText>
            <AppTextField
              label="Best Price"
              placeholder="Price"
              class="mb-6"
            />
            <AppTextField
              label="Discounted Price"
              placeholder="$499"
              class="mb-4"
            />

            <VCheckbox
              v-model="isTaxChargeToProduct"
              label="Charge Tax on this product"
            />

            <VDivider class="my-2" />

            <div class="d-flex flex-raw align-center justify-space-between ">
              <span>In stock</span>
              <VSwitch density="compact" />
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Organize -->
        <VCard title="Organize">
          <VCardText>
            <div class="d-flex flex-column gap-y-4">
              <AppSelect
                placeholder="Select Vendor"
                label="Vendor"
                :items="['Men\'s Clothing', 'Women\'s Clothing', 'Kid\'s Clothing']"
              />
              <div>
                <VLabel class="d-flex">
                  <div class="d-flex text-sm justify-space-between w-100">
                    <div class="text-high-emphasis">
                      Category
                    </div>
                    <div class="text-primary cursor-pointer">
                      Add new category
                    </div>
                  </div>
                </VLabel>

                <AppSelect
                  placeholder="Select Category"
                  :items="['Household', 'Office', 'Electronics', 'Management', 'Automotive']"
                />
              </div>
              <AppSelect
                placeholder="Select Collection"
                label="Collection"
                :items="['Men\'s Clothing', 'Women\'s Clothing', 'Kid\'s Clothing']"
              />
              <AppSelect
                placeholder="Select Status"
                label="Status"
                :items="['Published', 'Inactive', 'Scheduled']"
              />
              <AppTextField
                label="Tags"
                placeholder="Fashion, Trending, Summer"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
  .drop-zone {
    border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 6px;
  }
</style>

<style lang="scss">
.inventory-card{
  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;

      .v-selection-control__wrapper{
        margin-block-start: -0.375rem !important;
      }
    }

    .v-label.custom-input {
      border: none !important;
    }
  }

  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6{
        color: #fff !important
      }
    }
  }

}

.ProseMirror{
  p{
    margin-block-end: 0;
  }

  padding: 0.5rem;
  outline: none;

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }
}
</style>
