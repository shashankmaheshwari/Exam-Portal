import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private userService:UserService,private snack:MatSnackBar,private router:Router) { }

  public user={
    username:'',
    password:'',
    firstName:'',
    lastName:'',
    email:'',
    phone:'',
  }

  ngOnInit(): void {
  }
  formSubmit() {
   

   if(this.user.username =='' || this.user.username == null){
      //alert("User is required");
      this.snack.open('User name is required','ok',{
        duration:3000,
        verticalPosition:'top',
        horizontalPosition:'right',
      })
      return ;
   }



   // addUser:userservice
   this.userService.addUser(this.user).subscribe(

    (data:any)=>{
      //success
     Swal.fire('Successfully  done !!','User id is '+data.id,'success');
     this.router.navigate(['login']);
      
    },
    (error)=>{
      //error
      console.log(error);
      this.snack.open('something went wrong','ok',{
        duration:3000,
        verticalPosition:'top',
        horizontalPosition:'right',
      })
     
    }
   )
 }


}
