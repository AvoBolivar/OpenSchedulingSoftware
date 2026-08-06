import { createElement } from 'react'
import type { ReactElement } from 'react'
import { render as rtlRender } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '../components/themeProvider/themeProvider'

export function render(ui: ReactElement, options?: RenderOptions) {
  return rtlRender(ui, {
    wrapper: ({ children }) => createElement(ThemeProvider, null, children),
    ...options,
  })
}

export * from '@testing-library/react'
