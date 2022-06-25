
let DEBUGGING_MODE = false
const { createClient } = supabase
supabase = createClient(racine_data(),  apikey())


async function subs(){

  const sub_click = await supabase
      .from('clics')
      .on('INSERT', payload => {
        log(payload,true)

      })
      .subscribe()

  const sub_visites = await supabase
      .from('visites')
      .on('INSERT', payload => {
        log(payload,true)

      })
      .subscribe()

  return [sub_click, sub_visites]
}

function racine_data(){
	return 'https://kxdokvtvscvjuwzgmvei.supabase.co'
}



function apikey(){
	return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZG9rdnR2c2N2anV3emdtdmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU2MTk3MTQsImV4cCI6MTk3MTE5NTcxNH0.ViTcu3L79EkuvGvyDiSqwdpgJ0MQFbg8nL1vO0tTcDk'
}


async function get_donnees_site(){
	await select_all('tout',creer_dataviz)
}

get_donnees_site()
$(document).on('click',function(){
  DEBUGGING_MODE = false
  refresh_viz1()
  DEBUGGING_MODE = true
})

function log(content,json_mode,forcing){
  if (DEBUGGING_MODE || forcing) return json_mode ? console.log({[content]:content}) : console.log(content)
}


function refresh_content(selector,content,index){
  log((selector + ',' + content +',' + index).split(','))
  return $($(selector)[index]).text(content)
}

function refresh_labelcount_viz(label_selector,fields_to_display,index){
  nb = count_elements(final_datas,fields_to_display,true,true)
  refresh_content(label_selector,nb,index)

  return Number(nb)
}


function seriesOf(typeChart,datas){
  let res = []

  if(typeChart === 'gauge'){//datas = {'min':min,'max':max,'value':value}
    res = [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: datas['min'],
        max: datas['max'],
        radius: '100%', // this
        splitNumber: 5,
        progress: {
          show: true,
          roundCap: true,
          width: 10
        },
        pointer: {
          length: '75%',
          width: 3,
        },
        axisLine: {
          roundCap: true,
        },
        axisTick: {
          splitNumber: 10
        },
        splitLine: {
          length: 10,
        },
        detail: {
          width: '60%',
          valueAnimation: true,
          formatter: function (value) {
            return value.toFixed(1) + ' %';
          },
        },
        data: [{value: datas['value']}]
    }]


  }else{
    res = datas.map(function(e){
      tmp = {}
      tmp['type'] = typeChart;
      tmp['data'] = e;
      return tmp
    })


  }
  return res
}

function result_category_part(list_category,nb_occurences){
  return {'list_category': list_category, 'nb_occurences': nb_occurences}
}

function count_category_part(datas,fieldName_category,fieldID_to_count,percentage_mode, optional_categoryValue){
  let temp = keep_unique_records(datas,fieldID_to_count,fieldName_category)
  log(temp,false)

  temp = unique_objects_array(temp,fieldID_to_count)
  log(temp,false)

  let list_category = get_elements(temp,fieldName_category,true,fieldName_category,false,true)
  let nb_occurences = countOccurrences(temp,list_category)

  let res = result_category_part(list_category,nb_occurences)
  log(res, false,true)
  
  if(percentage_mode) nb_occurences = percentage_of_total(nb_occurences,2)
  res = result_category_part(list_category,nb_occurences)
  log(res, false,true)
  
  
  if(optional_categoryValue){

    //find index of the optional_categoryValue in list_category
    let indexOfValue = list_category.map(e => e.toLowerCase()).indexOf(optional_categoryValue.toLowerCase())
    log(indexOfValue)

    //use this index with list_category,nb_occurences
    if(indexOfValue >= 0){

      list_category = [list_category[indexOfValue]]
      log(list_category,false,true)
      nb_occurences = [nb_occurences[indexOfValue]]
      log(nb_occurences,false,true)

    }else{
      list_category = [optional_categoryValue]
      nb_occurences = [0]
    }

    //update result
    res = result_category_part(list_category,nb_occurences)
    log(res,false,true)
  }
  return  res
}

