import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import Cookies from 'js-cookie'

import { DEFAULT_THEME, MODE_TYPES, THEMES_LIST } from '~/conf'

interface ThemeSelectorProps {
  btn?: { className?: string }
}

export default component$(
  ({ btn: { className } = { className: '' } }: ThemeSelectorProps) => {
    const themeSelected = useSignal(DEFAULT_THEME)

    useVisibleTask$(() => {
      themeSelected.value = Cookies.get('data-theme') ?? DEFAULT_THEME
    })

    const handleChangeTheme$: any = (theme: string) =>
      $(() => {
        document.documentElement.setAttribute('data-theme', theme)
        Cookies.set('data-theme', theme, { expires: 365, path: '/' })

        themeSelected.value = theme

        const selected =
          THEMES_LIST.find(({ theme: th }) => th === theme)?.mode ??
          MODE_TYPES.LIGHT

        const swapMousePopper = (mode: string) => {
          if (mode === MODE_TYPES.DARK) {
            document.documentElement.style.setProperty('--mix-blend', 'lighten')
            localStorage.setItem('mix-blend', 'lighten')
          } else {
            document.documentElement.style.setProperty('--mix-blend', 'darken')
            localStorage.setItem('mix-blend', 'darken')
          }
        }

        swapMousePopper(selected)
      })


    return (
      <div title="Change Theme" class="dropdown-end dropdown">
      </div>
    )
  }
)
