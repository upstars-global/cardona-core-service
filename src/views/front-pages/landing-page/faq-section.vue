<script setup lang="ts">
import boyWithLogo from '@images/front-pages/landing-page/faq-boy-with-logos.png'

const faqData = [
  {
    question: 'Do you charge for each upgrade?',
    answer: 'Lemon drops chocolate cake gummies carrot cake chupa chups muffin topping. Sesame snaps icing marzipan gummi bears macaroon dragée danish caramels powder. Bear claw dragée pastry topping soufflé. Wafer gummi bears marshmallow pastry pie.',
  },
  {
    question: 'Do I need to purchase a license for each website?',
    answer: 'Dessert ice cream donut oat cake jelly-o pie sugar plum cheesecake. Bear claw dragée oat cake dragée ice cream halvah tootsie roll. Danish cake oat cake pie macaroon tart donut gummies. Jelly beans candy canes carrot cake. Fruitcake chocolate chupa chups.',
  },
  {
    question: 'What is regular license?',
    answer: 'Regular license can be used for end products that do not charge users for access or service(access is free and there will be no monthly subscription fee). Single regular license can be used for single end product and end product can be used by you or your client. If you want to sell end product to multiple clients then you will need to purchase separate license for each client. The same rule applies if you want to use the same end product on multiple domains(unique setup). For more info on regular license you can check official description.',
  },
  {
    question: 'What is extended license?',
    answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis et aliquid quaerat possimus maxime! Mollitia reprehenderit neque repellat deleniti delectus architecto dolorum maxime, blanditiis earum ea, incidunt quam possimus cumque.',
  },
  {
    question: 'Which license is applicable for SASS application?',
    answer: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi molestias exercitationem ab cum nemo facere voluptates veritatis quia, eveniet veniam at et repudiandae mollitia ipsam quasi labore enim architecto non!',
  },
]
</script>

<template>
  <div id="faq">
    <VContainer>
      <!-- 👉 Header  -->
      <div class="faq-section">
        <div class="headers d-flex justify-center flex-column align-center">
          <h6 class="text-base mb-4 font-weight-medium my-auto d-flex gap-x-2">
            <VChip
              label
              color="primary"
            >
              FAQ
            </VChip>
          </h6>
          <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
            Frequently Asked
            <div class="position-relative ms-2">
              <h3 class="section-title">
                questions
              </h3>
            </div>
          </div>
          <p class="mb-0">
            Browse through these FAQs to find answers to commonly asked questions.
          </p>
        </div>
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <div class="d-flex align-center justify-center h-100">
              <VImg
                :src="boyWithLogo"
                height="340"
              />
            </div>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VExpansionPanels class="py-4">
              <VExpansionPanel
                v-for="faq in faqData"
                :key="faq.question"
              >
                <VExpansionPanelTitle>
                  {{ faq.question }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ faq.answer }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.faq-section {
  margin-block: 6.25rem;
}

@media (max-width: 600px) {
  .faq-section{
    margin-block: 4rem;
  }
}

#faq{
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgba(var(--v-theme-background))
}

.section-title::after {
  position: absolute;
  background: url('../../../assets/images/front-pages/icons/section-title-icon.png') no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: '';
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: 0%;
}
</style>