function refreshEchart(typeChart,parentSelector,parentSelectorIndex,JsonData,title,xFieldName,xFieldOrderBy,xFieldType,seriesFieldNameToCount,with_cumulate,with_percentage_only) {
  log('\n\n\n\n\n')



  let myChart = echarts.init($(parentSelector)[parentSelectorIndex], null);
  let displayed_datas = []
  let xDatas = []
  let yDatas = []

  log(typeChart)
  if(typeChart !== 'gauge'){
    //let temp = unique(keep_fields(JsonData,xFieldName,xFieldOrderBy,seriesFieldNameToCount)); //keep only the 3 fields we need
    let temp = keep_unique_records(JsonData,xFieldName,xFieldOrderBy,seriesFieldNameToCount)
    temp = sort_by(temp,xFieldOrderBy) // order by xFieldOrderBy
    log(temp)



    xDatas = get_elements(temp, xFieldName, true, xFieldOrderBy, false, true) //unique(temp.map(row => row[xFieldName])) // get unique X elements
    log(xDatas)

    yDatas = xDatas.map(xElementValue => count_elements(temp, seriesFieldNameToCount,true,true,xFieldName,xElementValue)) // for each X element, count seriesFieldNameToCount from temp
    log(yDatas)


    //show WITH accumulate
    displayed_datas = with_cumulate ? [yDatas,accumulate(yDatas)] : [yDatas]
    log(displayed_datas)

    //show ONLY percentage
    displayed_datas = !with_percentage_only ? displayed_datas : [percentage_of_total(yDatas)]
    log(displayed_datas)
  }else{
    displayed_datas = JsonData // {min, max, value}
  }


  let displayed_series = seriesOf(typeChart,displayed_datas)



  // specify chart configuration item and data
  let option = {}

  if(typeChart !== 'gauge'){
    option = {
      title: {
        text: title
      },
      tooltip: {
        trigger: 'item' //todo: formatter: function(params){return TOUTES_LES_DONNEES_UNIQUES_JsonData par rapport à une visite}
      },
      xAxis: {
        type: xFieldType,//'category',
        data: xDatas
      },
      yAxis: {
        axisLabel: {
          formatter: '{value}' + (with_percentage_only ? ' %' : '')
        },

      },
      series: displayed_series,
      grid: {
        left: 30,
        bottom: 30
      }
    };
  }else {
    option = { 
      tooltip: {trigger: 'item'},
      series: displayed_series
    }
  }

  myChart.setOption(option);



  $(window).on('resize',function(){
      myChart.resize();  
  });
  return myChart
}

function refresh_viz1(){

  let viz1 = $("#viz1")
  let label_selector = '.viz-label > .viz-text'

  // nb adresses IP, visites, clics, nb moyen de clics par visites 
  nb_ip = refresh_labelcount_viz(label_selector,'adresse_ip',0)
  nb_visites = refresh_labelcount_viz(label_selector,'une_visite',1)
  nb_clics = refresh_labelcount_viz(label_selector,'id_clic',2)
  ratio = (nb_clics/nb_visites)
  refresh_content(label_selector,ratio.toFixed(2),3)


  //refreshEchart(typeChart, parentSelector, parentSelectorIndex, JsonData, title, xFieldName, xFieldOrderBy, xFieldType, seriesFieldNameToCount, with_cumulate, with_percentage_only)

  //pourcentage de mobiles
  part_mobile = count_category_part(final_datas,'type_appareil','une_visite',true,'mobile')
  part_mobile = part_mobile['nb_occurences'][0]
  gauge_datas = {min: 0, max:100, value:part_mobile }
  refreshEchart('gauge','.viz-gauge',0,gauge_datas)


  //évolution nb visites | affluences
  refreshEchart('line','.chart-element',0,final_datas,'','date_heure_visite','date_visite','category','une_visite',false,false)
  refreshEchart('bar','.chart-element',1,final_datas,'','heure_visite_str','heure_visite','category','une_visite',false,true)
  



}





function creer_dataviz(){
	log({final_datas})

	//viz1
  refresh_viz1()


	//viz2 : 



	//viz3 : 

}


