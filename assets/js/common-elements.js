function list_posts_linkedin(){
	return ['6777136376266682369','6777861229898670081','6778585945819123712','6779673164571000832','6782194816580100097','6782919591560548352','6784731509396926464','6936941793640886272']
}

function navbar(){
	return `<section data-bs-version="5.1" class="menu menu2 cid-t98vDxC9FZ" once="menu" id="navbar-site">
    
	    <nav class="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
	        <div class="container-fluid">
	            <div class="navbar-brand">
	                <span class="navbar-logo">
	                    <a href="/">
	                        <img src="assets/images/logo-141x138.png" alt="Jady Nekena | Data Analyst à Lyon" style="height: 3rem;">
	                    </a>
	                </span>
	                <span class="navbar-caption-wrap"><a class="navbar-caption text-black text-primary display-7" href="/">Jady Nekena</a></span>
	            </div>
	            <button class="navbar-toggler" type="button" data-toggle="collapse" data-bs-toggle="collapse" data-target="#navbarSupportedContent" data-bs-target="#navbarSupportedContent" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
	                <div class="hamburger">
	                    <span></span>
	                    <span></span>
	                    <span></span>
	                    <span></span>
	                </div>
	            </button>
	            <div class="collapse navbar-collapse" id="navbarSupportedContent">
	                <ul class="navbar-nav nav-dropdown nav-right" data-app-modern-menu="true"><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index#la-data-au-service-des-entreprises">LA DATA</a></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index#mes-services">MES SERVICES</a></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index#mon-parcours">MON PARCOURS</a></li>
	                    <li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index#technos">TECHNOS</a>
	                    </li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index#dataviz-site-web">DATAVIZ EN TEMPS REEL DU SITE</a></li>
	                    <li class="nav-item dropdown"><a class="nav-link link text-black text-primary dropdown-toggle display-4" href="/#projets" data-toggle="dropdown-submenu" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">PROJETS ACCOMPLIS</a><div class="dropdown-menu" aria-labelledby="dropdown-733" data-bs-popper="none"><a class="text-black text-primary dropdown-item display-4" href="linkedin">Publications LinkedIn</a><a class="text-black text-primary dropdown-item display-4" href="projets-donnees-ouvertes">Données ouvertes</a><a class="text-black text-primary dropdown-item display-4" href="projets-donnees-personnelles">Données personnelles</a><a class="text-black text-primary dropdown-item display-4" href="projets-automatisations">Automatisations</a></div></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index#mes-clients">ILS M'ONT FAIT CONFIANCE</a></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index#contact">CONTACT</a></li></ul>
	                
	                
	            </div>
	        </div>
	      </nav>
	  </section>

	<section data-bs-version="5.1" class="footer3 cid-t98vDxYoCA" once="footers" id="footer3-r">

	`
}


function footer(){
	return `<section data-bs-version="5.1" class="footer3 cid-t980VYl5qY" once="footers" id="footer-site">    

	    <div class="container">
	        <div class="media-container-row align-center mbr-white">
	            <div class="row row-links">
	                <ul class="foot-menu">
	                    
	                    
	                    
	                    
	                    
	                <li class="foot-menu-item mbr-fonts-style display-7"><a href="index.html#mes-services" class="text-primary">MES SERVICES</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="index.html#mon-parcours" class="text-primary">MON PARCOURS</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="index.html#technos" class="text-primary">TECHNOS</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="index.html#dataviz-site-web" class="text-primary">DATAVIZ DU SITE</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="index.html#projets" class="text-primary">PROJETS</a></li></ul>
	            </div>
	            
	            <div class="row row-copirayt">
	                <p class="mbr-text mb-0 mbr-fonts-style mbr-white align-center display-7">
	                    © Copyright `+new Date().getFullYear()+`. Tout droit réservé.
	                </p>
	            </div>
	            
	        </div>
	    </div>
	</section>`
}

function add_element(html, id_element, parent_element, position){
	var elem = document.createElement('div')
	elem.innerHTML = html

	if(document.getElementById(id_element)) document.getElementById(id_element).remove()

	if(parent_element){			
		if(position>0){
			var res = parent_element.insertBefore(elem.firstChild, parent_element.children[position-1]);	
		}else{
			var res = parent_element.appendChild(elem.firstChild)
		}
	}
	
	//console.log({rajoute: res})
	return res;
}


function main(){
	var body = document.getElementsByTagName('body')[0]
	add_element(navbar(), 'navbar-site', body, 1)
	add_element(footer(), 'footer-site', body, -1)

	titles()
	contents()
	come_and_go()

}

function page_name(){
	return document.title.split('|')[1].trim()
}

function title_project(){
	var name = page_name()
	return '<h3 class="title mbr-section-title align-center mb-4 mbr-fonts-style display-2" id="title-section"><strong>'+name.toUpperCase()+'</strong></h2>'
}

