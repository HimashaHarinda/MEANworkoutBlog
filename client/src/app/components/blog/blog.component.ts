import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  processing = false;
  username;

  constructor(
    private fromBuilder:FormBuilder,
    private authService:AuthService,
    private blogService:BlogService
  ) { 
    this.createNewBlogForm();
  }

  createNewBlogForm(){
    this.form = this.fromBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation

      ])],
      body:['',Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])],

      route:[""],
      distance:["",Validators.compose([
        this.distanceCharacterValidation
      ])],
      hrate:["",Validators.compose([
        this.distanceCharacterValidation
      ])]
    })
  }

  enableFormNewBlogForm(){
    this.form.get('title').enable();
    this.form.get('body').enable();
    this.form.get('route').enable();
    this.form.get('distance').enable();
    this.form.get('hrate').enable();

  }

  disableFormNewBlogForm(){
    this.form.get('title').disable();
    this.form.get('body').disable();
    this.form.get('route').disable();
    this.form.get('distance').disable();
    this.form.get('hrate').disable();
  }

  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;

    }else{
      return {'alphaNumericValidation': true}
    }
  }

  distanceCharacterValidation(controls){
    const regExp = new RegExp(/^[0-9]*$/);
    if (regExp.test(controls.value)) {
      return null;
    }
    else{
      return {'distanceCharacterValidation': true}
    }
  }

  newBlogForm(){
    this.newPost = true;
  }

  reloadBlogs(){
    this.loadingBlogs = true;
    setTimeout(()=>{
      this.loadingBlogs = false;
    }, 4000);
  }

  draftComment(){
    
  }

  onBlogSubmit(){
    this.processing = true;
    this.disableFormNewBlogForm();

    const blog = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      route: this.form.get('route').value, // route field
      distance: this.form.get('distance').value, // route field
      hrate:this.form.get('hrate').value, // heart rate field
      createdBy: this.username // CreatedBy field
    }

    this.blogService.newBlog(blog).subscribe(data => {
      // Check if blog was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewBlogForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message 
        // Clear form data after two seconds
        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewBlogForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  goBack(){
    window.location.reload();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile =>{
      this.username = profile.user.username;
    })
  }

}
