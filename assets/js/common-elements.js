
const { createClient } = supabase
const prefix = loc() === '/' ||  loc() === '/index' ? '/assets' : '../assets' 
supabase = createClient(racine_data(),  apikey())
let MAINTENANCE_MODE = false ;


const jquery_lib = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"

var sep = '\t'
var final_datas = []

function list_posts_linkedin(){
	return ['6777136376266682369',
			'6777861229898670081',
			'6778585945819123712',
			'6779673164571000832',
			'6782194816580100097',
			'6782919591560548352',
			'6784731509396926464',
			'6936941793640886272',
			'6944551923622531072',]
}


const ref_project_open = 'projets-donnees-ouvertes'
const ref_project_perso = 'projets-donnees-personnelles'
const ref_project_auto = 'projets-automatisations'
const ref_project_linkedin = 'linkedin'


async function maintenance(){
	let url = racine_data() + '/rest/v1/rpc/maintenance?apikey=' + apikey()
	return await post_resultat_asynchrone(url, {})
}


function current_project(){
	let res = loc().includes(ref_project_open) ? ref_project_open :
				loc().includes(ref_project_perso) ? ref_project_perso :
				loc().includes(ref_project_auto) ? ref_project_auto :
				loc().includes(ref_project_linkedin) ? ref_project_linkedin :
				""

	return res
}

function is_tableau_project(){	
	return  current_project() === ref_project_open || current_project() === ref_project_perso
}

//title card
const list_title_initial = {
	[ref_project_open]: ['Inspections sanitaires',
						'Véhicules commercialisées',
						'Aide au choix de formation ParcourSup'],
	[ref_project_perso]: ['Un projet Agile',
						'Les mots de la Bible en anglais',
						'Mon historique Youtube']

}



//title online (tableau public)
const list_title_viz_initial = {
	[ref_project_open]: ['InspectionssanitairesAlimConfiance/Dashboard',
						'Etudedesmodlesdevhiculescommercialiss/Conclusion',
						'Parcoursup_16538279647500/ParcourSup2018-2021'],
	[ref_project_perso]: ['Unprojetagile/Rsum',
						'StudyingBible/Dashboard',
						'Personalyoutubehistory/Dashboard_1'
						]

}

//ids from tableau
const list_id_viz_initial = {
	[ref_project_open]: ['viz1655731628354',
						'viz1655737537459',
						'viz1655737600382'],
	[ref_project_perso]: ['viz1655747869171',
						'viz1655747945236',
						'viz1655748303418'
						]

}

//redim when embedded from tableau
const list_redim_viz_initial = {
	[ref_project_open]: [`if (divElement.offsetWidth > 800) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else if (divElement.offsetWidth > 500) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else {
						    vizElement.style.width = '100%';
						    vizElement.style.minHeight = '2100px';
						    vizElement.style.maxHeight = (divElement.offsetWidth * 1.77) + 'px';
						}

						`,


						`if (divElement.offsetWidth > 800) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else if (divElement.offsetWidth > 500) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else {
						    vizElement.style.width = '100%';
						    vizElement.style.height = '2177px';
						}`,


						`if (divElement.offsetWidth > 800) {
						    vizElement.style.width = '100%';
						    vizElement.style.maxWidth = '1809px';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						    vizElement.style.maxHeight = '1031px';
						} else if (divElement.offsetWidth > 500) {
						    vizElement.style.width = '100%';
						    vizElement.style.maxWidth = '1809px';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						    vizElement.style.maxHeight = '1031px';
						} else {
						    vizElement.style.width = '100%';
						    vizElement.style.height = '877px';
						}`],


	[ref_project_perso]: [`if (divElement.offsetWidth > 800) {
							vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else if (divElement.offsetWidth > 500) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else {
						    vizElement.style.width = '100%';
						    vizElement.style.minHeight = '1150px';
						    vizElement.style.maxHeight = (divElement.offsetWidth * 1.77) + 'px';
						}`,


						`if (divElement.offsetWidth > 800) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else if (divElement.offsetWidth > 500) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else {
						    vizElement.style.width = '100%';
						    vizElement.style.minHeight = '1100px';
						    vizElement.style.maxHeight = (divElement.offsetWidth * 1.77) + 'px';
						}`,


						`if (divElement.offsetWidth > 800) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else if (divElement.offsetWidth > 500) {
						    vizElement.style.width = '100%';
						    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
						} else {
						    vizElement.style.width = '100%';
						    vizElement.style.minHeight = '2100px';
						    vizElement.style.maxHeight = (divElement.offsetWidth * 1.77) + 'px';
						}`
						]

}



//content card

