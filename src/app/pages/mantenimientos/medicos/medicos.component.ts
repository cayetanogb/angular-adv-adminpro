import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';

import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from './../../../services/busquedas.service';
import { ModalImagenService } from './../../../services/modal-imagen.service';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  private imgSubs!: Subscription;

  constructor(private medicosService: MedicoService, private modalImagenService: ModalImagenService, private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe({ next: () => this.cargarMedicos() });
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicosService.cargarMedicos()
      .subscribe(
        {
          next: medicos => {
            this.cargando = false;
            this.medicos = medicos;
          }
        }
      )
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.medicos = this.medicosTemp;
      return;
    }

    this.busquedasService.buscar('medicos', termino)
      .subscribe(
        { next: (resp: Medico[]) => this.medicos = resp }
      )
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Quieres borrar el medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosService.borrarMedico(medico._id!)
          .subscribe(
            {
              next: () => {
                this.cargarMedicos();
                Swal.fire(
                  'Medico borrado',
                  `${medico.nombre} fue eliminado correctamente`,
                  'success'
                );
              }
            }
          )
      }
    })
  }

}
