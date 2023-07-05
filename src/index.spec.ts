describe('index.ts', () => {
  it('should be importable', () => {
    const func = jest.fn(() => require('./index'));
    expect(func).not.toThrow();
  });
});
