function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}

module.exports = { areWeTestingWithJest };
