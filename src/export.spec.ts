describe('export.ts', () => {
  it('should be importable', () => {
    const func = jest.fn(() => require('./export'));
    expect(func).not.toThrow();
  });
});
