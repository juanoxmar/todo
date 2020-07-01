import _ from 'date-fns';
import { currentSelection, newProject , getNewProject, displayProjects, removeProjects, projectSubmit, projectDeleteButton, dbProjDel } from './interface'
import { formPop, formClick, submitButton, submitItem, item, newItemDisp, specProjDisp, specProj } from './items'
import { getItemData, editFormPop } from './edit'

// Your web app's Firebase configuration
(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyCmGHPq15NU_ghPYD2DIoENoi0-2bUqfag",
        authDomain: "todo-dae92.firebaseapp.com",
        databaseURL: "https://todo-dae92.firebaseio.com",
        projectId: "todo-dae92",
        storageBucket: "todo-dae92.appspot.com",
        messagingSenderId: "416037046386",
        appId: "1:416037046386:web:e308a10e51aef13e1b1aeb"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
})();

displayProjects();
getNewProject();
formClick();
newItemDisp();