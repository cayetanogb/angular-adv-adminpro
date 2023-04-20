import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.usuarioService.validarToken()
      .pipe(
        tap((estaAutenticado: any) => {
          if (!estaAutenticado) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    return this.usuarioService.validarToken()
      .pipe(
        tap((estaAutenticado: any) => {
          if (!estaAutenticado) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }

}
