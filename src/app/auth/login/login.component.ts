import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        "282160550830-9b6am4ri4ru1u11h5c6sggsl4bvpbgs4.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(
        {
          next: () => { this.router.navigateByUrl('/'); }
        }
      )
  }

  login() {
    this.usuarioService.login(this.loginForm.value)
      .subscribe(
        {
          next: resp => {
            if (this.loginForm.get('remember')!.value) {
              localStorage.setItem('email', this.loginForm.get('email')!.value);
            } else {
              localStorage.removeItem('email');
            }

            this.router.navigateByUrl('/');
          },
          error: (err) => {
            // Si sucede un error
            Swal.fire('Error', err.error.msg, 'error');
          }
        }
      )
  }

}
