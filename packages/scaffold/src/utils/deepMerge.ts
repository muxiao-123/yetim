const isObject = (val: unknown) => val && typeof val === 'object'
const mergeArrayWithDedupe = (a: unknown[], b: unknown[]) => Array.from(new Set([...a, ...b]))

/**
 * Recursively merge the content of the new object to the existing one
 * @param {Object} target the existing object
 * @param {Object} obj the new object
 */
function deepMerge(target: Record<string, unknown>, obj: Record<string, unknown>) {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key]
    const newVal = obj[key]

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal)
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal as Record<string, unknown>, newVal as Record<string, unknown>)
    } else {
      target[key] = newVal
    }
  }

  return target
}

export default deepMerge
