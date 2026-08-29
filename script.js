const SUPABASE_URL = "https://zrytzmbfspanylozgmwf.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyeXR6bWJmc3Bhbnlsb3pnbXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NTAwMjIsImV4cCI6MjEwMzQyNjAyMn0.RTmCiHok0XRJlV5bsT_oaf9co7PoDJrao7hRwRvmgD4";

// ===============================
// COMPTEUR MEMBRES ACCUEIL
// ===============================

// ===============================
// COMPTEUR MEMBRES ACCUEIL
// ===============================

async function loadHomeMembersCount(){

const response = await fetch(

SUPABASE_URL + "/rest/v1/members?select=id",

{

headers:{

"apikey":SUPABASE_KEY

}

}

);


const members = await response.json();

console.log("MEMBRES ACCUEIL :", members);


const element = document.getElementById("homeMembersCount");


if(element && Array.isArray(members)){

element.textContent = members.length;

}

}


if(document.getElementById("homeMembersCount")){

loadHomeMembersCount();

}

// ===============================
// INSCRIPTION MEMBRE
// ===============================

const joinForm = document.getElementById("joinForm");

if (joinForm) {

joinForm.addEventListener("submit", async function(e) {

e.preventDefault();


const data = {

first_name: document.querySelector("#firstName").value,

last_name: document.querySelector("#lastName").value,

email: document.querySelector("#email").value,

phone: document.querySelector("#phone").value,

country: document.querySelector("#country").value,

city: document.querySelector("#city").value,

participation: document.querySelector("#participation").value

};



const response = await fetch(

SUPABASE_URL + "/rest/v1/members",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY

},

body:JSON.stringify(data)

}

);



if(response.ok){

window.location.href="merci.html";

}

else{

const error = await response.text();

console.log(error);


if(error.includes("23505")){

document.getElementById("successMessage").textContent =
"Cette adresse e-mail est déjà inscrite à UPS.";

document.getElementById("successMessage").style.color="#C8102E";

}

else{

document.getElementById("successMessage").textContent =
"Une erreur est survenue. Veuillez réessayer.";

}

}

});

}

// ===============================
// SIGNALEMENTS
// ===============================

const reportForm = document.getElementById("reportForm");


if(reportForm){


reportForm.addEventListener("submit", async function(e){


e.preventDefault();


const file = document.getElementById("photo").files[0];


let photoUrl = null;



if(file){


const fileName = Date.now()+"-"+file.name;



const upload = await fetch(

SUPABASE_URL + "/storage/v1/object/reports/" + fileName,

{

method:"POST",

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+SUPABASE_KEY,

"Content-Type":file.type

},

body:file

}

);



if(upload.ok){

photoUrl = SUPABASE_URL + "/storage/v1/object/public/reports/" + fileName;

}

}



const data = {

category:document.getElementById("category").value,

location:document.getElementById("location").value,

date_period:document.getElementById("datePeriod").value,

description:document.getElementById("description").value,

status:"Nouveau",

photo_url:photoUrl

};



const response = await fetch(

SUPABASE_URL + "/rest/v1/reports",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+SUPABASE_KEY

},

body:JSON.stringify(data)

}

);



if(response.ok){


document.getElementById("reportMessage").textContent =
"Votre signalement a bien été envoyé à UPS.";

document.getElementById("reportMessage").style.color="#00853F";

reportForm.reset();


}

else{


console.log(await response.text());

document.getElementById("reportMessage").textContent =
"Une erreur est survenue.";

}


});


}




// ===============================
// CONTACT
// ===============================


const contactForm = document.getElementById("contactForm");


if(contactForm){


contactForm.addEventListener("submit", async function(e){


e.preventDefault();



const data = {


name: document.getElementById("contactName").value,

email: document.getElementById("contactEmail").value,

subject: document.getElementById("contactSubject").value,

message: document.getElementById("contactMessage").value


};



const response = await fetch(

SUPABASE_URL + "/rest/v1/contacts",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+SUPABASE_KEY

},

body:JSON.stringify(data)

}

);



if(response.ok){


document.getElementById("contactResponse").textContent =
"Votre message a bien été envoyé à UPS.";

document.getElementById("contactResponse").style.color="#00853F";

contactForm.reset();


}

else{


console.log(await response.text());

document.getElementById("contactResponse").textContent =
"Une erreur est survenue.";


}


});


}

// ===============================
// CONNEXION ADMIN
// ===============================


const adminLoginForm = document.getElementById("adminLoginForm");


if(adminLoginForm){


adminLoginForm.addEventListener("submit", async function(e){


e.preventDefault();



const email = document.getElementById("adminEmail").value;

const password = document.getElementById("adminPassword").value;



const response = await fetch(

SUPABASE_URL + "/auth/v1/token?grant_type=password",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY

},

body:JSON.stringify({

email:email,

password:password

})

}

);



const result = await response.json();

console.log(result);



if(response.ok){


localStorage.setItem(

"supabase_token",

result.access_token

);



window.location.href="admin.html";


}

else{


document.getElementById("loginMessage").textContent =
"Email ou mot de passe incorrect.";

document.getElementById("loginMessage").style.color="#C8102E";


}


});


}




