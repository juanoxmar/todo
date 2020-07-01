import { getItemData, editFormPop } from './edit'
import { format, parseISO } from 'date-fns';

const formPop = () => {
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

    const projectDropdown = () => {
        firebase.database().ref().child('projects').on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                const childData = childSnapshot.val();
                projDrop.setAttribute('id', childData)
                projDrop.innerHTML = childData;
                projSel.appendChild(projDrop.cloneNode(true));
            });
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
    label.innerHTML = 'New Item Title';
    content.appendChild(label.cloneNode(true));
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'title');
    input.setAttribute('name', 'title');
    content.appendChild(input.cloneNode(true));

    label.setAttribute('for', 'desc');
    label.innerHTML = 'Description';
    content.appendChild(label.cloneNode(true));
    text.setAttribute('rows', '4');
    text.setAttribute('id', 'desc');
    text.setAttribute('name', 'desc');
    content.appendChild(text.cloneNode(true));

    label.setAttribute('for', 'date');
    label.innerHTML = 'Due Date';
    content.appendChild(label.cloneNode(true));
    input.setAttribute('type', 'date');
    input.setAttribute('id', 'date');
    input.setAttribute('name', 'date');
    content.appendChild(input.cloneNode(true));

    
    label.setAttribute('for', 'priority');
    label.innerHTML = 'Priority';
    content.appendChild(label.cloneNode(true));
    option.setAttribute('value', 'high');
    option.innerHTML = 'High';
    select.appendChild(option.cloneNode(true));
    option.setAttribute('value', 'med');
    option.innerHTML = 'Medium';
    select.appendChild(option.cloneNode(true));
    option.setAttribute('value', 'low');
    option.innerHTML = 'Low';
    select.appendChild(option.cloneNode(true));
    select.setAttribute('id', 'priority');
    select.setAttribute('name', 'priority');
    content.appendChild(select);

    label.setAttribute('for', 'notes');
    label.innerHTML = 'Notes';
    content.appendChild(label.cloneNode(true));
    text.setAttribute('id', 'notes');
    text.setAttribute('name', 'notes');
    text.setAttribute('rows', '4');
    content.appendChild(text);

    label.setAttribute('for', 'check');
    label.innerHTML = 'Complete';
    content.appendChild(label.cloneNode(true));
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', 'check');
    input.setAttribute('name', 'check');
    content.appendChild(input.cloneNode(true));

    input.setAttribute('type', 'submit');
    input.setAttribute('id', 'submitForm');
    input.removeAttribute('name');
    content.appendChild(input.cloneNode(true));

    content.classList.add('modal-content');
    div.appendChild(content);

    div.classList.add('modal');
    div.setAttribute('id', 'form');
    container.appendChild(div);
};

//List of Projects by name on Database


const formClick = () => {
    const nI = document.getElementById('newItem');
    nI.addEventListener('click', () => {
        formPop();
        const modal = document.getElementById('form');
        modal.style.display = 'block';
        closeForm();
        submitButton();
    });
};

const closeForm = () => {
    const modal = document.getElementById('form');
    const close = document.getElementsByClassName('close')[0];

    close.addEventListener('click', () => {
        modal.style.display = 'none'
        modal.remove();
    });
};

const submitItem = () => { 
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const date = document.getElementById('date').value;
    const priority = document.getElementById('priority').value;
    const notes = document.getElementById('notes').value;
    const check = document.getElementById('check').checked;
    const proj = document.getElementById('proj').value;

    const newListItem = new item(title, desc, date, priority, check, notes);
    newListItem.addItemDB(proj);
};

const submitButton = () => {
    const submit = document.getElementById('submitForm');
    const modal = document.getElementById('form');

    submit.addEventListener('click', () => {
        submitItem();
        modal.style.display = 'none'
        modal.remove();
    });
};

class item {
    constructor (title, desc, date, priority, check, notes) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.priority = priority;
        this.check = check;
        this.notes = notes;
    }

    addItemDB (proj) {
        const dbRef = firebase.database().ref();
        const listRef = dbRef.child('list').child('none');
        const projRef = dbRef.child('list').child(proj);
        const listID = dbRef.push().key;

        if(proj == 'None')
            listRef.child(listID).update(this);
        else
            projRef.child(listID).update(this);
    }
};

