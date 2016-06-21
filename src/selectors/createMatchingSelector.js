export default function createMatchingSelector(factories, options, getOwnProps) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const selector = factories[i](options, getOwnProps)
    if (selector) return selector
  }

  return undefined
}
