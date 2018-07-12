import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  hospital: Hospital;

  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor
  (
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  )
  {}

  ngOnInit()
  {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( resp => this.cargarHospitales());
  }

  cargarHospitales()
  {
    this.cargando = true;

    this._hospitalService.cargarHospitales(this.desde).subscribe( (resp: any) =>
    {
      this.totalRegistros = this._hospitalService.totalHospitales;
      this.hospitales = resp;
    });

    this.cargando = false;
  }

  cargarHospital(id: string)
  {
    this.cargando = true;

    this._hospitalService.obtenerHospital(id).subscribe( (resp: any) =>
    {
      this.hospital = resp;
    });

    this.cargando = false;
  }

  cambiarDesde(valor: number)
  {
    const desde = this.desde + valor;

    if (desde < 0)
    {
      return;
    }
    else if (desde >= this.totalRegistros)
    {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  buscarHospital(termino: string)
  {
    if (!termino)
    {
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino).subscribe((resp: any) =>
    {
      this.hospitales = resp;
    });
  }

  crearHospital()
  {
    swal({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    })
    .then((hospital: string) =>
    {
      if (!hospital)
      {
        return;
      }

      if (hospital.length <= 0)
      {
        swal('Error', 'Debes de introducir un nombre para crear un hospital', 'error');
      }
      else
      {
        this._hospitalService.crearHospital(hospital).subscribe( (resp: any) =>
        {
          this.cargarHospitales();
        });

      }
    });
  }

  guardarHospital(hospital: Hospital)
  {
    if (!hospital)
    {
      return;
    }

    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  borraHospital(hospital: Hospital)
  {
    if (!hospital)
    {
      return;
    }

    swal({
    title: '¿Está seguro?',
    text: 'Está a punto de borrar ' + hospital.nombre,
    icon: 'warning',
    buttons: true,
    dangerMode: true,
    })
    .then((borrar) =>
    {
      if (borrar)
      {
        this._hospitalService.borrarHospital(hospital._id).subscribe((resp: any) =>
        {
          this.cargarHospitales();
        });
      }
    });
  }

  mostrarModal(id: string)
  {
    this._modalUploadService.mostrarModal('hospitales', id);
  }
}