const newItemDisp = () => {
    const content = document.getElementById('content');
    const dbRef = firebase.database().ref();
    const listRef = dbRef.child('list');
    const div = document.createElement('div');
    const wrap = document.createElement('div');
    const box = document.createElement('div');
    const h2 = document.createElement('h2');
    const h1 = document.createElement('h1');
    const p = document.createElement('p');

    listRef.on('value', function(snapshot) {

        const listCount = document.getElementsByClassName('listItems').length;
        if(listCount > 0){
            for(let i = 0; i < listCount; i++){
                content.removeChild(content.lastElementChild);
            };
        };
        snapshot.forEach(function(childSnapshot) {
            childSnapshot.forEach(function(childchildSnapshot) {
                let childData = childchildSnapshot.val();
                let checkFor;

                if(childData.check == true) {
                    checkFor = 'complete';
                    box.innerHTML = '&#10004;';
                }
                else {
                    checkFor = '';
                    box.innerHTML = '';
                }

                h1.innerHTML = childData.title;
                wrap.appendChild(h1);
                box.setAttribute('class', `compBox ${checkFor}`);
                box.setAttribute('id', childchildSnapshot.key);
                wrap.appendChild(box);
                wrap.classList.add('itemWrap');
                div.appendChild(wrap);
                h2.innerHTML = `Due Date: ${childData.date}`;
                h2.classList.add('dates');
                div.appendChild(h2);
                p.innerHTML = childData.desc;;
                div.appendChild(p);
                
                div.classList.add('listItems');
                div.setAttribute('id', childSnapshot.key)
                content.appendChild(div.cloneNode(true));
            });
        });
        checkItem();
        getItemData();
    });
};

const checkItem = () => {
    const checkBox = document.getElementsByClassName('compBox');
    const dbRef = firebase.database().ref();
    const listRef = dbRef.child('list');

    Array.from(checkBox).map(x => x.addEventListener('click', () => {
        if(x.className.includes('complete') == true) {
            x.innerHTML = '';
            x.classList.toggle('complete');
            listRef.child(x.parentElement.parentElement.id).child(x.id).child('check').set(false);
        }
        else {
            x.innerHTML = '&#10004;';
            x.classList.toggle('complete');
            listRef.child(x.parentElement.parentElement.id).child(x.id).child('check').set(true);
        }
    }));
};

const specProjDisp = (proj) => {
    const content = document.getElementById('content');
    const dbRef = firebase.database().ref();
    const listRef = dbRef.child('list').child(proj);
    const div = document.createElement('div');
    const wrap = document.createElement('div');
    const box = document.createElement('div');
    const h1 = document.createElement('h1');
    const p = document.createElement('p');
    const h2 = document.createElement('h2');

    listRef.on('value', function(snapshot) {
        const listCount = document.getElementsByClassName('listItems').length;
        if(listCount > 0){
            for(let i = 0; i < listCount; i++){
                content.removeChild(content.lastElementChild);
            };
        };
        snapshot.forEach(function(childSnapshot) {
            let childData = childSnapshot.val();
            let checkFor;

            if(childData.check == true) {
                checkFor = 'complete';
                box.innerHTML = '&#10004;';
            }
            else {
                checkFor = '';
                box.innerHTML = '';
            }

            h1.innerHTML = childData.title;
            wrap.appendChild(h1);
            box.setAttribute('class', `compBox ${checkFor}`);
            box.setAttribute('id', childSnapshot.key);
            wrap.appendChild(box);
            wrap.classList.add('itemWrap');
            div.appendChild(wrap);
            h2.innerHTML = `Due Date: ${childData.date}`;
            h2.classList.add('dates');
            div.appendChild(h2);
            p.innerHTML = childData.desc;
            div.appendChild(p);
            
            div.classList.add('listItems');
            div.setAttribute('id', snapshot.key)
            content.appendChild(div.cloneNode(true));
        });
    });
    checkItem();
    getItemData();
};

const specProj = () => {
    const projE = document.getElementsByClassName('projects');
    Array.from(projE).map(x => x.addEventListener('click', () => {
        if(x.id == 'All Items')
            newItemDisp();
        else
            specProjDisp(x.id);
    }));
};

export { formPop, formClick, submitButton, submitItem, item, newItemDisp, closeForm, specProjDisp, specProj }
