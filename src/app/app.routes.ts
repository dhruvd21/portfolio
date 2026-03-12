import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Resume } from './components/resume/resume';
import { Experience } from './components/experience/experience';
import { Projects } from './components/projects/projects';


export const routes: Routes = [
    {path:'home', component:Home},
    {path:'resume',component:Resume},
    {path:'experience',component:Experience},
    {path:'skills',component:Projects},
    {path:'', redirectTo:"/home", pathMatch:"full"}
];
