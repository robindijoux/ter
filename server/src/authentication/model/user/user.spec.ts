import { User } from './user';

describe('User', () => {
  it('should be defined', () => {
    expect(new User('test', 'test', 'test', true)).toBeDefined();
  });
});
