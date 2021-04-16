import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AzureFaceService } from 'src/services/azure-face-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'azure-web-app';

  @ViewChild('inputImagenGrupal')
  inputImagenGrupal: ElementRef;

  @ViewChild('inputImagenIndividual')
  inputImagenIndividual: ElementRef;

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;

  fileGrupal: any;
  fileIndividual: any;
  imageSrcGrupal: any;
  imageSrcIndividual: any;
  nombreArchivoGrupal: any = "Seleccione una imagen...";
  nombreArchivoIndividual: any = "Seleccione una imagen...";
  archivoCargadoGrupal: any;
  archivoCargadoIndividual: any;
  botonCargando = false;
  caraEncontrada = false;

  ctx: CanvasRenderingContext2D;

  jsonRespuesta: any;
  jsonTextarea: any;
  jsonCoincidencia: any;

  faceIdRostro: any;

  /* CONEXIÓN */
  apiKey = "f12665f204e340a2a03eb6dba1db4a93";
  hDetect = new HttpHeaders({'Content-Type': "application/octet-stream", "Ocp-Apim-Subscription-Key": this.apiKey});
  hVerify = new HttpHeaders({'Content-Type': "application/json", "Ocp-Apim-Subscription-Key": this.apiKey});

  constructor(private azureFaceService: AzureFaceService) {
  }

  ngOnInit(): void {
    //this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  cargarArchivoGrupal(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
    const reader = new FileReader();
    reader.onload = ((e) => {
      this.jsonRespuesta = undefined;
      this.jsonTextarea = undefined;
      this.jsonCoincidencia = undefined;
      this.imageSrcGrupal = e.target['result'];
      this.nombreArchivoGrupal = fileInput.target.files[0].name;
      this.archivoCargadoGrupal = true;
      this.fileGrupal = fileInput.target.files[0];
    });
    reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  cargarArchivoIndividual(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
    const reader = new FileReader();
    reader.onload = ((e) => {
      this.jsonRespuesta = undefined;
      this.jsonTextarea = undefined;
      this.jsonCoincidencia = undefined;
      this.imageSrcIndividual = e.target['result'];
      this.nombreArchivoIndividual = fileInput.target.files[0].name;
      this.archivoCargadoIndividual = true;
      this.fileIndividual = fileInput.target.files[0];
    });
    reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  async procesarImagen() {
    if (this.archivoCargadoGrupal && this.archivoCargadoIndividual) {
      this.botonCargando = true;
      let headersDetect = { headers: this.hDetect };
      this.azureFaceService.detectarRostros(this.fileGrupal, headersDetect).subscribe(responseDetect => {
        this.jsonRespuesta = responseDetect;
        this.azureFaceService.detectarRostros(this.fileIndividual, headersDetect).subscribe(responseVerify => {
          responseVerify.forEach(element => {
            this.faceIdRostro = element.faceId;
          });
          this.jsonRespuesta.forEach(element => {
            let faceIds = {
              "faceId1": element.faceId,
              "faceId2": this.faceIdRostro,
              };
            let headersVerify = { headers: this.hVerify };
            this.azureFaceService.verificarRostros(faceIds, headersVerify).subscribe(responseResult => {
              if (responseResult.isIdentical) {
                this.jsonCoincidencia = responseResult;
                this.jsonTextarea = JSON.stringify(responseVerify, undefined, 2);
                this.caraEncontrada = true;
              }
              this.botonCargando = false;
            });
          });
        }, (error) => {
          console.log(error);
        });
      }, (error) => {
        console.log(error);
      });
    }
  }

  resetearImagen() {
    this.inputImagenGrupal.nativeElement.value = "";
    this.inputImagenIndividual.nativeElement.value = "";
    this.imageSrcGrupal = undefined;
    this.imageSrcIndividual = undefined;
    this.nombreArchivoGrupal = "Seleccione una imagen...";
    this.nombreArchivoIndividual = "Seleccione una imagen...";
    this.archivoCargadoGrupal = false;
    this.archivoCargadoIndividual = false;
    this.jsonRespuesta = undefined;
    this.jsonTextarea = undefined;
    this.jsonCoincidencia = undefined;
  }
}