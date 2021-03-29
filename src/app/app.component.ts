import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AzureFaceService } from 'src/services/azure-face-service.service';
/*const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const uuid = require("uuid/v4");*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'azure-web-app';

  @ViewChild('inputImagen')
  inputImagen: ElementRef;
  file: any;
  imageSrc: any;
  jsonRespuesta: any;
  jsonTextarea: any;
  nombreArchivo: any = "Seleccione una imagen...";
  archivoCargado: any;
  headers = new HttpHeaders({'Content-Type': "application/octet-stream", "Ocp-Apim-Subscription-Key": "f12665f204e340a2a03eb6dba1db4a93"});

  /* CONEXIÓN */
  //key = "f12665f204e340a2a03eb6dba1db4a93";
  //endpoint = "https://face-web-app-mgtic.cognitiveservices.azure.com/";
  //urlimage = "https://eltrampolin.es/wp-content/uploads/2018/04/comunicacio%CC%81n-asertiva-grupal-630x321.jpg"; 

  constructor(private azureFaceService: AzureFaceService) {

  }

  cargarArchivo(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
    const reader = new FileReader();
    reader.onload = ((e) => {
      this.jsonRespuesta = undefined;
      this.imageSrc = e.target['result'];
      this.nombreArchivo = fileInput.target.files[0].name;
      this.archivoCargado = true;
      this.file = fileInput.target.files[0];
    });
    reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  async procesarImagen() {
    //const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': this.key } });
    //const client = new Face.FaceClient(credentials, this.endpoint);
    
    //const image_base_url = "https://csdx.blob.core.windows.net/resources/Face/Images/";
    //const person_group_id = uuid();

    /*let detected_faces = await client.face.detectWithUrl(this.urlimage,
      {
        detectionModel: "detection_02",
        recognitionModel: "recognition_03"
      });*/
      
      //let imageSrc = this.imageSrc.split(',')[1];
      /*console.log(this.imageSrc);
      let body = { data : this.imageSrc };*/
      let headers = { headers: this.headers };
      this.azureFaceService.detectarRostros(this.file, headers).subscribe(response => {
        this.jsonRespuesta = response;
        this.jsonTextarea = JSON.stringify(this.jsonRespuesta, undefined, 2);
      }, (error) => {
        console.log(error);
      });
  }

  resetearImagen() {
    this.inputImagen.nativeElement.value = "";
    this.imageSrc = undefined;
    this.nombreArchivo = "Seleccione una imagen...";
    this.archivoCargado = false;
    this.jsonRespuesta = undefined;
  }
}