const list_tooltips_initial = 
	{[ref_project_open]: [

					`<strong>31183</strong>. C'est le nombre d'inspections sanitaires en France entre Juin 2020 et Juin 2021, et parmi tout ça, c'est : <br>
					1- 94,4% de conclusions (très) satisfaisantes<br>
					2- En moyenne 2444 inspections par an <br>
					3- 2/3 dans le milieu de la restauration <br>
					4- très fréquentes au mois de Mars, notamment le Jeudi (probabilité à 30%)<br>
					5- dans le département du Lot-et-Garonne (47): 79% des inspections sont très satisfaisantes<br>
					6- dans le département des Yvelines (78): seulement 8.19% sont très satisfaisantes<br>
					7- 17 établissements inspectées 4fois (ou+) en 1 an<br>
					8- 117 établissements critiques, dont SEULEMENT 4 ont reçu une deuxième inspection plus tard.`,
								

							`Le nombre de modèles de véhicules commercialisés explose de façon exponentielle depuis 2005 : on en compte plus de 280 000 en 2014 📈.<br>

					1- 84% des émissions de CO2 en automobile sont issues de 5 marques.<br>
					2- L'émission de CO2 d'un véhicule dépend de 2 choses : sa consommation et son type de carburant, GPL étant le compromis.<br>
					3- Seulement 14 marques en ont commercialisé, et sur le podium on a Renault avec ses 64 modèles GPL (du moins de 2001 à 2014).<br>
					4- Les modèles de la marque Lamborghini consomment 2x plus que la moyenne, et produisent ainsi 2x plus de CO2, tout comme les modèles de Bentley et Ferrari.<br>



							`,


							`
					Choisir son cursus parcoursup, un vrai casse-tête...<br>
					Grâce aux données officielles de Parcoursup (et après avoir un peu nettoyé tout ça), j'ai mis en place une dataviz qui permet de visualiser 2 indicateurs :<br>
					1. Le nombre de candidatures moyen par an<br>
					2. Le taux d'admission moyen<br>
					On s'intéresse ici à 2 paramètres: l'intitulé de la formation (BTS, DUT, ...) et sa filière (Ecole d'architecture par exemple).<br>
					Dès que vous définissez un paramètre, l'autre se met à jour. Vous n'êtes pas obligé de renseigné les deux. Par défaut, ces paramètres sont sur la valeur (Tout).<br>
				`],

	[ref_project_perso]: [
					"",
					"",
					"",]
			
}








function loc(){
	return window.location.pathname+window.location.search
}

function racine_data(){
	return 'https://kxdokvtvscvjuwzgmvei.supabase.co'
}

async function select_supabase(fields,nametable,options){
	var {data,err} = await supabase
		.from(nametable)
		.select(fields)

	if(err) console.error(err)

	//options sous la forme {nom_champ_ref1: 'champ1' , valeur_champ_ref1: 'valeur1', nom_champ_ref2: 'champ2', valeur_champ_ref2: 'valeur2'}


	return data
}

function local_if_dataviz_not_iframe(){
	//considered LOCAL if (NOT IFRAME and /DATAVIZ/)
	return (!inIframe() && loc().includes("/DATAVIZ/"))
}

function is_local_host(){
	return local_if_dataviz_not_iframe() || window.location.href.toLowerCase().includes('localhost') || window.location.href.toLowerCase().includes('127.0.0.')
}

function is_home_page(){
	return !(location.pathname !== '/' && location.pathname !== '/index' && location.pathname !== '/index.html')
}

async function insert_supabase(nametable,datas,upsert_mode){
	//console.log('inserting to '+nametable,datas)
	if(is_local_host()) return ;

	const { data, error } = await supabase
		.from(nametable)
		.insert(datas, { upsert: false, returning: 'minimal' })

	return  { data, error }
}

async function update_supabase(nametable,datas,matches){
	console.log('updating '+nametable,datas)

	if(is_local_host()) return ;

	const { data, error } = await supabase
		.from(nametable)
		.update(datas)
		.match(matches)

	return  { data, error }

}




function apikey(){
	return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZG9rdnR2c2N2anV3emdtdmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU2MTk3MTQsImV4cCI6MTk3MTE5NTcxNH0.ViTcu3L79EkuvGvyDiSqwdpgJ0MQFbg8nL1vO0tTcDk'
}

