import { HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AzureFaceService } from 'src/services/azure-face-service.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'azure-web-app';
  @ViewChild('inputImagenGrupal') inputImagenGrupal: ElementRef;
  @ViewChild('inputImagenIndividual') inputImagenIndividual: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('modalVerImagen', { 'static': false }) modalVerImagen: ModalDirective;
  fileGrupal: any;
  fileIndividual: any;
  imageSrcGrupal: any;
  imageSrcIndividual: any;
  nombreArchivoGrupal: any = "Seleccione una imagen...";
  nombreArchivoIndividual: any = "Seleccione una imagen...";
  archivoCargadoGrupal: any;
  archivoCargadoIndividual: any;
  botonCargando = false;
  caraEncontrada: any;
  ctx: CanvasRenderingContext2D;
  jsonRespuesta: any;
  jsonTextarea: any;
  jsonCoincidencia: any;
  elementoEncontrado: any;
  faceIdRostro: any;
  img = new Image();
  porcentaje: any;

  /* CONEXIÓN */
  apiKey = "626a4bd9ba6049249fcaf342af2b13f9";
  hDetect = new HttpHeaders({'Content-Type': "application/octet-stream", "Ocp-Apim-Subscription-Key": this.apiKey});
  hVerify = new HttpHeaders({'Content-Type': "application/json", "Ocp-Apim-Subscription-Key": this.apiKey});

  constructor(private azureFaceService: AzureFaceService) {
  }

  ngAfterViewInit(): void {
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
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
    this.jsonRespuesta = undefined;
    if (this.archivoCargadoGrupal && this.archivoCargadoIndividual) {
      this.botonCargando = true;
      let headersDetect = { headers: this.hDetect };
      this.azureFaceService.detectarRostros(this.fileGrupal, headersDetect).subscribe(responseDetect => {
        this.jsonRespuesta = responseDetect;
        this.azureFaceService.detectarRostros(this.fileIndividual, headersDetect).subscribe(responseVerify => {
          responseVerify.forEach(element => {
            this.faceIdRostro = element.faceId;
          }); 
          this.jsonRespuesta.forEach(elementDetect => {
            let faceIds = {
              "faceId1": elementDetect.faceId,
              "faceId2": this.faceIdRostro,
              };
            let headersVerify = { headers: this.hVerify };
            this.azureFaceService.verificarRostros(faceIds, headersVerify).subscribe(responseResult => {
              if (responseResult.isIdentical) {
                this.elementoEncontrado = elementDetect;
                this.jsonTextarea = JSON.stringify(elementDetect, undefined, 2);
                this.jsonCoincidencia = JSON.stringify(responseResult, undefined, 2);
                this.porcentaje = responseResult.confidence;
                this.caraEncontrada = true;
                this.img.src = this.imageSrcGrupal;
			        	this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
                this.ctx.strokeStyle = 'blue';
                this.ctx.strokeRect(this.elementoEncontrado['faceRectangle'].left, this.elementoEncontrado['faceRectangle'].top, this.elementoEncontrado['faceRectangle'].width, this.elementoEncontrado['faceRectangle'].height);
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
    this.caraEncontrada = undefined;
  }

  mostrarImagen(){
    this.modalVerImagen.show();
  }
}