async function get_canaux(){
	const {data, error} = await supabase.from('canaux').select('*')
	log({data})

	return data
}








// ---------------------------------------------------------------- USEFUL FUNCTIONS ----------------------------------------------------------------


final_datas = []
async function select_all(name_table,function_callback,depth,from,into){



  //console.error({function_callback})
  let more_datas = []

  //>=2nd page
  if(from && into){
    depth += 1
    count = count !== 9999999999 && count > 0 ? count : await number_of_rows(name_table,'*')
    let {data,error} = await supabase
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
    final_datas = unique(final_datas);
    return data

  //very first query with only 1 element
  }else{

  	final_datas = []

    depth = 0 //no depth at the beginning

    //count number of elements
    count = 9999999999
    //console.warn({count})

    let  {data,error} = await supabase
        .from(name_table)
        .select('*')

    add(data)
    await check_if_datas_complete_or_recursive_call(name_table,count,data,depth,from,into,function_callback)
  }
  
}

function add(more){
  return Array.prototype.push.apply(final_datas,more);
}

function unique(array){
  return [...new Set(array)];
}

function unique_objects_array(a,identifier){
  return [...new Map(a.map(item =>  [item[identifier], item])).values()].filter(e => e[identifier]);
}

async function check_if_datas_complete_or_recursive_call(name_table,count,data,depth,from,into,function_callback){
  /*
  console.log({final_datas})
  console.log({count})
  */

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


async function number_of_rows(tab,field_count){
  
  url =racine_data() + '/rest/v1/rpc/number_of_rows?apikey=' + apikey()
  return await post_resultat_asynchrone(url, {"tab":tab, "field_count":field_count})

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
}

function sort_by(array,field_name,invert){
  return array.sort(GetSortOrder(field_name,invert));
}

//Comparer Function    
function GetSortOrder(prop,invert) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return invert ? -1 : 1;    
        } else if (a[prop] < b[prop]) {    
            return invert ? 1 :-1;    
        }    

        return 0;    
    }    
}   

function get_fields_values(array,fields){
  let res = []

  for(my_index = 0;my_index<fields.length;my_index++){
    res.push(array.map(e => e[fields[my_index]]))
  }

  return res
}

function get_elements(array,fields,only_unique,sortby_fieldname,invert,ignore_null){

  if(sortby_fieldname) array = sort_by(array,sortby_fieldname,invert)

  fields = fields.split(',')
  let fields_val = get_fields_values(array,fields)
  //console.log({fields_val})


  fields_val = fields.length === 1 ? fields_val[0] : fields_val
  //console.log({fields_val})

  let res = only_unique ? unique(fields_val) : fields_val
  //console.log({res})

  if(ignore_null) res = res.filter(e => e !== null)

  return res
}

function count_elements(array,fields,only_unique,ignore_null, fixed_field_name,fixed_field_value){
  if(fixed_field_name && fixed_field_value){
    array = array.filter(e => e && e[fixed_field_name] === fixed_field_value)
    return count_elements(array,fields,only_unique,ignore_null)
  }

  let els = get_elements(array,fields,only_unique,false,false,ignore_null)
  return els.length
}

const accumulate = arr => arr.map((sum => value => sum += value)(0));
const percentage_of_total = (arr,nb_of_decimals) => arr.map(e => Number((100*(Number(e)/accumulate(arr).pop())).toFixed(   (nb_of_decimals ? nb_of_decimals : 1) ))  )
const countOccurrences = (a,b) => b.map(e => a.filter(c => c['type_appareil'] === e).length)

function keep_fields(obj, ...keys){
  return sort_by(obj.map(e => pick(e, ...keys)),keys[0])
}

function keep_unique_records(obj, ...keys){
  return unique( keep_fields(obj, ...keys))
}


const pick = (obj, ...keys) => Object.fromEntries(
  keys
  .filter(key => key in obj)
  .map(key => [key, obj[key]])
);

const inclusivePick = (obj, ...keys) => Object.fromEntries(
  keys.map(key => [key, obj[key]])
);

const omit = (obj, ...keys) => Object.fromEntries(
  Object.entries(obj)
  .filter(([key]) => !keys.includes(key))
);
