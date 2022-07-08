hljs.highlightAll();
document.querySelector('.back').style.display = window.location.href.includes('/projets-automatisations/') ? 'initial' : 'none'
document.querySelector('.like-section').style.display = window.location.href.includes('/projets-automatisations/') ? 'flex' : 'none'
refresh_likes_and_share();

async function send_like_or_share(type_engagement){

	if(type_engagement === 'partage'){
		copy(window.location.href)
	}

	const tmp = {
		id_visite: get_item('id_visite') || '',
		adresse_ip_like: get_item('adresse_ip') || '',
		id_projet: document.querySelector('#title-page').innerText,
		type_engagement: type_engagement
	}
	const {data, error} = await supabase.from('likes').insert([tmp],{upsert: false}) 

	if(error && type_engagement === 'like'){
		custom_alert('✅ Vous avez déjà liké ce contenu.')
	}

	await refresh_likes_and_share()
}

async function refresh_likes_and_share(){
	const {data, error} = await supabase.from('likes').select('*').eq('id_projet',document.querySelector('#title-page').innerText)
	
	if(data){

		//likes
		const nb_likes = data.filter(e => e['type_engagement'] === 'like').length
		document.querySelector('#like-button').parentNode.setAttribute('clicks', nb_likes)

		//shares
		const nb_shares = data.filter(e => e['type_engagement'] === 'partage').length
		document.querySelector('#share-button').parentNode.setAttribute('clicks', nb_shares)

	}
}

function copy(input) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(input).then(() => {
      custom_alert('✅ Lien copié !\n\n\n' + input);
    }, (err) => {
      custom_alert('❌ Impossibile de copier le lien.\n\n\n' + err);
    });
  } else if (window.clipboardData) {
    window.clipboardData.setData("Text", input);
  }
}

function custom_alert(content){
	const alerter = document.querySelector("#snackbar")
	alerter.innerHTML=content;
	alerter.className="show";
	setTimeout(function(){
		alerter.className=""
	},3000)

}