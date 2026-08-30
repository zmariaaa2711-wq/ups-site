const SUPABASE_URL = "https://zrytzmbfspanylozgmwf.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyeXR6bWJmc3Bhbnlsb3pnbXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NTAwMjIsImV4cCI6MjEwMzQyNjAyMn0.RTmCiHok0XRJlV5bsT_oaf9co7PoDJrao7hRwRvmgD4";


// ===============================
// COMPTEUR MEMBRES ACCUEIL
// ===============================
async function loadHomeMembersCount(){

const response = await fetch(

SUPABASE_URL + "/rest/v1/members?select=id",

{

headers:{

"apikey":SUPABASE_KEY,

"Prefer":"count=exact",

"Range":"0-0"

}

}

);


const count = response.headers.get("content-range");


const element = document.getElementById("homeMembersCount");


if(element && count){

element.textContent = count.split("/")[1];

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


const fileName = Date.now() + "-" + file.name
.replace(/\s+/g, "-")
.replace(/[éèêë]/g, "e")
.replace(/[àâä]/g, "a")
.replace(/[îï]/g, "i")
.replace(/[ôö]/g, "o")
.replace(/[ùûü]/g, "u")
.replace(/[()]/g, "");



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
// ADHESION MEMBRE
// ===============================

const membershipForm = document.getElementById("membershipForm");


if(membershipForm){


membershipForm.addEventListener("submit", async function(e){


e.preventDefault();



const photo = document.getElementById("memberPhoto").files[0];

const idFront = document.getElementById("idCardFront").files[0];

const idBack = document.getElementById("idCardBack").files[0];



let photoUrl = null;

let idFrontUrl = null;

let idBackUrl = null;



async function uploadFile(file, bucket){


const cleanName = file.name
.replace(/[^a-zA-Z0-9.-]/g, "-");

const fileName = Date.now() + "-" + cleanName;



const upload = await fetch(

SUPABASE_URL + "/storage/v1/object/" + bucket + "/" + fileName,

{

method:"POST",

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + SUPABASE_KEY,

"Content-Type":file.type

},

body:file

}

);



if(upload.ok){

if(bucket === "member_photos"){

return SUPABASE_URL +
"/storage/v1/object/public/" +
bucket +
"/" +
fileName;

}

else{

return fileName;

}

}


else{


console.log(await upload.text());

return null;


}


}




if(photo){

photoUrl = await uploadFile(photo,"member_photos");

}


if(idFront){

idFrontUrl = await uploadFile(idFront,"identity_documents");

}


if(idBack){

idBackUrl = await uploadFile(idBack,"identity_documents");

}



const data = {


first_name:
document.getElementById("memberFirstName").value,


last_name:
document.getElementById("memberLastName").value,


birth_date:
document.getElementById("memberBirthDate").value,


profession:
document.getElementById("memberProfession").value,


email:
document.getElementById("memberEmail").value,


phone:
document.getElementById("memberPhone").value,


country:
document.getElementById("memberCountry").value,


city:
document.getElementById("memberCity").value,


profile_photo_url:
photoUrl,


id_card_front_url:
idFrontUrl,


id_card_back_url:
idBackUrl,


status:"En attente"


};



const response = await fetch(

SUPABASE_URL + "/rest/v1/membership_requests",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY

},

body:JSON.stringify(data)

}

);



const message = document.getElementById("membershipMessage");



if(response.ok){

message.textContent =
"Votre demande d'adhésion a bien été prise en compte. Notre équipe va étudier votre demande et vous recontactera prochainement afin de finaliser votre adhésion.";

message.style.color="#00853F";

membershipForm.reset();

}


else{


console.log(await response.text());


message.textContent =
"Une erreur est survenue.";


message.style.color="#C8102E";


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
let postsPage = 0;
let commentsPage = 0;

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

// CHARGER PLUS D'ACTUALITES

const loadMorePostsBtn = document.getElementById("loadMorePosts");

if(loadMorePostsBtn){

loadMorePostsBtn.addEventListener("click", function(){

postsPage++;

loadPostsAdmin();

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
// ACTUALITÉS UPS
// ===============================

async function loadPosts() {

const response = await fetch(

SUPABASE_URL + `/rest/v1/posts?select=*&order=created_at.desc&limit=${limit}&offset=${postsPage * limit}`,

{

headers:{

"apikey":SUPABASE_KEY

}

}

);

const posts = await response.json();

console.log("POSTS RECUS :", posts);

const container = document.getElementById("postsList");

if(!container) return;

container.innerHTML = "";

if(posts.length === 0){

container.innerHTML = "<p>Aucune actualité n'a encore été publiée.</p>";

return;

}

posts.forEach(post=>{

container.innerHTML += `

<article class="post">

<h2>${post.title}</h2>

<p>${new Date(post.created_at).toLocaleDateString("fr-FR")}</p>

${post.image_url ? `<img src="${post.image_url}" class="post-image">` : ""}

<p>${post.content}</p>

${post.video_url ? `
<iframe
width="100%"
height="400"
src="${post.video_url}"
frameborder="0"
allowfullscreen>
</iframe>
` : ""}

<div class="likes">

<button class="likeButton" onclick="addLike(${post.id})">

<span id="heart-${post.id}">♡</span>

<span id="likes-${post.id}">0</span>

</button>

</div>

<div class="share-buttons">

<button onclick="sharePost('${post.title}')">
🔗 Partager
</button>

<button onclick="copyPostLink()">
📋 Copier le lien
</button>

</div>


<div class="comments">

<h3>Commentaires</h3>

<div id="comments-${post.id}">
Chargement des commentaires...
</div>

<form class="commentForm" data-post="${post.id}">

<input 
type="text"
class="commentName"
placeholder="Votre prénom"
required>

<textarea
class="commentMessage"
placeholder="Votre commentaire"
required></textarea>

<button type="submit">
Envoyer
</button>

</form>

</div>

</article>

`;

loadComments(post.id);

loadLikes(post.id);

});

}

if(window.location.pathname.includes("actualites.html")){

loadPosts();

}


// ===============================
// PUBLIER UNE ACTUALITÉ
// ===============================

const postForm = document.getElementById("postForm");

if(postForm){

postForm.addEventListener("submit", async function(e){

e.preventDefault();

const file = document.getElementById("postImage").files[0];

let imageUrl = null;

if(file){

    const fileName = Date.now() + "-" + file.name
.replace(/\s+/g, "-")
.replace(/[éèêë]/g, "e")
.replace(/[àâä]/g, "a")
.replace(/[îï]/g, "i")
.replace(/[ôö]/g, "o")
.replace(/[ùûü]/g, "u")
.replace(/[()]/g, "");

const upload = await fetch(

SUPABASE_URL + "/storage/v1/object/posts/" + fileName,

{

method:"POST",

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + SUPABASE_KEY,

"Content-Type":file.type

},

body:file

}

);

if(upload.ok){

imageUrl =
SUPABASE_URL +
"/storage/v1/object/public/posts/" +
fileName;

}
else{

console.log("ERREUR UPLOAD IMAGE :");

console.log(await upload.text());

}

}

const data = {

title:document.getElementById("postTitle").value,

content:document.getElementById("postContent").value,

image_url:imageUrl,

video_url:document.getElementById("postVideo").value

};

const response = await fetch(

SUPABASE_URL + "/rest/v1/posts",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + localStorage.getItem("supabase_token")

},

body:JSON.stringify(data)

}

);

if(response.ok){

document.getElementById("postMessage").textContent =
"Actualité publiée avec succès.";

document.getElementById("postMessage").style.color="#00853F";

postForm.reset();

}

else{

console.log(await response.text());

document.getElementById("postMessage").textContent =
"Erreur lors de la publication.";

}

});

}

// ===============================
// CHARGER LES ACTUALITÉS ADMIN
// ===============================

async function loadPostsAdmin(){

const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + `/rest/v1/posts?select=*&order=created_at.desc&limit=${limit}&offset=${postsPage * limit}`,

{

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token

}

}

);


const posts = await response.json();

console.log("POSTS ADMIN :", posts);


const container = document.getElementById("postsListAdmin");

console.log("CONTAINER ADMIN :", container);

if(container){

if(postsPage === 0){
    container.innerHTML="";
}


posts.forEach(post=>{


container.innerHTML += `

<article>

<h3>${post.title}</h3>

<p>${post.content}</p>

<button onclick="deletePost(${post.id})">
Supprimer
</button>

</article>

`;

});


}

}

async function deletePost(id){


const confirmation = confirm(
"Supprimer cette actualité ?"
);


if(!confirmation){
return;
}


const response = await fetch(

SUPABASE_URL + "/rest/v1/posts?id=eq."+id,

{

method:"DELETE",

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+localStorage.getItem("supabase_token")

}

}

);

if(response.ok){

const message = document.createElement("p");

message.textContent = "Actualité supprimée avec succès.";

message.style.color = "#00853F";

document.querySelector("h2").after(message);

loadPostsAdmin();

}


else{

console.log(await response.text());

alert("Erreur suppression.");

}


}

