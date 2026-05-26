import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'jsonPretty',
  standalone: true,
})
export class JsonPrettyPipe implements PipeTransform {
  transform(value: unknown): string {
    return JSON.stringify(value, null, 2)
  }
}