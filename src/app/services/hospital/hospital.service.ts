import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService
{
  totalHospitales: number = 0;

  constructor
  (
    public http: HttpClient,
    public _subirArchivoService: SubirArchivoService,
    public _usuarioService: UsuarioService
  )
  {}

  cargarHospitales(desde: number = 0)
  {
    const url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url).pipe(map ((resp: any) =>
    {
      this.totalHospitales = resp.total;
      return resp.hospitales;
    }));
  }

  obtenerHospital(id: string)
  {
    const url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url).pipe(map( (resp: any) =>
    {
      return resp.hospital;
    }));
  }

  buscarHospital(termino: string)
  {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url).pipe(map ((resp: any) =>
    {
    return resp.hospitales;
    }));
  }

  crearHospital(nombre: string)
  {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre}).pipe(map(((resp: any) =>
    {
      swal('Hospital creado', resp.hospital.nombre, 'success');
      return resp.hospital;
    })));
  }

  actualizarHospital(hospital: Hospital)
  {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital).pipe(map( (resp: any) =>
    {
      swal('Hospital actualizado', hospital.nombre, 'success');
      return resp.hospital;
    }));
  }

  borrarHospital(id: string)
  {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(map( resp =>
    {
      swal('Hospital borrado', 'El hospital se ha eliminado correctamente', 'success');
      return true;
    }));
  }
}
