
//const { createClient } = supabase

function give_alert(content,is_ok){
	document.getElementById('remark').innerText = content
	document.getElementById('remark').className = 'remark' +  (is_ok ? ' ok' : ' nok')
}
async function try_connect(){
	const PROJECT_ID = document.getElementById('PROJECT_ID').value.trim()
	const API_KEY = document.getElementById('API_KEY').value.trim()

	if(!PROJECT_ID) return give_alert('PROJECT_ID missing.')
	if(!API_KEY) return give_alert('API_KEY missing.')
	show_list(false)

	let URL = url_project(PROJECT_ID)

	try{

		supabase = createClient(URL,  API_KEY)
			give_alert("CONNECTED ! ",true)

		let list_tables = await get_table_names(supabase)
		append_table_list(list_tables)
		give_alert("SEE TABLE NAMES BELOW.",true)

		return supabase

	}catch(err){
		give_alert('ERROR CONNECTING TO SUPABASE PROJECT: '+JSON.stringify(err))
	}


}

function append_table_list(list_tables){
	let final_html = '<option value="">CHOOSE TABLE TO EXPORT HERE</option>'
	Object.keys(list_tables).forEach(function(tableName){
		tableName = tableName.includes('/rpc/') ? "" : tableName
		tableName = tableName.replace('/','')

		if(tableName) final_html += '<option value="'+tableName+'">'+tableName+'</option>'
	})

	document.getElementById('TABLE_NAMES').innerHTML = final_html;
	show_list(true)


}

function show_list(yes){
	document.getElementById('getTables').style.display = yes ? 'inline' : '';

}

function url_project(PROJECT_ID){
	if(PROJECT_ID.includes('https://')) return PROJECT_ID

	return 'https://'+PROJECT_ID+'.supabase.co'
}

async function get_table_names(supabase){
	let res = await supabase.from('')
	return res['data']['paths']
}

async function try_export_table(){
	const TABLE_TO_EXPORT = document.getElementById('TABLE_NAMES').value
	const DELIMITER = document.getElementById('DELIMITER').value

	if(!TABLE_TO_EXPORT) {
		document.getElementById('results').innerText = "PLEASE CHOOSE A TABLE."
		document.getElementById('results').className = "nok"
		return false;
	}

	document.getElementById('results').className = ""

	const {data, error} = await supabase.from(TABLE_TO_EXPORT).select('*')
	const opts = {
		quote : '"',
		escapedQuote : "'",
		delimiter : DELIMITER
	}
	try {
		let res = json2csv.parse(data,opts)
		download(res,TABLE_TO_EXPORT)
	    return res
	} catch (err) {
		document.getElementById('results').innerText = ""
		console.error(err);
		give_alert(err)
	}

}

function zero_padding(el){
	if(el && el.toString().length === 1) return '0' + el

	return el
}

function download(res,tablename){
	let now = new Date
	let final_name = tablename + ' ' + now.getFullYear() + '-' +  zero_padding(now.getMonth()) + '-' + zero_padding(now.getDate()) + ' ' + zero_padding(now.getHours()) + 'h' + zero_padding(now.getMinutes()) + 'min' + zero_padding(now.getSeconds()) 

	const link = document.createElement('a');
	link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res));
	link.setAttribute('download', final_name+'.csv');
	link.click()
	link.remove()
}

function save_visites_et_clics(){
	let list = ['visites','clics','ip_ignore','likes','prod','votes','canaux']

	list.forEach(function(tablename){
		document.getElementById('TABLE_NAMES').value = tablename
		try_export_table()
	})
	
}

async function main(){	
	await try_connect()
	save_visites_et_clics()	

}

main()
