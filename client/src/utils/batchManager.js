export const BatchManager = {
    batches: new Map(),
    maxBatches: 10,

    add: (key, data) => {
      if (BatchManager.batches.size >= BatchManager.maxBatches) {
        const firstKey = BatchManager.batches.keys().next().value;
        BatchManager.batches.delete(firstKey);
      }
      BatchManager.batches.set(key, data);
    },

    get: (key) => BatchManager.batches.get(key),
    clear: () => BatchManager.batches.clear()
  };