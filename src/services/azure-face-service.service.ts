import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureFaceService {

  urlAzureApiDetect: any = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,emotion&recognitionModel=recognition_04&returnRecognitionModel=false&detectionModel=detection_01&faceIdTimeToLive=86400";
  urlAzureApiVerify: any = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/verify";

  constructor(private http: HttpClient) {
  }

  public detectarRostros(body: any, headers?): Observable<any> {
    return this.http.post<any>(this.urlAzureApiDetect, body, headers);
  }

  public verificarRostros(body: any, headers?): Observable<any> {
    return this.http.post<any>(this.urlAzureApiVerify, body, headers);
  }
}