import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureFaceService {

  urlAzureApi: any = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,emotion&recognitionModel=recognition_04&returnRecognitionModel=false&detectionModel=detection_01&faceIdTimeToLive=86400";

  constructor(private http: HttpClient) {
  }

  public detectarRostros(body: any, headers?): Observable<any> {
    return this.http.post<any>(this.urlAzureApi, body, headers);
  }
}