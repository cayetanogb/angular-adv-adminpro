import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { MedicoService } from 'src/app/services/medico.service';
import { HospitalService } from './../../../services/hospital.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado!: Medico;
  public hospitalSeleccionado!: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });
    this.cargarHospitales();
    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(
        {
          next: hospitalId => {
            this.hospitalSeleccionado = this.hospitales.find(h => h.id === hospitalId)!;
          }
        }
      )
  }

  cargarMedico(id: string) {
    if (id != 'nuevo') {
      this.medicoService.obtenerMedicoById(id)
        .pipe(delay(100))
        .subscribe(
          {
            next: (medico: any) => {
              if (!medico) {
                this.router.navigateByUrl('/dashboard/medicos')
              }
              const { nombre, hospital: { _id } } = medico;
              this.medicoSeleccionado = medico;
              this.medicoForm.setValue({ nombre, hospital: _id });
            }
          }
        )
    }
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe(
        {
          next: (hospitales: Hospital[]) => this.hospitales = hospitales
        }
      )
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      this.medicoService.actualizarMedico(this.medicoSeleccionado._id!, this.medicoForm.value)
        .subscribe(
          {
            next: (resp: any) => {
              Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
            }
          }
        )
    } else {
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe(
          {
            next: (resp: any) => {
              Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
              this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
            }
          }
        )
    }

  }

}
