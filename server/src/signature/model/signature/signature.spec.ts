import { Signature } from './signature';

describe('Signature', () => {
  it('should be defined', () => {
    expect(new Signature(new Date().getTime().toString())).toBeDefined();
  });
});
