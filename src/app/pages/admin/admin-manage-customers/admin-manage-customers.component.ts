import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User.model";
import {LoginService} from "../../../service/login.service";
import { AdminCustomerService } from '../../../service/AdminService/admin-customer.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from "sweetalert2";

@Component({
  selector: 'app-admin-manage-customers',
  templateUrl: './admin-manage-customers.component.html',
  styleUrl: './admin-manage-customers.component.css'
})
export class AdminManageCustomersComponent implements  OnInit {
  displayedColumns: string[] = ['username', 'fullName', 'email', 'mobile', 'role', 'status'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  users: User[] = [];
  filterValue: string = '';
  roleFilter: string = '';

  constructor(private userService: AdminCustomerService,
              private _snackBar:MatSnackBar) {}

  ngOnInit(): void {
    this.loadAllUsers()
  }


  loadAllUsers() {
    this.userService.getAllUsers().subscribe(data=>{
      this.users = data;
      this.dataSource.data = this.users;
      console.log(data)

    })
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.roleFilter) {
      this.dataSource.data = this.users.filter(user => user.userRole === this.roleFilter);
    } else {
      this.dataSource.data = this.users;
    }
  }



  refreshUsers() {
   this.loadAllUsers();
  }

  updateUser(updatedUser: User) {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser; // Update the user's status in the array
    this.userService.updateUser(updatedUser).subscribe((data)=>{
      this._snackBar.open(`User status is updated`,"",{duration:3000})
    },error => {
      console.log(error)
      this._snackBar.open(`Something went wrong`,"",{duration:3000})
    })
    }
  }

}
