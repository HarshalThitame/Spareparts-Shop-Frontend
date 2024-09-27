import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskPartNumber'
})
export class MaskPartNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.length <= 2) return value; // No masking for short part numbers
    return value.slice(0, 2) + '****'; // Mask everything after the first two characters
  }
}