// CHARGER PLUS DE COMMENTAIRES

const loadMoreCommentsBtn = document.getElementById("loadMoreComments");


if(loadMoreCommentsBtn){

loadMoreCommentsBtn.addEventListener("click", function(){

commentsPage++;

loadAdminComments();

});

}

// ===============================
// LANCEMENT ADMIN
// ===============================

if(window.location.pathname.includes("admin.html")){

loadMembers();

loadReports();

loadContacts();

loadPostsAdmin();

getCount("members","membersCount");

getCount("reports","reportsCount");

getCount("contacts","contactsCount");

}

// ===============================
// REPONDRE A UN COMMENTAIRE
// ===============================

async function replyComment(id){

const reply = prompt("Votre réponse UPS :");


if(!reply){

return;

}


const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + "/rest/v1/comments?id=eq."+id,

{

method:"PATCH",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token

},

body:JSON.stringify({

admin_reply: reply

})

}

);


if(response.ok){

alert("Réponse publiée.");

loadAdminComments();

}

else{

console.log(await response.text());

alert("Erreur lors de la réponse.");

}


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

// ===============================
// COMMENTAIRES ACTUALITES
// ===============================

document.addEventListener("submit", async function(e){

if(e.target.classList.contains("commentForm")){

e.preventDefault();


const form = e.target;


const data = {

post_id: form.dataset.post,

name: form.querySelector(".commentName").value,

message: form.querySelector(".commentMessage").value

};


const response = await fetch(

SUPABASE_URL + "/rest/v1/comments",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + SUPABASE_KEY

},

body:JSON.stringify(data)

}

);


if(response.ok){ 

const message = document.createElement("p");

message.textContent = "Votre commentaire a bien été publié.";

message.style.color = "#00853F";

form.appendChild(message);

form.reset();

}

else{

console.log(await response.text());

alert("Erreur lors de l'envoi.");

}


}

});

