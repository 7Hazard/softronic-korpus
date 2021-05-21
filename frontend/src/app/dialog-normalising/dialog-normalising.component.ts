import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { backend } from 'src/backend';


@Component({
  selector: 'app-dialog-normalising',
  templateUrl: './dialog-normalising.component.html',
  styleUrls: ['./dialog-normalising.component.styl']
})
export class DialogNormalisingComponent implements OnInit {

  value :string=''; // text input from textbox
  result :string=''; // text input from textbox
  customerGroups = [];
  selectedCustomer: string = '';
  customerControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  constructor() { }

  async ngOnInit() {
    this.customerGroups = await this.fetchCustomerGroups();
  }

  async fetchCustomerGroups() {
    try {
      let response = await backend.get("/groups")
      if (response.status != 200)
        alert(response.data)
      else {
        return response.data;
      }
    } catch (error) {
      alert(error)
    }
  }

  translateText(){

  }

  resetTextBox(){

  }

  onSelectionChange(selectedCustomer){ 
    alert(selectedCustomer);
  }

}
