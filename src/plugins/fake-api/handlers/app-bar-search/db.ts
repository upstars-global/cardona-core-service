import type { SearchResults } from '@/plugins/fake-api/handlers/app-bar-search/types'

interface DB {
  searchItems: SearchResults[]
}

export const db: DB = {
  searchItems: [
    {
      title: 'Dashboards',
      category: 'dashboards',
      children: [
        {
          url: { name: 'dashboards-analytics' },
          icon: 'tabler-timeline',
          title: 'Analytics Dashboard',
        },
        {
          url: { name: 'dashboards-crm' },
          icon: 'tabler-file-analytics',
          title: 'CRM Dashboard',
        },
        {
          url: { name: 'dashboards-ecommerce' },
          icon: 'tabler-shopping-cart',
          title: 'ECommerce Dashboard',
        },
        {
          url: { name: 'dashboards-academy' },
          icon: 'tabler-book',
          title: 'Academy Dashboard',
        },
        {
          url: { name: 'dashboards-logistics' },
          icon: 'tabler-truck',
          title: 'Logistics Dashboard',
        },
      ],
    },
    {
      title: 'Front Pages',
      category: 'frontPages',
      children: [
        {
          url: { name: 'front-pages-landing-page' },
          icon: 'tabler-file-description',
          title: 'Landing Front',
        },
        {
          url: { name: 'front-pages-pricing' },
          icon: 'tabler-file-description',
          title: 'Pricing Front',
        },
        {
          url: { name: 'front-pages-payment' },
          icon: 'tabler-file-description',
          title: 'Payment Front',
        },
        {
          url: { name: 'front-pages-checkout' },
          icon: 'tabler-file-description',
          title: 'Checkout Front',
        },
        {
          url: { name: 'front-pages-help-center' },
          icon: 'tabler-file-description',
          title: 'Help Center Front',
        },
      ],
    },
    {
      title: 'Apps & Pages',
      category: 'appsPages',
      children: [
        {
          url: { name: 'apps-email' },
          icon: 'tabler-mail',
          title: 'Email',
        },
        {
          url: { name: 'apps-chat' },
          icon: 'tabler-message',
          title: 'Chat',
        },
        {
          url: { name: 'apps-calendar' },
          icon: 'tabler-calendar',
          title: 'Calendar',
        },
        {
          url: { name: 'apps-ecommerce-dashboard' },
          icon: 'tabler-shopping-cart',
          title: 'ECommerce Dashboard',
        },
        {
          url: { name: 'apps-ecommerce-product-list' },
          icon: 'tabler-list',
          title: 'Ecommerce - Product List',
        },
        {
          url: { name: 'apps-ecommerce-product-add' },
          icon: 'tabler-circle-plus',
          title: 'Ecommerce - Add Product',
        },
        {
          url: { name: 'apps-ecommerce-product-category-list' },
          icon: 'tabler-list',
          title: 'Ecommerce - Category List',
        },
        {
          url: { name: 'apps-ecommerce-order-list' },
          icon: 'tabler-list',
          title: 'Ecommerce - Order List',
        },
        {
          url: { name: 'apps-ecommerce-order-details-id', params: { id: '9042' } },
          icon: 'tabler-list-check',
          title: 'Ecommerce - Order Details',
        },
        {
          url: { name: 'apps-ecommerce-customer-list' },
          icon: 'tabler-user',
          title: 'Ecommerce - Customer List',
        },
        {
          url: { name: 'apps-ecommerce-customer-details-id', params: { id: '478426', tab: 'security' } },
          icon: 'tabler-list',
          title: 'Ecommerce - Customer Details',
        },
        {
          url: { name: 'apps-ecommerce-manage-review' },
          icon: 'tabler-quote',
          title: 'Ecommerce - Manage Review',
        },
        {
          url: { name: 'apps-ecommerce-referrals' },
          icon: 'tabler-users-group',
          title: 'Ecommerce - Referrals',
        },
        {
          url: { name: 'apps-ecommerce-settings' },
          icon: 'tabler-settings',
          title: 'Ecommerce - Settings',
        },
        {
          url: { name: 'apps-academy-dashboard' },
          icon: 'tabler-book',
          title: 'Academy - Dashboard',
        },
        {
          url: { name: 'apps-academy-my-course' },
          icon: 'tabler-list',
          title: 'Academy - My Courses',
        },
        {
          url: { name: 'apps-academy-course-details' },
          icon: 'tabler-list',
          title: 'Academy - Course Details',
        },
        {
          url: { name: 'apps-logistics-dashboard' },
          icon: 'tabler-book',
          title: 'Logistics - Dashboard',
        },
        {
          url: { name: 'apps-logistics-fleet' },
          icon: 'tabler-car',
          title: 'Logistics - fleet',
        },
        {
          url: { name: 'apps-invoice-list' },
          icon: 'tabler-list',
          title: 'Invoice List',
        },
        {
          url: { name: 'apps-invoice-preview-id', params: { id: '5036' } },
          icon: 'tabler-file-description',
          title: 'Invoice Preview',
        },
        {
          url: { name: 'apps-invoice-edit-id', params: { id: '5036' } },
          icon: 'tabler-file-pencil',
          title: 'Invoice Edit',
        },
        {
          url: { name: 'apps-invoice-add' },
          icon: 'tabler-file-plus',
          title: 'Invoice Add',
        },
        {
          url: { name: 'apps-user-list' },
          icon: 'tabler-users-group',
          title: 'User List',
        },
        {
          url: { name: 'apps-user-view-id', params: { id: 21 } },
          icon: 'tabler-eye',
          title: 'User View',
        },
        {
          url: { name: 'pages-user-profile-tab', params: { tab: 'profile' } },
          icon: 'tabler-user-circle',
          title: 'User Profile - Profile',
        },
        {
          url: { name: 'pages-account-settings-tab', params: { tab: 'account' } },
          icon: 'tabler-user-circle',
          title: 'Account Settings - Account',
        },
        {
          url: { name: 'pages-account-settings-tab', params: { tab: 'security' } },
          icon: 'tabler-lock-open',
          title: 'Account Settings - Security',
        },
        {
          url: { name: 'pages-account-settings-tab', params: { tab: 'billing-plans' } },
          icon: 'tabler-currency-dollar',
          title: 'Account Settings - Billing',
        },
        {
          url: { name: 'pages-account-settings-tab', params: { tab: 'notification' } },
          icon: 'tabler-bell',
          title: 'Account Settings - Notifications',
        },
        {
          url: { name: 'pages-account-settings-tab', params: { tab: 'connection' } },
          icon: 'tabler-link',
          title: 'Account Settings - Connections',
        },
        {
          url: { name: 'pages-pricing' },
          icon: 'tabler-currency-dollar',
          title: 'Pricing',
        },
        {
          url: { name: 'pages-faq' },
          icon: 'tabler-help-circle',
          title: 'FAQ',
        },
        {
          url: { name: 'pages-misc-coming-soon' },
          icon: 'tabler-clock',
          title: 'Coming Soon',
        },
        {
          url: { name: 'pages-misc-under-maintenance' },
          icon: 'tabler-settings',
          title: 'Under Maintenance',
        },
        {
          url: { path: '/pages/misc/page-not-found' },
          icon: 'tabler-alert-circle',
          title: 'Page Not Found - 404',
        },
        {
          url: { name: 'pages-misc-not-authorized' },
          icon: 'tabler-user-x',
          title: 'Not Authorized - 401',
        },
        {
          url: { name: 'pages-authentication-login-v1' },
          icon: 'tabler-login',
          title: 'Login V1',
        },
        {
          url: { name: 'pages-authentication-login-v2' },
          icon: 'tabler-login',
          title: 'Login V2',
        },
        {
          url: { name: 'pages-authentication-register-v1' },
          icon: 'tabler-user-plus',
          title: 'Register V1',
        },
        {
          url: { name: 'pages-authentication-register-v2' },
          icon: 'tabler-user-plus',
          title: 'Register V2',
        },
        {
          icon: 'tabler-mail',
          title: 'Verify Email V1',
          url: { name: 'pages-authentication-verify-email-v1' },
        },
        {
          icon: 'tabler-mail',
          title: 'Verify Email V2',
          url: { name: 'pages-authentication-verify-email-v2' },
        },
        {
          url: { name: 'pages-authentication-forgot-password-v1' },
          icon: 'tabler-lock-exclamation',
          title: 'Forgot Password V1',
        },
        {
          url: { name: 'pages-authentication-forgot-password-v2' },
          icon: 'tabler-lock-exclamation',
          title: 'Forgot Password V2',
        },
        {
          url: { name: 'pages-authentication-reset-password-v1' },
          icon: 'tabler-help-circle',
          title: 'Reset Password V1',
        },
        {
          url: { name: 'pages-authentication-reset-password-v2' },
          icon: 'tabler-help-circle',
          title: 'Reset Password V2',
        },
        {
          icon: 'tabler-devices',
          title: 'Two Steps V1',
          url: { name: 'pages-authentication-two-steps-v1' },
        },
        {
          icon: 'tabler-devices',
          title: 'Two Steps V2',
          url: { name: 'pages-authentication-two-steps-v2' },
        },
        {
          url: { name: 'pages-dialog-examples' },
          icon: 'tabler-square',
          title: 'Dialog Examples',
        },
        {
          url: { name: 'pages-authentication-register-multi-steps' },
          icon: 'tabler-user-plus',
          title: 'Register Multi-Steps',
        },
        {
          url: { name: 'wizard-examples-checkout' },
          icon: 'tabler-shopping-cart',
          title: 'Wizard - Checkout',
        },
        {
          url: { name: 'wizard-examples-create-deal' },
          icon: 'tabler-gift',
          title: 'Wizard - create deal',
        },
        {
          url: { name: 'wizard-examples-property-listing' },
          icon: 'tabler-home',
          title: 'Wizard - Property Listing',
        },
        {
          url: { name: 'apps-roles' },
          icon: 'tabler-shield-checkered',
          title: 'Roles',
        },
        {
          url: { name: 'apps-permissions' },
          icon: 'tabler-shield-checkered',
          title: 'Permissions',
        },
      ],
    },
    {
      title: 'User Interface',
      category: 'userInterface',
      children: [
        {
          url: { name: 'pages-typography' },
          icon: 'tabler-letter-case',
          title: 'Typography',
        },
        {
          url: { name: 'pages-icons' },
          icon: 'tabler-icons',
          title: 'Icons',
        },
        {
          url: { name: 'pages-cards-card-basic' },
          icon: 'tabler-square',
          title: 'Card Basic',
        },
        {
          url: { name: 'pages-cards-card-advance' },
          icon: 'tabler-square-plus',
          title: 'Card Advance',
        },
        {
          url: { name: 'pages-cards-card-statistics' },
          icon: 'tabler-chart-bar',
          title: 'Card Statistics',
        },
        {
          url: { name: 'pages-cards-card-widgets' },
          icon: 'tabler-chart-bar',
          title: 'Card widgets',
        },
        {
          url: { name: 'pages-cards-card-gamification' },
          icon: 'tabler-id',
          title: 'Card Gamification',
        },
        {
          url: { name: 'pages-cards-card-actions' },
          icon: 'tabler-square-plus',
          title: 'Card Actions',
        },
        {
          url: { name: 'components-alert' },
          icon: 'tabler-alert-triangle',
          title: 'Alerts',
        },
        {
          url: { name: 'components-avatar' },
          icon: 'tabler-user-circle',
          title: 'Avatars',
        },
        {
          url: { name: 'components-badge' },
          icon: 'tabler-badge',
          title: 'Badges',
        },
        {
          url: { name: 'components-button' },
          icon: 'tabler-circle-plus',
          title: 'Buttons',
        },
        {
          url: { name: 'components-chip' },
          icon: 'tabler-square',
          title: 'Chips',
        },
        {
          url: { name: 'components-dialog' },
          icon: 'tabler-square',
          title: 'Dialogs',
        },
        {
          url: { name: 'components-list' },
          icon: 'tabler-list',
          title: 'List',
        },
        {
          url: { name: 'components-menu' },
          icon: 'tabler-menu-2',
          title: 'Menu',
        },
        {
          url: { name: 'components-pagination' },
          icon: 'tabler-skip-forward',
          title: 'Pagination',
        },
        {
          url: { name: 'components-progress-circular' },
          icon: 'tabler-progress',
          title: 'Progress Circular',
        },
        {
          url: { name: 'components-progress-linear' },
          icon: 'tabler-progress',
          title: 'Progress Linear',
        },
        {
          url: { name: 'components-expansion-panel' },
          icon: 'tabler-align-center',
          title: 'Expansion Panel',
        },
        {
          url: { name: 'components-snackbar' },
          icon: 'tabler-message-dots',
          title: 'Snackbar',
        },
        {
          url: { name: 'components-tabs' },
          icon: 'tabler-app-window',
          title: 'Tabs',
        },
        {
          url: { name: 'components-timeline' },
          icon: 'tabler-timeline',
          title: 'Timeline',
        },
        {
          url: { name: 'components-tooltip' },
          icon: 'tabler-message-2',
          title: 'Tooltip',
        },
        {
          url: { name: 'extensions-tour' },
          icon: 'tabler-box',
          title: 'Tour',
        },
        {
          url: { name: 'extensions-swiper' },
          icon: 'tabler-photo',
          title: 'Swiper',
        },
      ],
    },
    {
      title: 'Forms & Tables',
      category: 'formsTables',
      children: [
        {
          url: { name: 'forms-textfield' },
          icon: 'tabler-text-caption',
          title: 'TextField',
        },
        {
          url: { name: 'forms-select' },
          icon: 'tabler-list-check',
          title: 'Select',
        },
        {
          url: { name: 'forms-checkbox' },
          icon: 'tabler-square-check',
          title: 'Checkbox',
        },
        {
          url: { name: 'forms-radio' },
          icon: 'tabler-circle-dot-filled',
          title: 'Radio',
        },
        {
          url: { name: 'forms-combobox' },
          icon: 'tabler-square-check',
          title: 'Combobox',
        },
        {
          url: { name: 'forms-date-time-picker' },
          icon: 'tabler-calendar',
          title: 'Date Time picker',
        },
        {
          url: { name: 'forms-textarea' },
          icon: 'tabler-notes',
          title: 'Textarea',
        },
        {
          url: { name: 'forms-switch' },
          icon: 'tabler-toggle-right',
          title: 'Switch',
        },
        {
          url: { name: 'forms-file-input' },
          icon: 'tabler-upload',
          title: 'File Input',
        },
        {
          url: { name: 'forms-editors' },
          icon: 'tabler-file-pencil',
          title: 'Editors',
        },
        {
          url: { name: 'forms-rating' },
          icon: 'tabler-star',
          title: 'Form Rating',
        },
        {
          url: { name: 'forms-slider' },
          icon: 'tabler-hand-move',
          title: 'Slider',
        },
        {
          url: { name: 'forms-range-slider' },
          icon: 'tabler-adjustments-horizontal',
          title: 'Range Slider',
        },
        {
          url: { name: 'forms-form-layouts' },
          icon: 'tabler-box',
          title: 'Form Layouts',
        },
        {
          url: { name: 'forms-form-validation' },
          icon: 'tabler-circle-check',
          title: 'Form Validation',
        },
        {
          url: { name: 'forms-custom-input' },
          icon: 'tabler-list-details',
          title: 'Custom Input',
        },
        {
          url: { name: 'forms-autocomplete' },
          icon: 'tabler-align-left',
          title: 'Autocomplete',
        },
        {
          url: { name: 'tables-data-table' },
          icon: 'tabler-table',
          title: 'Data Table',
        },
        {
          url: { name: 'tables-simple-table' },
          icon: 'tabler-table',
          title: 'Simple Table',
        },
        {
          url: { name: 'forms-form-wizard-numbered' },
          icon: 'tabler-align-center',
          title: 'Form Wizard Numbered',
        },
        {
          url: { name: 'forms-form-wizard-icons' },
          icon: 'tabler-align-center',
          title: 'Form Wizard Icons',
        },
      ],
    },
    {
      title: 'Chart & Misc',
      category: 'chartsMisc',
      children: [
        {
          url: { name: 'charts-apex-chart' },
          icon: 'tabler-chart-area-line',
          title: 'Apex Charts',
        },
        {
          url: { name: 'charts-chartjs' },
          icon: 'tabler-chart-histogram',
          title: 'ChartJS',
        },
        {
          url: { name: 'access-control' },
          icon: 'tabler-shield',
          title: 'Access Control (ACL)',
        },
      ],
    },
  ],
}
