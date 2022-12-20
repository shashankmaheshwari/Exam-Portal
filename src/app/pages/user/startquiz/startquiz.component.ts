import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import Swal from 'sweetalert2';
import { HostListener } from '@angular/core';
import { ignoreElements } from 'rxjs';

@Component({
  selector: 'app-startquiz',
  templateUrl: './startquiz.component.html',
  styleUrls: ['./startquiz.component.css']
})
export class StartquizComponent implements OnInit {
  qid:any;
  questions:any;

  marksGot=0;
  correctAnswers=0;
  attempted=0;   
  givenAnswer:any; 
  isSubmit=false;     
  timer:any;                   
  elem=document.documentElement;
  warning=0;
  //toggle=true;
  constructor( private locationSt: LocationStrategy,private _route:ActivatedRoute,private _question:QuestionService) { }

  ngOnInit(): void {
   
  
    this.preventBackButton();
    this.qid=this._route.snapshot.params['qid'];
    this.loadQuestions();
    this.fullScreen();
  }
  loadQuestions() {
    this._question.getQuestionOfQuizForTest(this.qid).subscribe(
      (data)=>{
        this.questions=data;
        this.timer=this.questions.length*2*60;
        this.startTimer();
        console.log(this.questions);
        
      },(error)=>{
        Swal.fire("Error","Error in loading question of Quiz","error");
      }

    );
  }
  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }
  submitQuiz(){

    Swal.fire({
      title: 'Do you want to submit the quiz?',
      showCancelButton: true,
      confirmButtonText: `Submit`,
      icon: 'info',
    }).then((e) => {
      if (e.isConfirmed) {
        
        this.evalQuiz();
      }
    });

  }
  evalQuiz(){
    this.makeExitScreen();
    // call to server to evaluate quiz
    this._question.evalQuiz(this.questions).subscribe(
      
      (data:any)=>{
        console.log(data);
        this.marksGot =parseFloat(Number( data.marksGot).toFixed(2));
        this.correctAnswers = data.correctAnswers;
        this.attempted = data.attempted;
        this.isSubmit = true;
        
        
      },(error)=>{
        console.log(error);
        
      }
    )
    

    
  }
  startTimer(){
    let t=window.setInterval(()=>{
      if(this.timer<=0){
        this.exitFullScreen();
        this.evalQuiz();
        clearInterval(t);
      }else{
        this.timer--;
      }
    },1000)
  }
  getFormattedTime() {
    let mm = Math.floor(this.timer / 60);
    let ss = this.timer - mm * 60;
    return `${mm} min : ${ss} sec`;
  }
  printPage(){
    window.print();
  }
  onRightClick(event:any) {
    event.preventDefault();
  }

  
    

 
  fullScreen(){
   if(this.elem.requestFullscreen){
     //this.toggle=false;
     this.elem.requestFullscreen();
   }
  }
  exitFullScreen(){
    if(this.timer>0 && this.isSubmit==false){
      Swal.fire({
        title:  3-this.warning+'  try is left otherwise quiz will be submitted',
  
        showCancelButton: true,
        confirmButtonText: `Exit`,
        icon: 'warning',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          if(this.isDocumentInExitScreenMode()){
             this.warning ++;
          }
           if( 4-this.warning==0){
             Swal.close();
             //showCancelButton: true;
             this.makeExitScreen();
            
             this.evalQuiz();
             return ;
          }
        this.makeExitScreen();
      }
      });
    }
    
  }

   isDocumentInExitScreenMode() {
    return document.fullscreenElement != null;
  }
  makeExitScreen(){
    if(document.exitFullscreen)
    document.exitFullscreen();
  }
 
  

}
