import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubida!: File;
  public imgTemp: any = '';

  constructor(public modalImagenService: ModalImagenService, public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: File) {
    this.imagenSubida = file;

    if (!file) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubida, tipo, id)
      .then(img => {
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch(err => Swal.fire('Error', err.error.msg, 'error'));
  }

}
