import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getCookie, setCookie } from 'src/cookies';
import { backend } from 'src/backend';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  signinForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  })
  signupForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    repassword: new FormControl(),
  })

  async signin() {
    if (!this.signinForm.valid) return
    try {
      let response = await backend.post("/signin", {
        username: this.signinForm.get("username").value,
        password: this.signinForm.get("password").value
      })
      if (response.status == 200) {
        setCookie("token", response.data.token, 1)
      }
    } catch (error) {
      alert(error)
    }
  }

  async signup() {
    if (!this.signupForm.valid) return
    try {
      let response = await backend.post("/signup", {
        username: this.signupForm.get("username").value,
        password: this.signupForm.get("password").value
      })
      if(response.status == 200){
        alert('Successful Sign up');
      }else if(response.status != 200){
        alert('Sign up failed');
      }
    } catch (error) {
      alert(error)
    }
  }

  isSignedIn() {
    return getCookie("token") != null
  }

  validatePassword(){
    return this.signupForm.get('password').value === this.signupForm.get('repassword').value;
  }
}
