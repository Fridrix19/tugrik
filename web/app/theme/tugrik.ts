// Пресет PrimeVue из токенов дизайн-системы Tugrik (тот же объект, что src/base/pv-preset.js)
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export default definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '8px', sm: '10px', md: '14px', lg: '18px', xl: '24px' },
    blue: { 50: '#E9F9F0', 100: '#CDEFD9', 200: '#BDEFD5', 300: '#7EDDAE', 400: '#3CCB86', 500: '#12B76A', 600: '#0A9A55', 700: '#067A41', 800: '#065F34', 900: '#054B2A', 950: '#03301B' },
    ink:  { 0: '#FFFFFF', 50: '#F6F8F3', 100: '#EEF2EE', 200: '#DDE3DE', 300: '#C3CCC6', 400: '#9DAAA2', 500: '#7A8A81', 600: '#56685E', 700: '#34483D', 800: '#22352B', 900: '#132019', 950: '#0C1611' },
    green: { 400: '#63D18F', 600: '#006B35' }, amber: { 400: '#EEB154', 600: '#9A5B00' }, red: { 400: '#F97770', 600: '#B8262A' }
  },
  semantic: {
    primary: { 50: '{blue.50}', 100: '{blue.100}', 200: '{blue.200}', 300: '{blue.300}', 400: '{blue.400}', 500: '{blue.500}', 600: '{blue.600}', 700: '{blue.700}', 800: '{blue.800}', 900: '{blue.900}', 950: '{blue.950}' },
    focusRing: { width: '2px', style: 'solid', color: '{primary.300}', offset: '2px' },
    formField: { paddingX: '0.875rem', paddingY: '0.7rem', borderRadius: '{border.radius.md}', focusRing: { width: '3px', style: 'solid', color: 'color-mix(in oklab, {primary.500} 30%, transparent)', offset: '0' } },
    colorScheme: {
      light: {
        surface: { 0: '#FFFFFF', 50: '{ink.50}', 100: '{ink.100}', 200: '{ink.200}', 300: '{ink.300}', 400: '{ink.400}', 500: '{ink.500}', 600: '{ink.600}', 700: '{ink.700}', 800: '{ink.800}', 900: '{ink.900}', 950: '{ink.950}' },
        primary: { color: '#0E1A13', contrastColor: '#FFFFFF', hoverColor: '#22352B', activeColor: '#0C1611' },
        highlight: { background: 'color-mix(in oklab, {primary.500} 14%, #F6F8F3)', focusBackground: 'color-mix(in oklab, {primary.500} 18%, #F6F8F3)', color: '#0E1A13', focusColor: '#0E1A13' },
        text: { color: '#2E3B33', hoverColor: '#0E1A13', mutedColor: '#56645B', hoverMutedColor: '#2E3B33' },
        formField: { background: '#F6F8F3', disabledBackground: '#ECF0E8', filledBackground: '#F6F8F3', borderColor: '#D2D9CC', hoverBorderColor: '{ink.600}', focusBorderColor: '{primary.500}', invalidBorderColor: '{red.600}', color: '#0E1A13', placeholderColor: '#6C7A71', invalidPlaceholderColor: '{red.600}', iconColor: '#6C7A71', shadow: 'none' },
        content: { background: '#FFFFFF', hoverBackground: '#ECF0E8', borderColor: '#E3E8DF', color: '#2E3B33', hoverColor: '#0E1A13' }
      },
      dark: {
        surface: { 0: '#FFFFFF', 50: '{ink.50}', 100: '{ink.100}', 200: '{ink.200}', 300: '{ink.300}', 400: '{ink.400}', 500: '{ink.500}', 600: '{ink.600}', 700: '{ink.700}', 800: '{ink.800}', 900: '{ink.900}', 950: '{ink.950}' },
        primary: { color: '{primary.600}', contrastColor: '#FFFFFF', hoverColor: '{primary.500}', activeColor: '{primary.700}' },
        highlight: { background: 'color-mix(in oklab, {primary.500} 12%, #15231B)', focusBackground: 'color-mix(in oklab, {primary.500} 18%, #15231B)', color: '#ECF3EE', focusColor: '#ECF3EE' },
        text: { color: '#C6D2CB', hoverColor: '#ECF3EE', mutedColor: '#9CAAA1', hoverMutedColor: '#C6D2CB' },
        formField: { background: '#15231B', disabledBackground: '#0E1A13', filledBackground: '#15231B', borderColor: '#2D4336', hoverBorderColor: '{ink.600}', focusBorderColor: '{primary.500}', invalidBorderColor: '{red.400}', color: '#ECF3EE', placeholderColor: '#84938A', invalidPlaceholderColor: '{red.400}', iconColor: '#84938A', shadow: 'none' },
        content: { background: '#0E1A13', hoverBackground: '#1C2D23', borderColor: '#22352A', color: '#C6D2CB', hoverColor: '#ECF3EE' }
      }
    }
  },
  components: {
    button: { root: { borderRadius: '999px', paddingX: '1.375rem', paddingY: '0.75rem', gap: '0.5rem', label: { fontWeight: '600' }, sm: { paddingX: '1rem', paddingY: '0.5rem', fontSize: '0.84rem' } },
              colorScheme: { light: { secondary: { background: 'rgba(14,26,19,.03)', hoverBackground: 'rgba(14,26,19,.07)', borderColor: '#D2D9CC', hoverBorderColor: '{ink.600}', color: '#2E3B33', hoverColor: '#0E1A13' } },
                             dark:  { secondary: { background: 'rgba(255,255,255,.02)', hoverBackground: 'rgba(255,255,255,.06)', borderColor: '#2D4336', hoverBorderColor: '{ink.600}', color: '#C6D2CB', hoverColor: '#ECF3EE' } } } },
    togglebutton: { root: { borderRadius: '{border.radius.lg}', padding: '0.875rem 1rem', gap: '0.25rem' } },
    selectbutton: { root: { borderRadius: '{border.radius.md}' } },
    inputtext: { root: { paddingX: '0.875rem', paddingY: '0.7rem' } },
    tabs: { tab: { padding: '0.55rem 0.9rem', fontWeight: '500', borderWidth: '0 0 1px 0' }, tablist: { background: 'transparent' }, activeBar: { height: '2px' } },
    message: { root: { borderRadius: '{border.radius.md}' }, simple: { content: { padding: '0' } } },
    toast: { root: { borderRadius: '{border.radius.md}', width: 'min(360px, calc(100vw - 32px))' } }
  }
})
