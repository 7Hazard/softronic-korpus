import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { backend, fetchCustomerGroups } from 'src/backend';
import { getCookie } from 'src/cookies';


@Component({
  selector: 'app-dialog-normalising',
  templateUrl: './dialog-normalising.component.html',
  styleUrls: ['./dialog-normalising.component.styl']
})
export class DialogNormalisingComponent implements OnInit {

  value :string=''; // text input from textbox
  result :string=''; // text input from textbox
  customerGroups = [];
  selectedCustomer: any ;
  customerControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  constructor() { }

  async ngOnInit() {
    this.customerGroups = await fetchCustomerGroups();
    this.selectedCustomer = this.customerGroups[0];
  }

  async translateText(){
    try {
      let response = await backend.post("/translations", { text: this.value, group: this.selectedCustomer.id }, {
        headers: { authorization: `Bearer: ${getCookie("token")}` }
      })
      this.result = response.data.translation;
      if (response.status != 200) {
        alert(response.data);
      }
    } catch (error) {
      alert(error)
    }
  }
  onSelectionChange(selectedCustomer){
    this.customerGroups.filter =  selectedCustomer;
  }

  resetTextBox(){
    this.result='';
  }
}
