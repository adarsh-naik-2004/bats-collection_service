export function mapToObject(
    map: Map<string, unknown>,
): Record<string, unknown> {
    const obj: Record<string, unknown> = {}
    for (const [key, value] of map) {
        obj[key] =
            value instanceof Map
                ? mapToObject(value as Map<string, unknown>)
                : value
    }
    return obj
}
