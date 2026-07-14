import { createApp } from 'vue'
// The reset MUST come before uno.css: it contains same-specificity selectors
// like [type='button'] { background-color: transparent } that would otherwise
// override utility classes (e.g. .bg-primary on dialog/date-picker buttons).
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import App from './App.vue'

createApp(App).mount('#app')
