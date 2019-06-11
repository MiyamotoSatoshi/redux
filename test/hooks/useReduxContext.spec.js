import React from 'react'
import * as rtl from 'react-testing-library'
import { useReduxContext } from '../../src/hooks/useReduxContext'

describe('React', () => {
  describe('hooks', () => {
    describe('useReduxContext', () => {
      afterEach(() => rtl.cleanup())

      it('throws if component is not wrapped in provider', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const Comp = () => {
          useReduxContext()
          return <div />
        }

        expect(() => rtl.render(<Comp />)).toThrow(
          /could not find react-redux context value/
        )

        spy.mockRestore()
      })
    })
  })
})
