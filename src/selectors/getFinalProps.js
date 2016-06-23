import shallowEqual from '../utils/shallowEqual'

export function createImpureFinalPropsSelector({ getState, getDispatch, getOwnProps, mergeProps }) {
  return function impureSelector(state, props, dispatch) {
    return mergeProps(
      getState(state, props, dispatch),
      getDispatch(state, props, dispatch),
      getOwnProps(state, props, dispatch)
    )
  }
}

export function createPureFinalPropsSelector({ getState, getDispatch, getOwnProps, mergeProps }) {
  let lastOwn = undefined
  let lastState = undefined
  let lastDispatch = undefined
  let lastMerged = undefined
  let lastResult = undefined
  return function pureSelector(state, props, dispatch) {
    const nextOwn = getOwnProps(state, props, dispatch)
    const nextState = getState(state, props, dispatch)
    const nextDispatch = getDispatch(state, props, dispatch)

    if (lastOwn !== nextOwn || lastState !== nextState || lastDispatch !== nextDispatch) {
      const nextMerged = mergeProps(nextState, nextDispatch, nextOwn)
      if (!lastMerged || !shallowEqual(lastMerged, nextMerged)) {
        lastResult = nextMerged
      }
      lastMerged = nextMerged
    }
    lastOwn = nextOwn
    lastState = nextState
    lastDispatch = nextDispatch
    return lastResult
  }
}

export function createFinalPropsSelector(options) {
  return options.pure
    ? createPureFinalPropsSelector(options)
    : createImpureFinalPropsSelector(options)
}

export function memoizeFinalPropsSelector(selector, enhance) {
  let lastProps = undefined
  let lastResult = undefined

  return function memoize(state, ownProps, dispatch) {
    const nextProps = selector(state, ownProps, dispatch)

    // wrap the source selector in a shallow equals because props objects with same properties are
    // semantically equal to React... no need to return a new object.
    if (!lastProps || !shallowEqual(lastProps, nextProps)) {
      lastResult = enhance(nextProps)
    }
    lastProps = nextProps

    return lastResult
  }
}