function titles(){
	if (location.pathname !== '/' && location.pathname !== '/index' && location.pathname !== '/index.html'){
		console.log("mettre le titre")
		add_element(title_project(), 'title-section', document.getElementById('page-content'), 1)
	}
}

function loading(){
	return `<h4 class="mbr-section-subtitle align-center mbr-fonts-style mb-4 display-6" style="padding: 15%;">Page en cours de construction, merci de votre patience.</h4>`
}

function post_linkedin(id){

	//https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6600459666352812032

	return '<iframe class="card" src="https://www.linkedin.com/embed/feed/update/urn:li:share:'+id+'" height="200" width="400" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"  allowfullscreen></iframe>'
}


function content_of(page_name_str){
	if(!page_name_str.toLowerCase().trim().includes('linkedin')){
		return loading()	
	}else{

		var linkedin_posts = ''
		var my_list = list_posts_linkedin().reverse()
		my_list.forEach(function(id) {
			linkedin_posts = linkedin_posts + post_linkedin(id)
		});
		var res = `<div id="content-section">`+linkedin_posts+`</div>`

		return res
	}
	
}

function contents(){

	var content = content_of(page_name())
	add_element(content, 'content-section', document.getElementById('page-content'), -1)
}

function save_item(item_name,item_value){
	del_item(item_name)
	return window.localStorage.setItem(item_name, item_value)
}

function del_item(item_name){
	return window.localStorage.removeItem(item_name)
}

function get_item(item_name){
	return window.localStorage.getItem(item_name)
}



function now_function(){
	var dt = new Date
	/*
    return `${dt.getDate().toString().padStart(2, '0')}/${
    (dt.getMonth()+1).toString().padStart(2, '0')}/${
    dt.getFullYear().toString().padStart(4, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`;*/

    return dt;
}
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


function new_day_of_connection(){
	//if the saved date doesn't exist THEN it's a new connection
	//if the abs(saved date - current date) > 1h THEN it's a new connection

	return !get_item('date_premiere_visite') 
}

async function visit_details(){
	var body = document.getElementsByTagName('body')[0]
	var res = {
		'id_visite': get_item('id_visite'),
		'adresse_ip':'',
		'latitude':'',
		'longitude':'',
		'pays':'',
		'region':'',
		'ville':'',
		'operateur':'',
		'navigateur':navigator.appCodeName,
		'resolution':body.offsetWidth +  ' x ' + body.offsetHeight,
		'systeme':navigator.oscpu,
		'date_arrivee': get_item('date_premiere_visite'),
		'date_depart':'',
		'timezone': '',
		'utc_offset': ''
	}

	try{
		var client = await data_client()	
		res['adresse_ip'] = client['ip']
		res['latitude'] = client['latitude']
		res['longitude'] = client['longitude']
		res['pays'] = client['country_name']
		res['region'] = client['region']
		res['ville'] = client['city']
		res['operateur'] = client['org']
		res['timezone'] = client['timezone']
		res['utc_offset'] = client['utc_offset']
	}catch(err){
		console.err('Error on client',err)
	}
	

	return res
}


async function post_datas(){

		

		//check if very first visit of the day (+cookies ACCEPTED)
		if(document.cookie.length === 0 || new_day_of_connection()){


			console.log('very first connection')
			save_item('id_visite',uuidv4())
			save_item('date_premiere_visite',now_function())


		//NOT first visit: cookies need to be accepted
		}else{
			console.log('user recognized')
		}

		var a_visit = await visit_details()
		console.log(a_visit)


}

async function data_client(){
	return await get_result('https://ipapi.co/json/')
}

async function get_result(url){
	return await fetch_url(url).then(e => e)
}

function fetch_url(url, callback){

	return fetch(url).then(function (response) {
		// The API call was successful!
			return response.json();
		

	}).then(function (data) {
		// This is the JSON from our response
		if(callback!==undefined){
			return callback(data)
		}else{
			return data
		}


	}).catch(function (err) {
		// There was an error
		console.error('Something went wrong.', err);
		return false
	});
}

function post_datas_by_cookies(){

	var btn_cookie = document.getElementById('impliedsubmit')
	if(btn_cookie) btn_cookie.addEventListener('mouseup', post_datas)
	
	return btn_cookie
}



function come_and_go(){
	// after first loading OR accepting cookies via button
	document.addEventListener('DOMContentLoaded', post_datas)
	document.addEventListener('DOMContentLoaded', post_datas_by_cookies)

}

function post_when_clicked(){
	/*
		> id_visite
		> date_clic
		> url_page_source
		> tag
		> contenu_clic (textContent, alt)
		> lien (optionnel)
		> id_element (optionnel)
	*/
	document.addEventListener('click', function(e){
		var element = e.target
		var tag_element = element.tagName
		var textContent = element.id || element.textContent || element.alt;

		if(textContent.trim().length > 0){

			console.log({'textContent': textContent})

		}


	})
}




main()