// ===============================
// AFFICHER LES COMMENTAIRES
// ===============================

async function loadComments(postId){

const response = await fetch(

SUPABASE_URL + `/rest/v1/comments?select=*&post_id=eq.${postId}&order=created_at.desc`,

{

headers:{

"apikey":SUPABASE_KEY

}

}

);


const comments = await response.json();

console.log("COMMENTAIRES RECUS :", comments);

const container = document.getElementById("comments-" + postId);


if(!container) return;


container.innerHTML = "";


if(comments.length === 0){

container.innerHTML = "<p>Aucun commentaire pour le moment.</p>";

return;

}


comments.forEach(comment=>{

container.innerHTML += `

<div class="comment">

<strong>${comment.name}</strong>

<p>${comment.message}</p>

${
comment.admin_reply
?
`
<div class="adminReply">

<div class="adminReplyHeader">
UPS (Administrateur)
</div>

<p>${comment.admin_reply}</p>

</div>
`
:
""
}

</div>

`;

});


}

// ===============================
// CHARGER LES LIKES
// ===============================

async function loadLikes(postId){

const response = await fetch(

SUPABASE_URL + `/rest/v1/likes?select=id&post_id=eq.${postId}`,

{

headers:{

"apikey":SUPABASE_KEY

}

}

);


const likes = await response.json();


const element = document.getElementById("likes-" + postId);


if(element){

element.textContent = likes.length;

if(localStorage.getItem("liked-" + postId)){

const heart = document.getElementById("heart-" + postId);

if(heart){
heart.textContent="♥";
heart.style.color="#C8102E";
}

}

}

}

