const { createClient } = supabase
const prefix = loc() === '/' ||  loc() === '/index' ? '/assets' : '../assets' 
supabase = createClient(racine_data(),  apikey())


var sep = '\t'
var final_datas = []

function list_posts_linkedin(){
	return ['6777136376266682369','6777861229898670081','6778585945819123712','6779673164571000832','6782194816580100097','6782919591560548352','6784731509396926464','6936941793640886272', '6944551923622531072']
}


const ref_project_open = 'ouvertes'
const ref_project_perso = 'personnel'
const ref_project_auto = 'automatisations'
const ref_project_linkedin = 'linkedin'


//title card
const list_title = loc().includes(ref_project_open) ? ['Inspections sanitaires', 'Véhicules commercialisées', 'Aide au choix de formation ParcourSup'] : 		
					loc().includes(ref_project_perso) ? ['Un projet Agile', 'Les mots de la Bible en anglais', 'Mon historique Youtube'] : []



//id viz
const list_id_viz = loc().includes(ref_project_open) ? ['viz1655731628354','viz1655737537459','viz1655737600382'] :
					loc().includes(ref_project_perso) ? ['viz1655747869171','viz1655747945236','viz1655748303418'] : []

//title online
const list_title_viz = loc().includes(ref_project_open) ? ['InspectionssanitairesAlimConfiance/Nombretotaldtablissementsinspects','Etudedesmodlesdevhiculescommercialiss/Conclusion','Parcoursup_16538279647500/ParcourSup2018-2021']:
					loc().includes(ref_project_perso) ? ['Unprojetagile/Rsum','StudyingBible/Numberofwordsversesperbookname','Personalyoutubehistory/Viewsperhourthroughyears'] : []



const list_redim_viz = [`vizElement.style.width = '100%';
vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';`

,


`if (divElement.offsetWidth > 800) {
    vizElement.style.width = '100%';
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
} else if (divElement.offsetWidth > 500) {
    vizElement.style.width = '100%';
    vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
} else {
    vizElement.style.width = '100%';
    vizElement.style.height = '2177px';
}`

,



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
}`]





//content card
/*
const list_content = [`<strong>31183</strong>. C'est le nombre d'inspections sanitaires en France entre Juin 2020 et Juin 2021, et parmi tout ça, c'est*: <br>
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
			`]
			*/









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

function is_local_host(){
	return window.location.href.toLowerCase().includes('localhost') || window.location.href.toLowerCase().includes('127.0.0.')
}

function is_home_page(){
	return !(location.pathname !== '/' && location.pathname !== '/index' && location.pathname !== '/index.html')
}

async function insert_supabase(nametable,datas,upsert_mode){
	//console.log('inserting to '+nametable,datas)
	if(is_local_host()) return ;

	const { data, error } = await supabase
		.from(nametable)
		.insert(datas, { upsert: upsert_mode, returning: 'minimal' })

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
	                    <li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#technos">TECHNOS</a>
	                    </li><li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="/#dataviz-site-web">DATAVIZ EN TEMPS REEL DU SITE</a></li>
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

function post_resultat_asynchrone(url,data_json){
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

	return objet_envoi;
	console.log({objet_envoi})
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
    //console.warn({data})
    add(data)
    more_datas = await check_if_datas_complete_or_recursive_call(name_table,count,data,depth,from,into,function_callback)
    //console.warn({more_datas})
    if(more_datas) add(more_datas)
    //console.warn({final_datas})

    if(function_callback) function_callback(data)
    final_datas = [...new Set(final_datas)];
    return data

  //very first query with only 1 element
  }else{

    depth = 0 //no depth at the beginning

    //count number of elements
    count = 9999999999
    //console.warn({count})

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
  console.log({final_datas})
  console.log({count})
  //alert("check")
  if(final_datas.length < count  && data){

    depth = depth+1
    //console.warn({depth})

    from = data.length * depth
    //console.warn({from})

    into = Math.min(from + data.length -1,count-1)
    //console.warn({into})

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
	console.warn({sep})
	console.warn({final_datas})

	csv = ConvertToCSV(final_datas)
	console.warn({csv})

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

function main(){
	var body = document.getElementsByTagName('body')[0]
	add_element(navbar(), 'navbar-site', body, 1)
	add_nav_items_events()
	add_element(footer(), 'footer-site', body, -1)

	show_btn()

	titles()
	contents()
	come_and_go()
	google_tag() //only on NO LOCALHOST

	parse_parameters()
	
}

function show_btn(){
	var btn = document.getElementById('btn-download')


	if(btn){

		document.addEventListener('DOMContentLoaded',  function() {
		  btn.removeAttribute('hidden')
		});		
	}

	
}

function parse_parameters(){
	const urlParams = new URLSearchParams(window.location.search)

	if (loc().includes(ref_project_open) || loc().includes(ref_project_perso)){
		if(urlParams.get('id')) expand_card(urlParams.get('id'))	
	}
	
}

function action_when_ready(){

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


function load_script_in_head(script_url, isfirst){
	var head_of_page = document.querySelector("head")
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = script_url;
	
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
	return document.title.split('|')[1].trim()
}

function title_project(){
	var name = page_name()
	return '<h1 class="title mbr-section-title align-center mb-4 mbr-fonts-style display-2" id="title-section"><strong>'+name.toUpperCase()+'</strong></h1>'

	
}

function get_subtitle(page_name_str){

	if(page_name_str.includes(ref_project_open)){
		return `Les <strong>données ouvertes (OpenData)</strong> sont des données accessibles à tous.
		Elles sont généralement fournies par les organismes officiels, les ministères, et parfois même les entreprises et associations.`

	}if(page_name_str.includes(ref_project_perso)){
		return "J'ai récupéré mes données depuis différentes plateformes et j'ai découvert des indicateurs très intéressants sur mes activités."

	}if(page_name_str.includes(ref_project_auto)){
		return ""

	//nothing on linkedin
	}if(!page_name_str.includes(ref_project_linkedin)){
		return ""

	}
}

function reset_cards(id_viz){

	
	$('#close').remove()
	$(".tableau").children().remove()
	$("#script_viz").remove()
	$('.card').removeClass('expanded').addClass('expandable')

	if(id_viz){
		$('[id_viz="'+id_viz+'"]')[0].addEventListener('click', switch_card)
		$('[id_viz="'+id_viz+'"]')[0].href = '?id='+$('[id_viz="'+id_viz+'"]')[0].id//NEW
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
	redim_viz = list_redim_viz[list_id_viz.indexOf(id_viz)]

	add_element(`<div id="close" onclick="reset_cards('`+id_viz+`')" class="popupCloseButton">×</div>`, 'close', e.parentNode, 1) 
	e.removeAttribute('onclick')

	//add on url if needed
	//if(!loc().includes('?id=' + id)) window.history.pushState(new Date, '', loc().split('?')[0] +'?id=' + id);

	//load viz
	see_viz(e,id_viz,title_viz,redim_viz)
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



function see_viz(e,id_viz,title_viz,redim_viz){
	add_element(render_a_viz(id_viz,title_viz),id_viz,e.querySelector(".tableau"),1)
	load_script_text_in_body(script_viz(id_viz,redim_viz),'script_viz')
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
		add_element(subtitle_of_project(get_subtitle(page_name())), 'explanation', document.getElementById('page-content'), 2)
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

//add_element(one_card("Une carte","Le contenu d'une carte"),"une carte", $("#project-content"),1 )
function one_card(title,content,id_viz,title_viz){
	return `<a href="?id=`+title_to_id(title)+`" id="`+title_to_id(title)+`" class="card expandable" style="overflow: auto;" onclick="return switch_card(this)" id_viz=`+id_viz+` title_viz=`+title_viz+`>
                <div class="card-wrapper" style="overflow: auto;" >
                	<div class="card-box align-center">
                		<h5 class="card-title mbr-fonts-style display-7"><strong>`+title+`</strong></h5>
                		<p class="card-text mbr-fonts-style display-7 align-left">`+content+`</p>
	                
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
      <param name='tabs' value='yes' />
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

