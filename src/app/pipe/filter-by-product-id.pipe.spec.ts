import { FilterByProductIDPipe } from './filter-by-product-id.pipe';

describe('FilterByProductIDPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByProductIDPipe();
    expect(pipe).toBeTruthy();
  });
});