function navbar(){
	let category_votes = document.querySelector('.a-dataviz') ? `<li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#poll-votes">VOTES DE LA SEMAINE</a></li>` : ""

	return `<section data-bs-version="5.1" class="menu menu2 cid-t98vDxC9FZ" once="menu" id="navbar-site">
    
	    <nav class="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
	        <div class="container-fluid">
	            <div class="navbar-brand">
	                <span class="navbar-logo">
	                    <a href="/">
	                        <img src="`+prefix+`/images/logo-141x138.png" alt="Jady Nekena | Data Analyst à Lyon" style="height: 3rem;">
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
	                <ul class="navbar-nav nav-dropdown nav-right" data-app-modern-menu="true"><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#la-data-au-service-des-entreprises">LA DATA</a></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#mes-services">MES SERVICES</a></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#mon-parcours">MON PARCOURS</a></li>
	                    <li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#technos">TECHNOS</a></li>
	                    <li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#dataviz-site-web">DATAVIZ EN TEMPS REEL DU SITE</a></li>
	                    `+category_votes+`
	                    <li class="nav-item dropdown"><a class="nav-link link text-black text-primary dropdown-toggle display-4" href="/#projets" data-toggle="dropdown-submenu" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">PROJETS ACCOMPLIS</a><div class="dropdown-menu" aria-labelledby="dropdown-733" data-bs-popper="none"><a class="text-black text-primary dropdown-item display-4" href="/projets-donnees-ouvertes">Données ouvertes</a><a class="text-black text-primary dropdown-item display-4" href="/projets-donnees-personnelles">Données personnelles</a><a class="text-black text-primary dropdown-item display-4" href="/projets-automatisations">Automatisations</a><a class="text-black text-primary dropdown-item display-4" href="/linkedin">Publications LinkedIn</a></div></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#mes-clients">ILS M'ONT FAIT CONFIANCE</a></li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#contact">CONTACT</a></li></ul>
	                
	                
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
	                    
	                    
	                    
	                    
	                    
	                <li class="foot-menu-item mbr-fonts-style display-7"><a href="/#mes-services" class="text-primary">MES SERVICES</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="/#mon-parcours" class="text-primary">MON PARCOURS</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="/#technos" class="text-primary">TECHNOS</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="/#dataviz-site-web" class="text-primary">DATAVIZ DU SITE</a></li><li class="foot-menu-item mbr-fonts-style display-7"><a href="/#projets" class="text-primary">PROJETS</a></li></ul>
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
	if (!html || html.length === 0) return false
	var elem = document.createElement('div')
	elem.innerHTML = html
	if(document.getElementById(id_element)) document.getElementById(id_element).remove()

	if(parent_element){			
		if(position>0){
			var res = parent_element.insertBefore(elem.firstChild, parent_element.children[position-1]);	
		}else if(elem.firstChild){			
			var res = parent_element.appendChild(elem.firstChild)
		}
	}
	
	//console.log({rajoute: res})
	return res;
}

async function post_resultat_asynchrone(url,data_json){
	try {
	    const config = {
	        method: 'POST',
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json',
	        },
	        body: JSON.stringify(data_json)
	    }
	    
	    const response = await fetch(url, config)
	    return await response.json()

	} catch (error) {
	        //
	}
}

function post_resultat_asynchrone_old(url,data_json){
  objet_envoi = {
    type: 'POST',
    url: url,
    data: data_json
  }

  objet_envoi = rajouter_apijey_ajax(url,objet_envoi)


  return $.ajax(objet_envoi).done(function(data) {
    //console.log(data)
    return data
  });

}

function rajouter_apijey_ajax(url,objet_envoi){


	objet_envoi.headers = {'apikey': apikey().replaceAll("apikey=","")}
	console.log({objet_envoi})
	
	return objet_envoi;
}


async function number_of_rows(tab,field_count){
  
  url =racine_data() + '/rest/v1/rpc/number_of_rows?apikey=' + apikey()
  return await post_resultat_asynchrone(url, {"tab":tab, "field_count":field_count})

}

final_datas = []
async function select_all(name_table,function_callback,depth,from,into){
  //console.error({function_callback})
  var more_datas = []

  //>=2nd page
  if(from && into){
    depth += 1
    count = count !== 9999999999 && count > 0 ? count : await number_of_rows(name_table,'*')
    var {data,error} = await supabase
        .from(name_table)
        .select('*')
        .range(from,into)


    //if data is not big enough -> recursive
    //console.info({data})
    add(data)
    more_datas = await check_if_datas_complete_or_recursive_call(name_table,count,data,depth,from,into,function_callback)
    //console.info({more_datas})
    if(more_datas) add(more_datas)
    //console.info({final_datas})

    if(function_callback) function_callback(data)
    final_datas = [...new Set(final_datas)];
    return data

  //very first query with only 1 element
  }else{

    depth = 0 //no depth at the beginning

    //count number of elements
    count = 9999999999
    //console.info({count})

    var  {data,error} = await supabase
        .from(name_table)
        .select('*')

    add(data)
    await check_if_datas_complete_or_recursive_call(name_table,count,data,depth,from,into,function_callback)
  }
  
}

function add(more){
  return Array.prototype.push.apply(final_datas,more);
}

async function check_if_datas_complete_or_recursive_call(name_table,count,data,depth,from,into,function_callback){

  if(final_datas.length < count  && data){

    depth = depth+1
    //console.info({depth})

    from = data.length * depth
    //console.info({from})

    into = Math.min(from + data.length -1,count-1)
    //console.info({into})

    return await select_all(name_table,function_callback,depth,from,into,function_callback)
  
  }else{
  	return []
  }
}



async function download(){

	wait(true)
	final_datas = []
	return await select_all('tout',to_csv) 
	
}

function wait(yes){
	$('body')[0].style.cursor = yes ? 'wait' : ''
}

function to_csv(){
	wait(false)
	if(!sep) return false
	console.info({sep})
	console.info({final_datas})

	csv = ConvertToCSV(final_datas)
	console.info({csv})

	downloadFile(date_now() + '_datas-jadynekena.com.txt',csv)
	//alert("Téléchargement...")


	return final_datas
}

function date_now(){
	return (new Date).toLocaleString().replaceAll('/','-').replaceAll(':','-')
}

function downloadFile(filename, content) {
	const blob = new Blob([content], { type: 'text/plain' });
	const a = document.createElement('a');
	a.setAttribute('download', filename);
	a.setAttribute('href', window.URL.createObjectURL(blob));
	a.click();
	a.remove()
};

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = ''

    str += Object.keys(objArray[0]).join(sep) + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += sep

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function iframe_resize(id){
	if(is_home_page()){

		$('iframe[id="'+id+'"]').on('load',function(){
			adapt_iframe_height(id)
		})
		$(window).on('resize',function(){adapt_iframe_height(id)})
	}
}

function adapt_iframe_height(id){
	let final_height = 0
	let curr_iframe = $('iframe[id="'+id+'"]')
	if (curr_iframe && curr_iframe.contents() && curr_iframe.contents().find('body')[0]) final_height = curr_iframe.contents().find('body')[0].offsetHeight
	if (final_height && $('iframe[id="'+id+'"]').length > 0) $('iframe[id="'+id+'"]').parent().css('height',final_height  + 'px') 
}

function add_switch(){

	//light switch
	add_element('<div id="switch" class="fixed"><span  class="light-switch">💡</span></div>','switch',document.querySelector('#footer-site'),-1)
	document.querySelector('#switch').addEventListener('click', switch_light)
	
}

function is_loc_without_nav_bar(){
	return loc().includes("/DATAVIZ/") || loc().includes("/backup/")
}

async function main(){

	load_live_if_localhost()

	var body = document.getElementsByTagName('body')[0]
	come_and_go()

	if(is_loc_without_nav_bar()) return false;

	//ALL
	MAINTENANCE_MODE = await pause_if_maintenance()
	if(MAINTENANCE_MODE) return false

	add_element(navbar(), 'navbar-site', body, 1)
	add_nav_items_events()
	add_element(footer(), 'footer-site', body, -1)

	add_switch() //all
	apply_light()

	titles() //on ALL PROJECTS
	contents() //on ALL PROJECTS
	google_tag() //only on NO LOCALHOST

	parse_parameters() //only on tableau projects
	iframe_resize('DATAVIZ') //only on homepage
	append_details_of_vizzes() //only on tableau projects

	show_number_of_votes() //only on home page
	techno_texts() //only on home page
	
}

function load_live_if_localhost(){
	if(is_local_host()){
		load_script_in_head('https://livejs.com/live.js',true,'live-js')
	}
}


function parse_parameters(){
	if(!is_tableau_project()) return false

	const urlParams = new URLSearchParams(window.location.search)

	if (loc().includes(ref_project_open) || loc().includes(ref_project_perso)){
		if(urlParams.get('id')){
			
			load_swal_and_showdown()
			expand_card(urlParams.get('id'))	
		} 
	}
	
}

function load_swal_and_showdown(){
	load_script_in_head('https://cdn.jsdelivr.net/npm/showdown','md_to_html')
	load_swal()
}




function add_nav_items_events(){

	const elements = document.querySelectorAll(".nav-item:not(.dropdown), .dropdown-item");

	for (let i = 0; i < elements.length; i++) {
		elements[i].addEventListener('click',toggleBack)
	}

	


}

function toggleBack(){
	//if phone mode (toggler visible) -> click on $('.navbar-toggler')
	if(selector_elements_visible('.navbar-toggler:not(.hidden)')){
		document.querySelector('.navbar-toggler').click()
	
	//if NOT phone mode (toggler NOT visible) -> click on $("#navbar-site")
	}else{
		document.querySelector('#navbar-site').click()
	}
	
}

function selector_elements_visible(selector){
	return document.querySelectorAll(selector).length > 0
}

function google_tag(){
	if (is_local_host()) return false;
	load_script_in_head(url_google_tag(),true)
	load_script_in_head(first_script_gtag(),true)
	load_script_html_in_head(script_load_google_tag())

}

function first_script_gtag(){
	return `../assets/js/analytics.js`
}

function load_css_in_head(css_url){
	var style = document.createElement('link')
	style.rel = "stylesheet"
	style.href = css_url
	document.head.appendChild(style)
	
}

function load_script_text_in_body(script,id_script){
	if (document.getElementById(id_script)) document.getElementById(id_script).remove()
	var body_of_page = document.querySelector("body")
	var s = document.createElement("script");
	s.id = id_script;
	s.type = "text/javascript";
	s.innerHTML = script;
	
	return body_of_page.append(s);	

}


function load_script_in_head(script_url, isfirst, script_id){
	//load only once
	if(document.querySelector('script[id="'+script_id+'"]')) return true;

	var head_of_page = document.querySelector("head")
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = script_url;
	if (script_id) s.id = script_id

	
	if(isfirst){
		return head_of_page.insertBefore(s, head_of_page.firstChild);
	}else{
		return head_of_page.append(s);	
	}
	
}

function load_script_html_in_head(html){

	var s = document.createElement("script");
	s.type = "text/javascript";
	s.innerHTML = html;
	return document.querySelector("head").append(s);
}



function url_google_tag(){
	return 'https://www.googletagmanager.com/gtag/js?id=G-0NSWTSL9L5'
}

function script_load_google_tag(){
	return `
		  window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());

		  gtag('config', 'G-0NSWTSL9L5');
		`
}



function page_name(){
	return document.title ? document.title.split('|')[1].trim() : ""
}

function title_project(){
	var name = page_name()
	return '<h1 class="title mbr-section-title align-center mb-4 mbr-fonts-style display-2" id="title-section"><strong>'+name.toUpperCase()+'</strong></h1>'

	
}

function get_subtitle(loc){

	if(loc.includes(ref_project_open)){
		return `Les <strong>données ouvertes (OpenData)</strong> sont des données accessibles à tous.
		Elles sont généralement fournies par les organismes officiels, les ministères, et parfois même les entreprises et associations.`

	}if(loc.includes(ref_project_perso)){
		return "J'ai récupéré mes données depuis différentes plateformes et j'ai découvert des indicateurs très intéressants sur mes activités."

	}if(loc.includes(ref_project_auto)){
		return ""

	}if(loc.includes(ref_project_linkedin)){
		return `<h4 class="mbr-section-subtitle align-center mbr-fonts-style mb-4 display-7">N'hésitez pas à consulter les publications directement <a href="https://www.linkedin.com/in/data-analyst-vba/" target="_blank">sur LinkedIn</a> !</h4>`

	}else {
		return ""
	}
}