function open_datas(){

	load_css_in_head(prefix + "/timeline/style.css")
	load_script_in_head("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js",false)

	var result = ""

	for (let i = 0; i < list_title.length ; i++) {
		//one_card(title,content,id_viz,title_viz)
		result += one_card(list_title[i],"",list_id_viz[i], list_title_viz[i], list_title[i].replaceAll(" ","-"), document.querySelector("#project-content"))
	}
	

	return big_section('<div class="container-fluid">'+result+'</div>','3%')
}

function personal_datas(){
	return open_datas()//big_section('')
}

function automates(){
	return loading()//big_section('')
}


function content_of(page_name_str){
	page_name_str = page_name_str.toLowerCase().trim()
	
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

	var content = content_of(page_name())
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
	//console.warn(diff_date)

	//if the saved date doesn't exist THEN it's a new connection
	//if the time elapsed is more than 30min OR 1h THEN it's a new connection
	return !get_item('date_premiere_visite') || diff_date.h >= 1 || diff_date.min >= 30 
}

async function visit_details(){

	del_item('adresse_ip')

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

		var client = await data_client()	
		save_item('adresse_ip',client['ip'])

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
		console.error('Error on client',err)
	}
	

	return res
}


function refresh_client_datas(){

	save_item('id_visite',uuidv4())
	save_item('date_premiere_visite',now_function())
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


	//NOT first visit: cookies are accepted, current user already known by server
	}else{
		//console.warn('user recognized ',get_item('id_visite'))
		is_new = false
	}

	var a_visit = await visit_details()

	//upsert ONLY if datas are complete AND it's a new visit
	if(a_visit.pays!=='' && is_new){

		//console.log({a_visit})
		await insert_supabase('visites',a_visit,true) //doesn't do an update if user is recognized

	}

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

function post_a_visit_by_cookies(){

	var btn_cookie = document.getElementById('impliedsubmit')
	if(btn_cookie) btn_cookie.addEventListener('mouseup', post_a_visit)
	
	return btn_cookie
}

function date_yyyy_MM_dd(the_date){
	const offset = the_date.getTimezoneOffset(); the_date = new Date(the_date.getTime() + (offset*60*1000));
	return the_date.toISOString().split('T')[0]
}


//inutile
async function disconnect(){
	var end_visit = {
		'est_parti': true
	}

	var matches = {
		'date_visite_sans_heure' : date_yyyy_MM_dd(new Date(get_item('date_premiere_visite'))),
		'id_visite': get_item('id_visite'),
		'adresse_ip': get_item('adresse_ip')
	}

	console.log('disconnected to previous session')
	//console.log(end_visit)
	return await update_supabase('visites',end_visit,matches)
}

async function post_quit(e){

	var confirmationMessage = "\o/";
	await disconnect()
	e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
	return;              // Gecko, WebKit, Chrome <34



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
		'scrollY': window.scrollY
			
	}

	if(a_clic['id_visite']){

		console.warn({a_clic})
		await insert_supabase('clics',a_clic,false)
		if(link.includes('?id=')) window.location.href = link
	}

	

	return true


}




main()