// ===============================
// AJOUTER UN LIKE
// ===============================

async function addLike(postId){

if(localStorage.getItem("liked-" + postId)){
    return;
}

const response = await fetch(

SUPABASE_URL + "/rest/v1/likes",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY

},

body:JSON.stringify({

post_id:postId

})

}

);


if(response.ok){

const heart = document.getElementById("heart-" + postId);

if(heart){

heart.textContent="♥";

heart.style.color="#C8102E";

}

localStorage.setItem("liked-" + postId, "true");

loadLikes(postId);

}

else{

console.log(await response.text());

}

}

// ===============================
// GESTION COMMENTAIRES ADMIN
// ===============================


async function loadAdminComments(){

const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + `/rest/v1/comments?select=*,posts(title)&order=created_at.desc&limit=${limit}&offset=${commentsPage * limit}`,

{

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token

}

}

);


const comments = await response.json();


const container = document.getElementById("adminCommentsList");


if(!container) return;


if(commentsPage === 0){

container.innerHTML="";

}


comments.forEach(comment=>{


container.innerHTML += `

<article class="comment">

<h3>${comment.name}</h3>

<p><strong>Article :</strong> ${comment.posts ? comment.posts.title : "Article supprimé"}</p>

<p>${comment.message}</p>

<p>
${new Date(comment.created_at).toLocaleDateString("fr-FR")}
</p>

<button onclick="showReplyBox(${comment.id})">
Répondre
</button>

<div id="replyBox-${comment.id}" style="display:none;">

<textarea id="reply-${comment.id}" placeholder="Réponse UPS"></textarea>

<button onclick="sendReply(${comment.id})">
Envoyer la réponse
</button>

</div>

<button onclick="deleteComment(${comment.id})">
Supprimer
</button>

</article>

`;


});


}


if(window.location.pathname.includes("admin-commentaires.html")){

loadAdminComments();

}

// ===============================
// SUPPRIMER COMMENTAIRE ADMIN
// ===============================

async function deleteComment(id){

const confirmation = confirm(
"Supprimer ce commentaire ?"
);


if(!confirmation){
return;
}


const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + "/rest/v1/comments?id=eq."+id,

{

method:"DELETE",

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer "+token

}

}

);


if(response.ok){

const message = document.getElementById("adminMessage");

if(message){

message.textContent = "Commentaire supprimé avec succès.";

message.style.color = "#00853F";

}

commentsPage = 0;

loadAdminComments();

}

else{

const message = document.getElementById("adminMessage");

if(message){

message.textContent = "Erreur lors de la suppression.";

message.style.color = "#C8102E";

}

console.log(await response.text());

}

}

// ===============================
// AFFICHER LA ZONE DE REPONSE
// ===============================

function showReplyBox(id){

const box = document.getElementById("replyBox-" + id);

if(box){

if(box.style.display === "none"){

box.style.display = "block";

}

else{

box.style.display = "none";

}

}

}