function reset_cards(id_viz){

	switch_details_display('grid')
	$('#close').remove()
	$(".tableau").children().remove()
	$("#script_viz").remove()
	$('.card').removeClass('expanded').addClass('expandable')

	if(id_viz){
		$('[id_viz="'+id_viz+'"]')[0].addEventListener('click', switch_card)
		$('[id_viz="'+id_viz+'"]')[0].href = '?id='+$('[id_viz="'+id_viz+'"]')[0].id//NEW
		set_infos($('[id_viz="'+id_viz+'"]')[0],false)
	}
	
	window.history.pushState(new Date, '', loc().split('?')[0]);
	


	//other solution
	/*
	window.location.href = loc().split('?')[0]
	*/
}

function expand_card(id){

	e = document.querySelector(".card[id='"+id+"']")
	e.className = 'card expanded'
	e.href = '#' //NEW
	id_viz = e.getAttribute('id_viz')
	title_viz = e.getAttribute('title_viz')
	list_id_viz = get_list_viz('id')
	
	redim_viz = get_list_viz('redim',list_id_viz.indexOf(id_viz))

	add_element(`<div id="close" onclick="reset_cards('`+id_viz+`')" class="popupCloseButton">×</div>`, 'close', e.parentNode, 1) 
	e.removeAttribute('onclick')

	e.querySelector('.info').style.display = 'inline-block'
	set_infos(e,true)

	//load viz
	see_viz(e,id_viz,title_viz,redim_viz)
}

