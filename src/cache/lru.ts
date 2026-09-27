export class LruCache<K, V> {
  private readonly values = new Map<K, V>();

  constructor(readonly capacity = 100) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error("LRU capacity must be a positive integer");
    }
  }

  get(key: K): V | undefined {
    const value = this.values.get(key);
    if (value === undefined) return undefined;
    this.values.delete(key);
    this.values.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.values.has(key)) this.values.delete(key);
    while (this.values.size >= this.capacity) {
      const oldest = this.values.keys().next().value as K | undefined;
      if (oldest === undefined) break;
      this.values.delete(oldest);
    }
    this.values.set(key, value);
  }

  has(key: K): boolean {
    return this.values.has(key);
  }

  delete(key: K): boolean {
    return this.values.delete(key);
  }

  clear(): void {
    this.values.clear();
  }

  get size(): number {
    return this.values.size;
  }
}
