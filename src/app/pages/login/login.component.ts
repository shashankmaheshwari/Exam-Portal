import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginData={
    username:'',
    password:'',
  };
  constructor(private snack:MatSnackBar,private login:LoginService, private router:Router) { }

  ngOnInit(): void {
  }
  formSubmit(){
    console.log("login btn clicked");
    if(this.loginData.username.trim()==''|| this.loginData.username==null) {
        this.snack.open('Username is required !!','',{
          duration:3000,
        });
        return ;
    } 
    if(this.loginData.password.trim()==''|| this.loginData.password==null) {
      this.snack.open('Password is required !!','',{
        duration:3000,
      });
      return ;
    } 

    // request to server to generate token
    this.login.generateToken(this.loginData).subscribe(
       (data:any)=>{
        console.log("success");
        console.log(data);

        // login ....
        this.login.loginUser(data.token);

        this.login.getCurrentUSer().subscribe(
          (user:any)=>{
            this.login.setUser(user);
            console.log("Printitng the user details of current user");
            console.log(user);
            //  redirect ..... ADMIN: admin-dashboard
            // redirect ...... NORMAL: normal-dashboard
            if(this.login.getUserRole()=="ADMIN"){
              // admin dashboard
              //1 to navigate but it will reload the components
             // window.location.href='/admin';
            // 2 way to navigate but it will not reload the components
            this.router.navigate(['admin']);
            this.login.loginStatusSubject.next(true);

            }else if(this.login.getUserRole()=="NORMAL"){
              // NORMAL user dashboard
              //window.location.href='/user-dashboard';
              this.router.navigate(['user-dashboard/0']);
              this.login.loginStatusSubject.next(true);

            }else{
               this.login.logout();
             
            }
          }
        )

       },
       (error)=>{
        console.log("Error",error);
        this.snack.open ('Invalid Details !! Try Again',' ',{
          duration:3000,
        });
       }
    );


  }

}