function set_infos(card_parent,yes){
	let info = card_parent.querySelector('.info')
	info.style.display = yes ? 'inline-block':'none'
	if(yes){
		info.addEventListener('click',async function(){
			//display_in_popup(this.previousElementSibling.innerText,this.getAttribute('data'))
			
			legend_viz = await readFiles(current_legend())
			console.log(legend_viz)
			display_md_in_popup(this.previousElementSibling.innerText, legend_viz)
		})
	}
}

function current_legend(){
	return current_project() ? loc().replace('?id=','') + '.md' : ""
}

function display_in_popup(title,html_content,element_target){
	opt = {
		title: title,
		html: html_content,
		position: 'center',
		showCloseButton: true,
		showConfirmButton: false,
	}

	if(element_target) opt['target'] = element_target
	return Swal.fire(opt)
}

function techno_texts(){
	if(!is_home_page()) return false
	load_swal_and_showdown()

	// main tech + second ones
	let main_technos = document.querySelectorAll("#technos .btn,  a.btn-white")
    main_technos.forEach(function(techno){
    	techno.addEventListener('click', async function(){
    		console.log(techno)
    		current_tech = techno.innerText.trim().replaceAll('/',' ')
    		explanations = await readFiles('/assets/texts/'+current_tech+'.md')
    		display_md_in_popup(current_tech,explanations,techno.ParentNode)
    	})
    })
}

function display_md_in_popup(title,md_content,element_target){
	let converter = new showdown.Converter()
	let html_content = converter.makeHtml(md_content);
	return display_in_popup(title,html_content,element_target)
}

function readFiles(local_link){
    return $.get(local_link, function(data) {
        return data;
    }, "text");
}

function switch_card(e){
	//console.log('\n')

	if(e.target) e = e.target
	if(!e.className.includes('card expand')){
		//console.log('not the right one!')
		e = $(e).parents('.card')[0]
	}
 
	
	//console.log('clicked on',e)
	


	//if to expand -> BIGGER + add button + disable switchonclick
	if(e && e.className && e.className.includes('expandable')){


		id_viz = e.getAttribute('id_viz')
		expand_card(e.id)


	//if to reduce -> nothing
	}else{}
	
	return false

}

function switch_details_display(final_value){
	let elements = document.querySelectorAll('.details')

	for (let i = 0; i < elements.length; i++) {
		elements[i].style.display = final_value
	}

}

async function see_viz(e,id_viz,title_viz,redim_viz){
	switch_details_display('block')
	add_element(render_a_viz(id_viz,title_viz),id_viz,e.querySelector(".tableau"),1)
	await load_script_text_in_body(script_viz(id_viz,redim_viz),'script_viz')
}

function load_jquery(){
	load_script_in_head(jquery_lib,false,'jquery_lib')
}

async function get_my_all_views(){
	let url = racine_data() + '/rest/v1/rpc/first_100_views?apikey=' + apikey()
	return await post_resultat_asynchrone(url, {username: 'ramanandray'})
}

function get_details(res,title_viz){
	worbookname = title_viz.split('/')[0]
	return res ? res.find(e=> e['workbookRepoUrl'] === worbookname) : {}
}

async function append_details_of_vizzes(){

	if(!current_project() || !is_tableau_project()) return false

	let all_views = await get_my_all_views()
	let list_title_viz = get_list_viz('title_viz')
	let details = {}
	let list_to_keep = {
		viewCount: 'Nombre de vues',
		firstPublishDate: 'Date de création',
		lastUpdateDate: 'Date de dernière mise à jour',
	}

	let title = ""
	let content = ""
	let nb_views = []

	return await list_title_viz.forEach( function(a_title_viz) {
		details = get_details(all_views,a_title_viz)

		el = document.querySelector("[title_viz^='"+a_title_viz+"'] .details")
		if(!el) return false
		el.innerHTML = ""

		Object.keys(details).forEach(function(key){
			title = list_to_keep[key]
			content =  display_value(key,details[key])
			if(key && title && content){	
				el.innerHTML += display_detail(title,content)
			}

		})

		//rearrange views number at the beginning
		nb_views = $('.detail_element:contains("vues")').get()
		nb_views.forEach(function(view){
			view.parentNode.prepend(view)
		})

	});
}


function display_value(keyname,value){
	return keyname.includes('Date') ? new Date(value).toLocaleString() : value
}


function display_detail(title,content){
	return `<span class="detail_element">
			    <strong>`+title+`:</strong>
			    <span>`+content+`</span>
			 </span>`
}

function subtitle_of_project(subtitle){
	return `<div class="container-fluid" id="explanation">
        	<div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
				<h4 class="mbr-section-subtitle align-center mbr-fonts-style mb-4 display-7">`+subtitle+`</h4>
			</div>
			</div>
			</div>`
}

function titles(){
	if (!is_home_page()){
		add_element(title_project(), 'title-section', document.getElementById('page-content'), 1)
		add_element(subtitle_of_project(get_subtitle(loc())), 'explanation', document.getElementById('page-content'), 2)
	}
}

function big_section(content,padding){
	return `<h4 id="project-content" class="mbr-section-subtitle align-center mbr-fonts-style mb-4 display-6" style="padding: `+ (padding || '15%') +`;">`+content+`</h4>`
}

function loading(){
	return big_section('Page en cours de construction, merci de votre patience.')
}

function post_linkedin(id){
	return '<iframe class="card" src="https://www.linkedin.com/embed/feed/update/urn:li:share:'+id+'" height="200" width="400" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"  allowfullscreen></iframe>'
}

