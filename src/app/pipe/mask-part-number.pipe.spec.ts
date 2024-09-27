import { MaskPartNumberPipe } from './mask-part-number.pipe';

describe('MaskPartNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskPartNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
