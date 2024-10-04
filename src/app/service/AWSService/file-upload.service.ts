import { Injectable } from '@angular/core';
import baseURL from "../helper/helper";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private apiURL = `${baseURL}/api/admin/presigned-url`

  constructor(private _http:HttpClient) { }

  getPresignedUrl(fileName:string):Observable<string>{
    return this._http.get<string>(`${this.apiURL}/upload/${fileName}`);
  }

  uploadFileToS3(file: File): Observable<any> {
    return new Observable(observer => {
      this.getPresignedUrl(file.name).subscribe(url => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.onload = () => {
          if (xhr.status === 200) {
            observer.next('File uploaded successfully');
            observer.complete();
          } else {
            observer.error('Error uploading file');
          }
        };

        xhr.onerror = () => {
          observer.error('Error uploading file');
        };

        xhr.send(file);
      });
    });
  }
}