function title_to_id(title){
	return title.trim().toLowerCase().replaceAll(' ','-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}


function one_card(title,legend_viz,id_viz,title_viz){
	/*
	console.log({title})
	console.log({legend_viz})
	console.log({id_viz})
	console.log({title_viz})
	*/
	return `<a href="?id=`+title_to_id(title)+`" id="`+title_to_id(title)+`" class="card expandable" style="overflow: auto;" onclick="return switch_card(this)" id_viz=`+id_viz+` title_viz=`+title_viz+`>
                <div class="card-wrapper" style="overflow: auto;" >
                	<div class="card-box align-center">
                		<h5 class="card-title mbr-fonts-style display-7">
                			<strong>`+title+`</strong>
                			<span class="info" data="`+legend_viz+`">ℹ️</span>
                		
	                		<div class="details"></div>
	                	</h5>
	                </div>
                	<div class="card-wrapper tableau">
                </div>


                </div>
            </a>
                `
}

function render_a_viz(id_viz,title_viz){
	return `<div class='tableauPlaceholder' id='`+id_viz+`' style='position: relative'>
   <noscript><a href='#'></a></noscript>
   <object class='tableauViz'  style='display:none;'>
      <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
      <param name='embed_code_version' value='3' />
      <param name='site_root' value='' />
      <param name='name' value='`+title_viz+`' />
      <param name='tabs' value='false' />
      <param name='toolbar' value='yes' />
      <param name='animate_transition' value='yes' />
      <param name='display_static_image' value='yes' />
      <param name='display_spinner' value='yes' />
      <param name='display_overlay' value='yes' />
      <param name='display_count' value='yes' />
      <param name='language' value='fr-FR' />
      <param name='height' value='100%' />
   </object>
</div>
`
}

function script_viz(id_viz,redim_viz){
	return `var divElement = document.getElementById('`+id_viz+`');
		var vizElement = divElement.getElementsByTagName('object')[0];
		`+redim_viz+`

		var scriptElement = document.createElement('script');
		scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
		vizElement.parentNode.insertBefore(scriptElement, vizElement);
		`
}

function get_list_viz(type_of_field, index_of_viz){
	let res = []
	if(type_of_field === 'title'){
		res = list_title_initial[current_project()]

	}else if(type_of_field === 'title_viz'){//title ONLINE
		res = list_title_viz_initial[current_project()]

	}else if(type_of_field === 'id'){
		res = list_id_viz_initial[current_project()]

	}else if(type_of_field === 'redim'){
		res = list_redim_viz_initial[current_project()][index_of_viz]
	}

	return res
}

function open_datas(){

	load_css_in_head(prefix + "/timeline/style.css")
	load_jquery()

	var result = ""
	list_title = get_list_viz('title')
	list_title_viz = get_list_viz('title_viz') 
	list_id_viz = get_list_viz('id') 


	for (let i = 0; i < list_title.length ; i++) {
		//one_card(title,legend_viz,id_viz,title_viz)
		result += one_card(list_title[i], "",list_id_viz[i], list_title_viz[i])
	}
	

	return big_section('<div class="container-fluid">'+result+'</div>','3%')
}

function personal_datas(){
	return open_datas()
}

function automates(){
	return '' //loading()
}


function content_of_current_location(){
	page_name_str = loc()
	
	if(page_name_str.includes(ref_project_open)){
		return open_datas()

	}if(page_name_str.includes(ref_project_perso)){
		return personal_datas()

	}if(page_name_str.includes(ref_project_auto)){
		return automates()	

	}if(page_name_str.includes(ref_project_linkedin)){

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

	var content = content_of_current_location()
	add_element(content, 'content-section', document.getElementById('page-content'), -1)
}

function save_item(item_name,item_value){
	del_item(item_name)
	return window.localStorage.setItem(item_name, item_value)
}

function append_item(item_name,new_item_value,sep){
	return window.localStorage.setItem(item_name, (get_item(item_name) ? get_item(item_name) + sep : "") + new_item_value)
}

function del_item(item_name){
	return window.localStorage.removeItem(item_name)
}

function get_item(item_name,parseJSON){
	let res = window.localStorage.getItem(item_name)
	if(parseJSON) res = JSON.parse(res)
	if(!res) res = ""
	return res
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

function dateDiffToString(a, b){

    // make checks to make sure a and b are not null
    // and that they are date | integers types

    diff = Math.abs(a - b);

    ms = diff % 1000;
    diff = (diff - ms) / 1000
    ss = diff % 60;
    diff = (diff - ss) / 60
    mm = diff % 60;
    diff = (diff - mm) / 60
    hh = diff % 24;
    days = (diff - hh) / 24

    return {'d':days,'h':hh,'min': mm,'sec':ss,'ms':ms}

}


function new_period_of_connection(){

	var diff_date = dateDiffToString(new Date(get_item('date_premiere_visite')), new Date)
	//console.info(diff_date)

	//if the saved date doesn't exist THEN it's a new connection
	//if the time elapsed is more than 30min OR 1h THEN it's a new connection
	return !get_item('date_premiere_visite') || diff_date.h >= 1 || diff_date.min >= 30 
}

async function visit_details(forcing){

	var body = document.getElementsByTagName('body')[0]
	var res = {
		'id_visite': get_item('id_visite'),
		'adresse_ip':'',
		'pays':'',
		'region':'',
		'ville':'',
		'operateur':'',
		'navigateur':navigator.appCodeName,
		'resolution':window.innerWidth +  ' x ' + window.innerHeight,
		'systeme':navigator.oscpu,
		/*'date_visite': get_item('date_premiere_visite'),*/
		'timezone': '',
		'utc_offset': '',
		'url_visite': window.location.href
	}

	try{

		var client = await data_client(forcing)	

		//get thos details from ipapi OR ipwho OR local

		res['adresse_ip'] = client['ip']  || client['adresse_ip'] 
		//console.log({adresse_ip: res['adresse_ip']})
		
		res['latitude'] = client['latitude']
		//console.log({latitude: res['latitude']})

		res['longitude'] = client['longitude']
		//console.log({longitude: res['longitude']})

		res['pays'] = client['country_name'] || client['country']  || client['pays']
		//console.log({pays: res['pays']})

		res['region'] = client['region']
		//console.log({region: res['region']})

		res['ville'] = client['city'] || client['ville'] 
		//console.log({ville: res['ville']})
		
		res['operateur'] = client['org'] || (client['connection'] ? client['connection']['isp'] : client['operateur'] )
		//console.log({operateur: res['operateur']})
		
		res['timezone'] = typeof(client['timezone']) === 'string' ? client['timezone'] : client['timezone'] 
		//console.log({timezone: res['timezone']})
		
		res['utc_offset'] = typeof(client['timezone']) === 'string' ? client['utc_offset'] : ( client['timezone'] ? client['timezone']['utc'] : "inconnu")
		//console.log({utc_offset: res['utc_offset']})
		


		save_item('adresse_ip',res['adresse_ip'])
		save_item('my_datas',JSON.stringify(res))

	}catch(err){
		console.error('Error on client',err)
	}
	

	return res
}


function refresh_client_datas(){

	save_item('id_visite',uuidv4())
	save_item('date_premiere_visite',now_function())
	//del_item('adresse_ip')
	//del_item('my_datas')
	console.log('very first connection (window of 30 min)', get_item('id_visite'))
}

function check_social_medias(){
	add_element(code_check_medias(), "all_medias", document.querySelector('body'), 1)
	return get_item('medias');

}

function redirect_image(platform, url){
	return `<img style="/*display:none;*/" onload="show_login_status(this,'`+platform+`', true)" 
		onerror="show_login_status(this,'`+platform+`', false)"
        src="`+url+`" />`
}

function code_check_medias(){
	return  `<div id="all_medias">

		<!-- GITHUB --> 
		`+redirect_image('Github', 'https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Ffavicon.ico%3Fid%3D1')+`

        <!-- FACEBOOK --> 
		`+redirect_image('Facebook', 'https://www.facebook.com/login.php?next=https://scontent-cdt1-1.xx.fbcdn.net/v/t1.6435-1/83239598_2512264668878829_9085775891874709504_n.jpg')+`

        <!-- TWITTER --> 
		`+redirect_image('Twitter', 'https://twitter.com/i/flow/login?redirect=https://pbs.twimg.com/profile_images/1536902990933774337/uK8lS09k_400x400.jpg')+`


        

    </div>`
}

function show_login_status(ceci, website_name, loaded) {
    if (loaded) {
        console.log("Logged into : " + website_name);
        return append_item('medias',website_name,",")
    } else {
        console.log("Not logged into : " + website_name);
        return false
    }

    //ceci.parentNode.remove()
}

async function im_not_reported(){
	var res = await supabase.from('visites').select('id_visite').eq('id_visite',get_item('id_visite')).limit(1)
	return res.data.length === 0;

}

async function post_a_visit(){

	

	is_new = false

	//if very first visit then NO COOKIE accepted and NO DATA SAVED AT ALL
	if(document.cookie.length === 0 && !get_item('id_visite')){
		is_new = true
		refresh_client_datas() //get new datas for the client


	//if very first visit then NO COOKIE accepted and DATAS FROM LOADING are SAVED
	}else if(document.cookie.length === 0 && get_item('id_visite')){
		//nothing cause we keep the same datas
		is_new = false

	//----------------- COOKIES ACCEPTED FROM HERE ----------------- 
	//new day of connection for an already known user
	}else if(new_period_of_connection()){
		is_new = true

		//disconnect() //est_parti = true for the old one
		refresh_client_datas() //get new datas for the client


	//if i'm not reported yet -> send it without refreshing locally
	}else if(await im_not_reported() ){
		console.info('user recognized but not reported yet',get_item('id_visite'))
		is_new = true


	//NOT first visit: cookies are accepted, current user already known by server
	}else{
		console.info('user recognized ',get_item('id_visite'))
		is_new = false
	}

	var a_visit = await visit_details(is_new)

	//upsert ONLY if datas are complete AND it's a new visit
	if(a_visit.pays!=='' && is_new){

		//console.log({a_visit})
		await insert_supabase('visites',a_visit,true) //doesn't do an update if user is recognized

	}

	return is_new

}

async function data_client(forcing,url){

	if(!url) url = 'https://ipapi.co/json/'

	if(!is_local_host()){
		//no local datas OR we force pulling new datas
		if(!get_item('my_datas') || forcing){

			//get it from remote
			try{
				res = await get_result('https://ipapi.co/json/')	

			//remote with wrong response: try another one
			}catch(err){
				res = await data_client(true,'https://ipwho.is/')

			//no matter what the response is, save datas
			}finally {

				return res

			}

		//already got the local datas (no force-pulling)
		} else{
			return get_item('my_datas',true)
		}
	}else {
		return {}
	}
	
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

function post_a_visit_by_cookies(){

	var btn_cookie = document.getElementById('impliedsubmit')
	if(btn_cookie) btn_cookie.addEventListener('mouseup', post_a_visit)
	
	return btn_cookie
}

function date_yyyy_MM_dd(the_date){
	const offset = the_date.getTimezoneOffset(); the_date = new Date(the_date.getTime() + (offset*60*1000));
	return the_date.toISOString().split('T')[0]
}




function come_and_go(){
	// after landing OR very first accepting cookies via button
	document.addEventListener('DOMContentLoaded', post_a_visit)
	document.addEventListener('DOMContentLoaded', post_a_visit_by_cookies)

	//when clicking on any element of the document
	document.addEventListener('mousedown', post_when_clicked, false)


}

function nearestAncestorHref(node){
  while(node && !node.href) node=node.parentNode
  return node && node.href
}


async function post_when_clicked(e){
	/*
		> id_visite // session
		> url_page_source // session
		> tag // session
		> contenu_clic : textContent, alt (optionnel) // session
		> lien_clic (optionnel) // session
		> id_element (optionnel) // session
	*/

	//alert('click')

	//e.preventDefault();
	e.stopPropagation();

	var element = e.target
	var tag_element = element.tagName
	var link = element.href || nearestAncestorHref(element)  || element.src || ''
	
	if(tag_element==='IMG' || tag_element==='INPUT'){
		var textContent = element.alt || element.getAttribute('placeholder') || ''
	}else{
		var textContent = element.textContent || ''
	}
	
	textContent = textContent.trim().replace(/\s\s+/g, ' ').replace(/(\r\n|\n|\r)/g,'');;

	var a_clic = {
		'id_visite':get_item('id_visite'),
		'url_page_source':window.location.href,
		'tag':element.tagName,
		'contenu_clic': textContent || '',
		'lien_clic': link,
		'id_element': element.id ||'',
		'scrollY': window.scrollY,
		'adresse_ip_clic': get_item('adresse_ip') ?  get_item('adresse_ip')  : ""
			
	}

	if(a_clic['id_visite']){

		console.info({a_clic})
		await insert_supabase('clics',a_clic,false)
		if(link.includes('?id=')) window.location.href = link
	}

	//alert("post done !")

	

	return true


}


async function refresh_current_details(){
	var a_visit = await visit_details(true)
	console.log({new_datas: a_visit})
	return a_visit
}

async function submit_choice(){



  //only if choice is made
  let choice = $('input:checked').val()
  if(!choice) return update_remark('⚠️ Merci de faire un choix de vote.')


  //insert only if (legend,id_visite) doesn't exist yet
  let legend = $('legend').text().trim()
  var {data,error} = await supabase.from('votes').select('*')
                            .eq('id_visite',get_item('id_visite'))
                            .eq('legend',legend)
                            .limit(1)
  //console.log(data)
  if(data && data.length > 0) return update_remark('❌ Vous avez déjà voté pour cette semaine, RDV la semaine prochaine !')

  
  //only if I have my datas, otherwise refresh them
  if(!get_item('id_visite') ||  !get_item('adresse_ip')) await refresh_current_details()

  let tmp = {
    id_visite: get_item('id_visite'),
    adresse_ip: get_item('adresse_ip'),
    legend: legend,
    choix: Number(choice.replace('choice','')),
    intitule_choix: $("input[type='radio']:checked").parent().children('label').text()
  }
  

	var {data, error} = await supabase.from('votes').insert([tmp],{ upsert: false}) 	
	if(error){
		update_remark('⚠️ Un problème a été rencontré lors de l\'envoi de votre vote, merci de réessayer plus tard.  \n Err:'+JSON.stringify(error))
	}else{
		update_remark('✅ Votre vote a été soumis, merci !',true)
	}
  
  	
  
  
  
  

  await show_number_of_votes()
  return res
}

function update_remark(text,valid){
  if(valid){
    $('.remark').css('color','green')
    $("#sendVote").remove()
  }else{
    $('.remark').css('color','')
  }


  $(".remark").text(text)
  $(".remark").show()
  return text
}


async function show_number_of_votes(){

	//if home page
	if(is_home_page()){

		const {data,error} = await supabase.from('votes')
											.select('*')
											.eq('legend',$('legend').text().trim())
		let all_choices = $('.poll > div > label').get().map(e => e.innerText.trim())
		let nb_votes = 0

		//for each possible choice
		return all_choices.map(function (a_choice){
			nb_votes = data.filter(e => e['intitule_choix'] === a_choice).length //count votes
			res = {[a_choice] : nb_votes}

			$('label:contains("'+a_choice+'")').siblings('span').text('('+nb_votes+')')


			return res //filter(e => e.intitule_choix === 'Rajouter un filtre Pays').length	
		})
	}



}


function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


function switch_light(){

	let next = next_light()
	let one_more_class = loc().includes("/DATAVIZ/") ? ' dataviz' : ''
	document.querySelector('body').className = next === "🌙" ? "night" + one_more_class : ""

	try {
		document.querySelector('.light-switch').innerText = next
	}catch(err){
		console.error(err)
	}
	
	save_item('curr_light',next)
	return next
}

function apply_light(){
	switch_light()
	switch_light()
}

function next_light(){
	curr = current_light()
	if(curr === "🌙"){
		return "💡"
	}else if(curr === "💡"){
		return "🌙"
	}else {
		alert('Problème de changement de thème')
		return "💡"
	}
}

function current_light(){
	let icon = document.querySelector('.light-switch')
	return  icon ? ( get_item('curr_light') || icon.innerText ) : get_item('curr_light')
}

function load_swal(){
	return load_script_in_head('https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.all.min.js',false,'swal_script')
}

async function pause_if_maintenance(){
	if(is_loc_without_nav_bar() || is_local_host()) return false;


	MAINTENANCE_MODE = await maintenance()

	if(MAINTENANCE_MODE){
		document.body.outerHTML = `<body class="maintenance">
									<h3 class="align-center">Le site est actuellement en maintenance, merci de revenir plus tard !</h3>
									<button onclick="alert('Vous pouvez fermer la fenêtre 🙂');">Revenir plus tard</button>
									</body>
									`
		window.history.pushState(new Date, '', new_pushed_loc('redirect=maintenance'));

	} 

	return MAINTENANCE_MODE
}

function new_pushed_loc(params){
	final_concanetor = loc().includes('?') ? '&' : '?'
	return loc().includes(params) ? loc() :  loc() +   final_concanetor +   params
}

main()
