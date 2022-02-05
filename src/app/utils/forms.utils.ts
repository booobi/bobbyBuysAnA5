import { defer, Observable, shareReplay, startWith } from 'rxjs';
import { AbstractControl } from '@angular/forms';

export function createValueStream<T>(control: AbstractControl): Observable<T> {
  return defer(() =>
    control.valueChanges.pipe(
      startWith(control.value),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  );
}
