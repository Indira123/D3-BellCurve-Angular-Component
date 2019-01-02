import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BellService {
  configUrl: any;
  constructor( private httpClient: HttpClient ) {}
   getBellData() {
    this.configUrl = '../assets/data.json';
    return this.httpClient.get(this.configUrl);
  }
}
