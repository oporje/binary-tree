import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Read  text file

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {

  constructor(public http: HttpClient) {}

  getTextFromFile() {
    return this.http.get('assets/input.txt', {responseType: 'text'});
  }
}