// ===============================
// ENVOYER REPONSE UPS
// ===============================

async function sendReply(id){

const reply = document.getElementById("reply-" + id).value;


if(!reply.trim()){

const message = document.getElementById("adminMessage");

if(message){

message.textContent = "Écris une réponse avant d'envoyer.";

message.style.color = "#C8102E";

}

return;

}

const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + "/rest/v1/comments?id=eq." + id,

{

method:"PATCH",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + token

},

body:JSON.stringify({

admin_reply: reply

})

}

);

if(response.ok){

const message = document.getElementById("adminMessage");

if(message){

message.textContent = "Réponse publiée avec succès.";

message.style.color = "#00853F";

}

commentsPage = 0;

loadAdminComments();

}

else{

const message = document.getElementById("adminMessage");

if(message){

message.textContent = "Erreur lors de la réponse.";

message.style.color = "#C8102E";

}

console.log(await response.text());

}

}

function sharePost(title){

if(navigator.share){

navigator.share({

title:title,

url:window.location.href

});

}

else{

copyPostLink();

}

}


function copyPostLink(){

navigator.clipboard.writeText(window.location.href);


const message = document.createElement("div");

message.textContent = "Lien copié !";

message.className = "copy-message";

document.body.appendChild(message);


setTimeout(()=>{

message.remove();

},2500);

}

// ===============================
// DEMANDES D'ADHÉSION ADMIN
// ===============================


async function loadMembershipRequests(){


const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + "/rest/v1/membership_requests?select=*&order=created_at.desc",

{

headers:{

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + token

}

}

);



const requests = await response.json();


console.log("DEMANDES ADHESION :", requests);

console.log(requests.map(r => r.id));



const container = document.getElementById("membershipRequestsList");



if(!container) return;



container.innerHTML = "";



if(!Array.isArray(requests) || requests.length === 0){


container.innerHTML = "<p>Aucune demande pour le moment.</p>";

return;


}



requests.forEach(request=>{


container.innerHTML += `


<article class="card">


<h3>
${request.first_name} ${request.last_name}
</h3>


<p>
📧 ${request.email}
</p>


<p>
📞 ${request.phone}
</p>


<p>
🌍 ${request.country} - ${request.city}
</p>


<p>
Profession : ${request.profession}
</p>


<p>
Statut : ${request.status}
</p>



${request.profile_photo_url ?

`
<img src="${request.profile_photo_url}" width="120">
`

:

""

}



<button onclick="validateMembership(${request.id})">

✅ Valider

</button>



<button onclick="rejectMembership(${request.id})">

❌ Refuser

</button>



</article>


`;


});


}



if(window.location.pathname.includes("admin-demandes.html")){


loadMembershipRequests();


}

// ===============================
// VALIDATION DEMANDE ADHESION
// ===============================

async function validateMembership(id){

console.log("VALIDATION ID :", id);

const token = localStorage.getItem("supabase_token");

console.log("TOKEN :", token);


const response = await fetch(

SUPABASE_URL + "/rest/v1/membership_requests?id=eq." + id,

{

method:"PATCH",

headers:{

"Prefer":"return=representation",

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + token

},

body:JSON.stringify({

status:"Validé"

}),


}

);


console.log("REPONSE PATCH :", response.status);

console.log(await response.text());


}




// ===============================
// REFUS DEMANDE ADHESION
// ===============================

async function rejectMembership(id){


const token = localStorage.getItem("supabase_token");


const response = await fetch(

SUPABASE_URL + "/rest/v1/membership_requests?id=eq." + id,

{

method:"PATCH",

headers:{

"Content-Type":"application/json",

"apikey":SUPABASE_KEY,

"Authorization":"Bearer " + token

},

body:JSON.stringify({

status:"Refusé"

})

}

);



if(response.ok){

alert("Demande refusée.");

loadMembershipRequests();

}

else{

console.log(await response.text());

alert("Erreur refus.");

}


}