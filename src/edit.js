import { closeForm, specProjDisp, newItemDisp } from './items'
import _ from 'date-fns';

const getItemData = () => {
    const getListItems = document.getElementsByClassName('listItems');
    Array.from(getListItems).map(x => x.addEventListener('click', () => {
        const uid = x.childNodes[0].childNodes[1].id;
        const proj = x.id;

        editFormPop(uid, proj);
        const modal = document.getElementById('form');
        modal.style.display = 'block';
        closeForm();
        subButton(uid, proj);
    }));
};

const editFormPop = (uid, proj) => {
    const div = document.createElement('div');
    const content = document.createElement('div');
    const span = document.createElement('span');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const select = document.createElement('select');
    const option = document.createElement('option');
    const projSel = document.createElement('select');
    const projDrop = document.createElement('option');
    const text = document.createElement('textarea');
    const container = document.getElementsByClassName('container')[0];

    const dbRef = firebase.database().ref().child('list');
    const itemRef = dbRef.child(proj).child(uid);

    let title, desc, date, priority, notes, check;

    itemRef.once('value', snapshot => {
        title = snapshot.val().title;
        desc = snapshot.val().desc;
        date = snapshot.val().date;
        priority = snapshot.val().priority;
        notes = snapshot.val().notes;
        check = snapshot.val().check;
    });

    const projectDropdown = () => {
        firebase.database().ref().child('projects').on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                const childData = childSnapshot.val();
                projDrop.setAttribute('id', childData)

                projDrop.removeAttribute('selected');
                if(childData == proj)
                    projDrop.setAttribute('selected', '');

                projDrop.innerHTML = childData;
                projSel.appendChild(projDrop.cloneNode(true));
            });
        });
    };

    const dbItemDel = () => {
        const deleteItem = document.getElementById('deleteItem');
        const modal = document.getElementById('form');
        const content = document.getElementById('list').innerHTML;

        deleteItem.addEventListener('click', () => {
            let del = confirm('Are you sure you want to delete this item?');
            if(del == true) {
                itemRef.remove();
                if(content == 'All Items')
                    newItemDisp();
                else
                    specProjDisp(proj);
                modal.style.display = 'none'
                modal.remove();
            };
        });
    };

    span.innerHTML = '&times;';
    span.classList.add('close');
    content.appendChild(span);

    label.setAttribute('for', 'proj');
    label.innerHTML = 'Project';
    content.appendChild(label.cloneNode(true));
    projDrop.setAttribute('id', 'none')
    projDrop.innerHTML = 'None';
    projSel.appendChild(projDrop.cloneNode(true));
    projectDropdown();
    projSel.setAttribute('id', 'proj');
    projSel.setAttribute('name', 'proj');
    content.appendChild(projSel);

    label.setAttribute('for', 'title');
    input.setAttribute('value', title);
    label.innerHTML = 'New Item Title';
    content.appendChild(label.cloneNode(true));
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'title');
    input.setAttribute('name', 'title');
    content.appendChild(input.cloneNode(true));

    label.setAttribute('for', 'desc');
    text.innerHTML = desc;
    label.innerHTML = 'Description';
    content.appendChild(label.cloneNode(true));
    text.setAttribute('rows', '4');
    text.setAttribute('id', 'desc');
    text.setAttribute('name', 'desc');
    content.appendChild(text.cloneNode(true));

    label.setAttribute('for', 'date');
    input.setAttribute('value', date);
    label.innerHTML = 'Due Date';
    content.appendChild(label.cloneNode(true));
    input.setAttribute('type', 'date');
    input.setAttribute('id', 'date');
    input.setAttribute('name', 'date');
    content.appendChild(input.cloneNode(true));

    
    label.setAttribute('for', 'priority');
    label.innerHTML = 'Priority';
    content.appendChild(label.cloneNode(true));

    if(priority == 'high')
        option.setAttribute('selected', '');
    option.setAttribute('value', 'high');
    option.innerHTML = 'High';
    select.appendChild(option.cloneNode(true));
    if(priority == 'med')
        option.setAttribute('selected', '');
    option.setAttribute('value', 'med');
    option.innerHTML = 'Medium';
    select.appendChild(option.cloneNode(true));
    if(priority == 'low')
        option.setAttribute('selected', '');
    option.setAttribute('value', 'low');
    option.innerHTML = 'Low';
    select.appendChild(option.cloneNode(true));
    select.setAttribute('id', 'priority');
    select.setAttribute('name', 'priority');
    content.appendChild(select);

    label.setAttribute('for', 'notes');
    text.innerHTML = notes;
    label.innerHTML = 'Notes';
    content.appendChild(label.cloneNode(true));
    text.setAttribute('id', 'notes');
    text.setAttribute('name', 'notes');
    text.setAttribute('rows', '4');
    content.appendChild(text);

    input.removeAttribute('value');
    label.setAttribute('for', 'check');
    label.innerHTML = 'Complete';
    content.appendChild(label.cloneNode(true));
    if(check == true)
        input.setAttribute('checked', '');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', 'check');
    input.setAttribute('name', 'check');
    content.appendChild(input.cloneNode(true));

    input.setAttribute('type', 'submit');
    input.setAttribute('id', 'submitForm');
    input.removeAttribute('name');
    content.appendChild(input.cloneNode(true));

    input.setAttribute('type', 'button');
    input.setAttribute('id', 'deleteItem');
    input.setAttribute('value', 'Delete');
    content.appendChild(input.cloneNode(true));

    content.classList.add('modal-content');
    div.appendChild(content);

    div.classList.add('modal');
    div.setAttribute('id', 'form');
    container.appendChild(div);

    dbItemDel();
};

const editItem = (uid, proj) => { 
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const date = document.getElementById('date').value;
    const priority = document.getElementById('priority').value;
    const notes = document.getElementById('notes').value;
    const check = document.getElementById('check').checked;
    const newProj = document.getElementById('proj').value;
    
    firebase.database().ref().child('list').child(proj).child(uid).remove();

    const dbRef = firebase.database().ref().child('list').child(newProj).child(uid);
    dbRef.child('title').set(title);
    dbRef.child('desc').set(desc);
    dbRef.child('date').set(date);
    dbRef.child('priority').set(priority);
    dbRef.child('notes').set(notes);
    dbRef.child('check').set(check);

    specProjDisp(proj);
};

const subButton = (uid,proj) => {
    const submit = document.getElementById('submitForm');
    const modal = document.getElementById('form');

    submit.addEventListener('click', () => {
        editItem(uid, proj);
        modal.style.display = 'none'
        modal.remove();
    });
};

export { getItemData, editFormPop }
