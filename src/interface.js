const projectDeleteButton = () => {
    const list = document.getElementById('list');
    const appMenu = document.getElementById('appMenu');
    const div = document.createElement('div');
    const delProj = document.getElementById('deleteProject');

    if (list.innerHTML == 'All Items') {
        if(delProj != null)
            delProj.remove();
    }
    else if (delProj != null)
        return;
    else {
        div.classList.add('remove');
        div.setAttribute('id', 'deleteProject');
        div.innerHTML = '-';
        appMenu.appendChild(div);
        dbProjDel();
    }
};

//Module that deletes project from DB
const dbProjDel = () => {
    const dbRef = firebase.database().ref().child('projects');
    const deleteProject = document.getElementById('deleteProject');
    const list = document.getElementById('list');

    deleteProject.addEventListener('click', () => {
        let del = confirm('Are you sure you want to delete this project?');
        if(del == true) {
            dbRef.on('value', snapshot => {
                snapshot.forEach( childSnapshot => {
                    const childData = childSnapshot.val();
                    const childKey = childSnapshot.key;
                        
                    if(childData == list.innerHTML)
                        dbRef.child(childKey).remove();
                });
            });
            removeProjects();
            displayProjects();
            document.getElementById('All Items').click();
        };
    });
};

//DOM for new Project
const newProject = (project) => {
    const drawer = document.getElementById('drawer');
    const div = document.createElement('div');

    if (document.getElementById(project) != undefined)
        return;
    
    div.classList.add('projects');
    div.setAttribute('id', project);
    drawer.appendChild(div.cloneNode(true));
    div.removeAttribute('id', project);
    div.classList.remove('projects');
    
    const tabs = document.getElementById(project);
    div.classList.add('selection');
    tabs.appendChild(div.cloneNode(true));
    div.classList.remove('selection');
    div.classList.add('projectTab');
    div.innerHTML = project;
    tabs.appendChild(div.cloneNode(true));
    div.classList.remove('projectTab');
};

//Removes Projects to ReSync from Firebase
const removeProjects = () => {
    const project = document.getElementsByClassName('projects');
    if(Array.from(project).length > 1){
        for(let i = 0; i < Array.from(project).length-1; i++){
            const drawer = document.getElementById('drawer');
            drawer.removeChild(drawer.lastElementChild);
        }
    };
};

//Check Firebase for Projects that already exist and displays them on load
const displayProjects = () => {
    const dbRef = firebase.database().ref();
    const projectRef = dbRef.child('projects');
    projectRef.on('value', function(snapshot) {
        removeProjects();
        snapshot.forEach(function(childSnapshot) {
            const childData = childSnapshot.val();
            newProject(childData);
        });
        currentSelection();
    });
};

//Prompt to submit new Project
const getNewProject = () => {
    const newProj = document.getElementById('newProject')
    newProj.addEventListener('click', () => {
        const project = prompt('New Project Name:');
        if(project == null)
            return;
        projectSubmit(project);
    });
};

//Submits a project to firebase
const projectSubmit = (project) => {
    firebase.database().ref().child('projects').push(project);
    newProject(project);
    currentSelection();
};

const currentSelection = () => {
    const project = document.getElementsByClassName('projects');
    const list = document.getElementById('list');
    Array.from(project).map(x => x.addEventListener('click', () => {
        Array.from(document.getElementsByClassName('currentSelection')).map( x => x.classList.remove('currentSelection'));
        x.classList.add('currentSelection');
        list.innerHTML = x.id;
        projectDeleteButton();
    }));
};

export { currentSelection, newProject , getNewProject, displayProjects, removeProjects, projectSubmit, projectDeleteButton, dbProjDel }