// ===============================
// PROTECTION ADMIN
// ===============================


const isAdminPage = window.location.pathname.includes("admin.html");


if(isAdminPage){


const token = localStorage.getItem("supabase_token");



if(!token){

window.location.href="admin-login.html";

}


}



// ===============================
// COMPTEURS TOTAUX
// ===============================


async function getCount(table, elementId){


const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + `/rest/v1/${table}?select=*`,

{

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token,

"Prefer":"count=exact"

}

}

);



const count = response.headers.get("content-range");



const element = document.getElementById(elementId);



if(element && count){

element.textContent = count.split("/")[1];

}


}

// PAGINATION ADMIN

let membersPage = 0;
let reportsPage = 0;
let contactsPage = 0;

const limit = 20;

// ===============================
// CHARGER LES 20 DERNIERS MEMBRES
// ===============================


async function loadMembers(){


const token = localStorage.getItem("supabase_token");


const response = await fetch(

    SUPABASE_URL + `/rest/v1/members?select=*&order=created_at.desc&limit=${limit}&offset=${membersPage * limit}`,

{

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token

}

}

);



const members = await response.json();



if(!Array.isArray(members)){

console.log("Erreur membres :", members);

return;

}



const container = document.getElementById("membersList");



if(container){


if(membersPage === 0){
    container.innerHTML="";
}


members.forEach(member=>{


container.innerHTML += `

<article>

<h3>${member.first_name} ${member.last_name}</h3>

<p>Email : ${member.email}</p>

<p>Pays : ${member.country}</p>

<p>Ville : ${member.city}</p>

<p>Téléphone : ${member.phone}</p>

<p>Participation : ${member.participation}</p>

</article>

`;

});


}


}




// ===============================
// CHARGER LES 20 DERNIERS SIGNALEMENTS
// ===============================


async function loadReports(){


const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + `/rest/v1/reports?select=*&order=created_at.desc&limit=${limit}&offset=${reportsPage * limit}`,

{

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token

}

}

);



const reports = await response.json();



if(!Array.isArray(reports)){

console.log("Erreur reports :", reports);

return;

}



const container = document.getElementById("reportsList");



if(container){

if(reportsPage === 0){
    container.innerHTML="";
}


reports.forEach(report=>{


container.innerHTML += `

<article>

<h3>${report.category}</h3>

<p>Lieu : ${report.location}</p>

<p>${report.description}</p>

<p>Statut : ${report.status}</p>

${report.photo_url ? `<img src="${report.photo_url}" width="200">` : ""}

</article>

`;

});


}


}





// ===============================
// CHARGER LES 20 DERNIERS CONTACTS
// ===============================


async function loadContacts(){


const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + `/rest/v1/contacts?select=*&order=created_at.desc&limit=${limit}&offset=${contactsPage * limit}`,

{

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token

}

}

);



const contacts = await response.json();



if(!Array.isArray(contacts)){

console.log("Erreur contacts :", contacts);

return;

}



const container = document.getElementById("contactsList");



if(container){


if(contactsPage === 0){
    container.innerHTML="";
}


contacts.forEach(contact=>{


container.innerHTML += `

<article>

<h3>${contact.subject}</h3>

<p>${contact.name}</p>

<p>${contact.email}</p>

<p>${contact.message}</p>

</article>

`;

});


}


}




// ===============================
// LANCEMENT ADMIN
// ===============================


if(window.location.pathname.includes("admin.html")){


loadMembers();

loadReports();

loadContacts();


getCount("members","membersCount");

getCount("reports","reportsCount");

getCount("contacts","contactsCount");


}


// CHARGER PLUS DE MEMBRES

const loadMoreMembersBtn = document.getElementById("loadMoreMembers");


if(loadMoreMembersBtn){

loadMoreMembersBtn.addEventListener("click", function(){

membersPage++;

loadMembers();

});

}

// CHARGER PLUS DE SIGNALEMENTS

const loadMoreReportsBtn = document.getElementById("loadMoreReports");


if(loadMoreReportsBtn){

loadMoreReportsBtn.addEventListener("click", function(){

reportsPage++;

loadReports();

});

}

// CHARGER PLUS DE CONTACTS

const loadMoreContactsBtn = document.getElementById("loadMoreContacts");


if(loadMoreContactsBtn){

loadMoreContactsBtn.addEventListener("click", function(){

contactsPage++;

loadContacts();

});

}

// ===============================
// DECONNEXION
// ===============================


const logoutBtn = document.getElementById("logoutBtn");


if(logoutBtn){


logoutBtn.addEventListener("click", function(){


localStorage.removeItem("supabase_token");


window.location.href="admin-login.html";


});


}