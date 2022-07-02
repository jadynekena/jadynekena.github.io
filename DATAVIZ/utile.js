
let DEBUGGING_MODE = false
supabase = createClient(racine_data(),  apikey())



async function subscribe_supabase(){
  return await supabase
    .from('*')
    .on('*', async function (payload){
      log({payload})
      if(payload.table === 'visites' || payload.table === 'clics'){
        log('------🡺 update viz \n\n\n')

        //await get_donnees_site()

        //insertion ---> on ajoute le dernier element de 'tout'
        if(payload.eventType === 'INSERT'){
          
          //with ip address ---> new visit
          if(payload.new.adresse_ip){
            last_tout = await supabase.from('tout').select('*').eq('une_visite',payload.new.adresse_ip + ' ' + payload.new.id_visite)

          //with id clic ---> new clic
          }else if(payload.new.id_clic){
            last_tout = await supabase.from('tout').select('*').eq('id_clic',payload.new.id_clic)  

          //else ---> we don't know
          }else{
            log({payload},false, true)            
            log('Problème nouvelle visite.',false, true)
            return false
          }
          last_tout = last_tout.data[0]
          log({last_tout})


          final_datas.push(last_tout)
          refresh_all_viz()


        //update or delete ---> get ALL
        }else {

          window.location.href = window.location.href 

        }
        
          
        log({final_datas})
        refresh_all_viz()

      }



  }).subscribe()

}

const tips = {
  'viz1': {ip_unique: `L'adresse IP représente l'identité de votre appareil lorsqu'il est connecté à un réseau.<br/>
            <strong>1 IP = 1 utilisateur unique.</strong>`,

          visite_unique: `Une visite représente une <strong>adresse IP</strong> qui se connecte dans une <strong>durée totale de 30 minutes</strong>.
            <br/> <br/>
            <u><strong>Exemple</strong></u>: une même adresse IP clique sur un élément du site, puis clique sur un autre <strong>31 minutes plus tard</strong> 🡺 cela est considéré comme <strong>2 visites</strong>, car le visiteur a probablement quitté le site, puis est revenu.`,
          
          clic_unique: `Comme son nom l'indique, le nombre de clics recense <strong>toutes les fois où le visiteur clique sur un élément</strong> (texte, bouton, lien, etc).`,
          
          clic_par_visite: `Ce nombre indique le <strong>nombre moyen de fois qu'un visiteur va cliquer</strong> sur un élément pendant sa visite.`,

          ip_revenu: `Lorsqu'une même adresse IP <strong>revient sur le site</strong>, elle est comptabilisée dans cet indicateur.
          <br/>
          Une adresse IP est considérée <strong>revenue</strong> après <strong>30 minutes de sa visite précédente</strong>.
          `,

          part_ip_revenu: `La grande majorité des visites représente la <strong>première découverte du site</strong>, et non la <strong>reconsultation</strong> de celui-ci.`,

          part_mobiles: `Les appareils <strong>mobiles</strong> sont <strong>souvent majoritaires</strong> parmi les visites.
          <br/>
          C'est pourquoi il est important qu'un site web soit <strong>responsive</strong> : le contenu doit s'adapter à la taille de l'écran.`,
          
          evolutions: `Seules les dates-heures ayant reçues <strong>au moins 1 #type_evolution</strong> sont affichées.
          <br/>
          Les dates sont affichées selon l'UTC+002, en référence aux horaires en France.
          `,

          affluences: `Observez les visites soit <strong>par Heure</strong>, soit <strong>par Jour</strong> de semaine, soit <strong>les deux</strong>.
          <br/>Les dates sont affichées selon l'<strong>UTC+002</strong>, en référence aux horaires en France.
          
          `
          }
}
    



    
async function get_donnees_site(){
  final_datas = await select_all('tout')
  creer_dataviz()
}

function main(){

  subscribe_supabase()

  $(document).on('click',function(){
    initial_value = DEBUGGING_MODE
    DEBUGGING_MODE = false
    refresh_all_viz()
    DEBUGGING_MODE = initial_value
  })

  get_donnees_site()
  let theme_to_keep = local_if_dataviz_not_iframe()
  if(theme_to_keep){
    console.warn('showing icon')
    apply_light()
    document.getElementById('switch').style.display= ""
  } else{
    console.warn('hiding icon')
    document.getElementById('switch').style.display= "none"
  }

}

function show_light_icon(){

}

function check_if_collecting_datas(){
  collect_datas = !is_local_host()
  console.warn({collect_datas})
  return collect_datas
}

function refresh_all_viz(){
  refresh_viz1()
}

main()

function log(content,json_mode,forcing){
  if (DEBUGGING_MODE || forcing) return json_mode ? console.log({[content]:content}) : console.log(content)
}

//TOOLTIP FOR LABELS
function refresh_content(selector,content,index,tooltipText){
  log((selector + ',' + content +',' + index).split(','))
  $($(selector)[index]).text(content)
  //$($(selector)[index]).attr('title',tooltipText)

  //on hover : set current tooltip on TEXT and its TITLE
  show_tip_on_hover($(selector)[index],tooltipText)
  show_tip_on_hover($($(selector)[index]).prev()[0].firstElementChild,tooltipText)

  return content

}

function show_tip_on_hover(nodes,tooltipText){
  $(nodes).hover(
    function(){
      show_tip(true,tooltipText)
  },function(){    
      show_tip(false)
  })

}

function show_tip(yes,tooltipText){

    if(yes){
    $(".current_tooltip").html(tooltipText)  
      $(".current_tooltip").show()
    } else{
    $(".current_tooltip").html('')  
      $(".current_tooltip").hide()
    }
}

function count_all(final_datas,fieldName_to_count,where){
  sql = "SELECT COUNT(DISTINCT "+fieldName_to_count+") as res FROM ? "+ (where ? 'where '+ where : '')
  log(sql)
  return alasql(sql,[final_datas])[0]['res']
}

function select_from_where(final_datas,to_select,where,unique){
  let sql = "SELECT "+ (unique ? " DISTINCT (" : "") +to_select + (unique ? ")" : "") + "  FROM ?  " + (where ? 'where '+ where : '')
  log(sql)
  return alasql(sql  ,[final_datas])
}

function refresh_labelcount_viz(label_selector,fields_to_display,index,tooltipText){

  /*
  nb = count_elements(final_datas,fields_to_display,true,true)
  */
  nb = count_all(final_datas,fields_to_display)
  refresh_content(label_selector,nb,index,tooltipText)
  return Number(nb)
}


function seriesOf(typeChart,datas){
  let res = []
  let colorValue = $('.themeViz').css('color')

  log('\n\n\n\n'+typeChart,false)


  //if GAUGE
  if(typeChart === 'gauge'){//datas = {'min':min,'max':max,'value':value,'src_datas':src_datas}
    res = [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: datas['min'],
        max: datas['max'],
        radius: '100%', // this
        splitNumber: 5,
        itemStyle: {
          color: colorValue,
          shadowColor: 'black',
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 2
        },
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
        data: [{value: datas['value']}],
        
    }]

  //IF NOT GAUGE
  }else{
    res = datas.map(function(e){
      tmp = {}
      tmp['type'] = typeChart;
      tmp['smooth'] = 0.4;
      tmp['data'] = e;
      tmp['color'] = colorValue;
      return tmp
    })

    log(res)

  }

  log('series: ')
  log(res)
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
  log(res, false)
  
  if(percentage_mode) nb_occurences = percentage_of_total(nb_occurences,2)
  res = result_category_part(list_category,nb_occurences)
  log(res, false)
  
  
  if(optional_categoryValue){

    //find index of the optional_categoryValue in list_category
    let indexOfValue = list_category.map(e => e.toLowerCase()).indexOf(optional_categoryValue.toLowerCase())
    log(indexOfValue)

    //use this index with list_category,nb_occurences
    if(indexOfValue >= 0){

      list_category = [list_category[indexOfValue]]
      log(list_category,false)
      nb_occurences = [nb_occurences[indexOfValue]]
      log(nb_occurences,false)

    }else{
      list_category = [optional_categoryValue]
      nb_occurences = [0]
    }

    //update result
    res = result_category_part(list_category,nb_occurences)
    log(res,false)
  }
  return  res
}

function dateDiffInDays(date_min,date_max){
  return Math.abs(Number((new Date(date_max-date_min)/1000/60/60/24).toFixed(0)))
}

function addDays(current_date,nb_days){
  return new Date(current_date.setDate(current_date.getDate() + nb_days));
}

function range_date(date_min,date_max){
  //count nb of days
  nb_days = dateDiffInDays(date_min,date_max)

  //get current hour
  current_hour = (new Date).getHours()

  res = []
  current_date = date_min;

  //for each day (except last): append 0 to 24
  for(day_index = 0;day_index<nb_days;day_index++){
    current_date = current_date.getFullYear() + '-' + two_digits(current_date.getMonth()) + '-' + two_digits(current_date.getDate())
    
    for (hour_index=0;hour_index<=23;hour_index++){
      res.push([current_date + ' ' + (hour_index) + 'h'])  
    }
      
    current_date = addDays(date_min,1)

  }

  //on last: from 0 to current hour

  return res
}


function two_digits(val){
  return ("0" + val.toString() ).slice(-2);
}

function set_up_tool_tips_for_graphs(typeChart,parentSelector,parentSelectorIndex,tip){
  log(typeChart)
  
  let title_node = $($(parentSelector)[parentSelectorIndex]).prev()[0].firstElementChild
  log(title_node)
  show_tip_on_hover(title_node,tip)
}

function rearrange_if_week_days(xDatas){
  let sortingArr = week_day_orders()
  return xDatas.sort(function(a, b){  

    //multiple words beginning with the  weekday
    if(a.includes(' ') && b.includes(' ') ){

      return compare(sortingArr,a,b)

    //weekdays or not
    }else{

      return sortingArr.indexOf(a) - sortingArr.indexOf(b);

    }
    
  });
}

function compare(sortingArr,a,b){
  weekday_a = a.split(' ')[0]
  weekday_b = b.split(' ')[0]
  secondword_a = a.split(' ')[1]
  secondword_b = b.split(' ')[1]


  if (weekday_a === weekday_b) {
     return secondword_b - secondword_a
  }
  return sortingArr.indexOf(weekday_a) - sortingArr.indexOf(weekday_b);

}


function week_day_orders(){
  return ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
}

function refreshEchart(tip,typeChart,parentSelector,parentSelectorIndex,JsonData,title,xFieldName,xFieldOrderBy,xFieldType,seriesFieldNameToCount,with_cumulate,with_percentage_only,ignore_evolution_for_tooltip) {
  log('\n\n\n\n\n')

  set_up_tool_tips_for_graphs(typeChart,parentSelector,parentSelectorIndex,tip)

  let myChart = echarts.init($(parentSelector)[parentSelectorIndex], null);
  let displayed_datas = []
  let src_datas = []
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

    //if weekdays -> rearrange from monday to sunday
    xDatas = rearrange_if_week_days(xDatas)

    yDatas = xDatas.map(xElementValue => count_elements(temp, seriesFieldNameToCount,true,true,xFieldName,xElementValue)) // for each X element, count seriesFieldNameToCount from temp
    log(yDatas)


    src_datas = {
      customName: (with_percentage_only ? "Part" : "Nombre") + " de " + seriesFieldNameToCount.replaceAll('id_','').replaceAll('une_','').replaceAll('un_','') + 's',
      fieldName_to_count: seriesFieldNameToCount,
      xFieldOrderBy: xFieldOrderBy,
      with_percentage_only: with_percentage_only,
      xFieldName: xFieldName,
      xDatas: xDatas,
      ignore_evolution_for_tooltip: ignore_evolution_for_tooltip
    }
    log(src_datas)


    //show WITH accumulate
    displayed_datas = with_cumulate ? [yDatas,accumulate(yDatas)] : [yDatas]
    log(displayed_datas)

    //show ONLY percentage
    displayed_datas = !with_percentage_only ? displayed_datas : [percentage_of_total(yDatas)]
    log(displayed_datas)


  }else{
    src_datas = JsonData
    displayed_datas = JsonData // {min, max, value}
  }

  src_datas['typeChart'] = typeChart
  log(displayed_datas)
  let displayed_series = seriesOf(typeChart,displayed_datas)



  // specify chart configuration item and data
  let option = {}

  if(typeChart !== 'gauge'){
    option = {
      title: {
        text: title
      },


      xAxis: {
        type: xFieldType,//'category',
        data: xDatas,
      },
      yAxis: {
        axisLabel: {
          formatter: '{value}' + (with_percentage_only ? ' %' : '')
        },

      },

      /*
      visualMap: {
        type: 'piecewise',
        dimension: 0,
        seriesIndex: 0,
        pieces: [{
            gt: 1,
            lt: 5,
            color: 'rgba(0, 180, 0, 0.5)'
        }, {
            gt: 8,
            lt: 7,
            color: 'rgba(0, 180, 0, 0.5)'
        }]
      },
      */

      grid: {
        left: 50,
        bottom: 30
      }
    };
  
  }

  //todo: formatter: function(params){return TOUTES_LES_DONNEES_UNIQUES_JsonData par rapport à une visite}
  option['tooltip'] = {
    trigger: typeChart === 'gauge' ? 'item': 'axis' ,
    formatter: function(params){
      return tooltipFormatter(params,src_datas)
    },
    confine: 'true',
    backgroundColor:   $('.current_tooltip').css('background-color'),
    textStyle: {
      overflow: 'breakAll',
      width: 40,
    },
    extraCssText: css_tooltip(),
  }

  //common keys
  log({displayed_series})
  option['series'] = displayed_series
  myChart.setOption(option);



  $(window).on('resize',function(){
      myChart.resize();  
  });
  return myChart
}

function test(){
  alert('yo')
}
function css_tooltip(){
  return `
    border-width:0;
    white-space: initial;
    max-width:` + $('.current_tooltip').css('max-width') + ';'
}

function tooltipFormatter(params, src_datas){
  
  log(params.name) //X axis
  log(params.value) //Y axis
  

  log('\n\n\n\n')
  log({params})
  log(src_datas['typeChart'] )
  if(src_datas['typeChart'] !== 'gauge'){
    log("todo: prendre le premier element")
    params=params[0]
  }
  log({params})
  log(src_datas)

  let title = src_datas['customName'] || '{customName}'
  let current_value = params.value
  let current_data = []
  let detail = []

  //GAUGE
  if(params.seriesType === 'gauge'){
    current_value += ' %'
    current_data = {[title]: current_value}
    current_data = display(current_data)


    log(src_datas)
    //use total_count
    if(src_datas['total_count']){

      tmp = {}
      src_datas['total_count']['list_category'].forEach(function(a_categ,index_categ){
        
        tmp = {[a_categ]: src_datas['total_count']['nb_occurences'][index_categ]}
        tmp = display(tmp,true)
        log(tmp)

        current_data +=tmp
      })
      
    }

  //BARS, LINE, SCATTER
  }else {

    if(src_datas['with_percentage_only']) current_value += ' %'
    title += ' ' + params.name

    current_data = {[title]: current_value}
    current_data = display(current_data)
    log(current_data)

    let additional_infos = {}
    
    let all = src_datas['xDatas'].map(a_categ => sort_by(final_datas.filter(e => e[src_datas['xFieldName']] === a_categ)  , src_datas['xFieldOrderBy'])  )    
    let type_evolution = get_type_evolution()
    let field_to_count = src_datas['ignore_evolution_for_tooltip'] ? src_datas['fieldName_to_count'] : evolution_field_to_count(type_evolution)
    detail = all[params.dataIndex]


    detail = unique_objects_array(keep_unique_records(detail,'pays','region','ville','operateur','resolution',src_datas['fieldName_to_count'],'adresse_ip','date_heure_'+type_evolution,'date_'+type_evolution),field_to_count) 
    log('detail = ')
    log(detail)
    
    detail = detail.pop() //get last element (most recent)


    //display DERNIER of THE CURRENT X ELEMENT:
    if(detail){
      Object.keys(detail).forEach(k => renameKey ( detail, k, 'Dernier(e) ' + k ))

      log(detail)
      current_data += `--------------------------------<br/>
                      <i>DETAILS SUR LE DERNIER PARMI <strong>`+title+`</i></strong><br/>
                       --------------------------------<br/>`
      current_data +=  display(detail)

    } 

  }

  log(current_data)
  return '<div class="test">' + current_data +'</div>'
}



function renameKey ( obj, oldKey, newKey ) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

function isDate(val){
  return (Date.parse(val) || -1) > 0
}

function display_if_date(value){
  return isDate(value) ? (new Date(value)).toLocaleString() :  value
}

function slice_if_needed(value){

  const MAX_CHAR = 20

  let final_display = value
  if(final_display && final_display.length > MAX_CHAR){
    final_display = final_display.slice(0, MAX_CHAR) + '...'
    log('WE SLICED ')
  } else{
    log('NO SLICE')
  }

  if(!final_display) final_display = ""
  log(final_display)

  return final_display
}

function display(infos,with_tab){
  let res = ""
  $.each(infos, function( k, value  ) {
    res +=  (with_tab ? '&ensp;&ensp;' : '') + '<strong>' + k + '</strong>: ' + slice_if_needed(value)  + '<br/>\n' 
  });

  return res
}

function get_type_evolution(){
  return $("#type_evolution").val()
}

function evolution_field_to_count(type_evolution){
  if(!type_evolution) type_evolution = get_type_evolution()
  let prefix_to_count = type_evolution === "adresse_ip" ? "" : 
                type_evolution === "visite" ? "une_" : 
                type_evolution === "clic" ? "id_" : 
                ''
  let field_to_count = prefix_to_count + type_evolution
  return field_to_count
}

function count_ip_back(final_datas){

  all_ips = select_from_where(final_datas,'adresse_ip',null,true)
  nb_visites_per_ip = all_ips.map(ip => count_all(final_datas,'une_visite','adresse_ip = "'+ip['(adresse_ip)']+'"'))
  all = zip(all_ips.map(e => e['(adresse_ip)']), nb_visites_per_ip)
  res = all.filter(e => e[1] > 1)

  return res.length
}

function refresh_viz1_labels(){

  let label_selector = '.viz-label > .viz-text'

  // nb adresses IP, visites, clics, nb moyen de clics par visites 
  nb_ip = refresh_labelcount_viz(label_selector,'adresse_ip',0,tips['viz1']['ip_unique'])
  nb_visites = refresh_labelcount_viz(label_selector,'une_visite',1,tips['viz1']['visite_unique'])
  nb_clics = refresh_labelcount_viz(label_selector,'id_clic',2,tips['viz1']['clic_unique'])
  ratio = refresh_content(label_selector,(nb_clics/nb_visites).toFixed(2),3,tips['viz1']['clic_par_visite'])
  nb_ip_back = refresh_content(label_selector,count_ip_back(final_datas),4,tips['viz1']['ip_revenu'])
  part_nb_ip_back = (100*(nb_ip_back/nb_ip)).toFixed(2) 
  refresh_content(label_selector, part_nb_ip_back +'%',5,tips['viz1']['part_ip_revenu'])
}

function get_specific_category_count(nb_original,category_name,categories_to_ignore, percentage_mode){


  res = nb_original['nb_occurences'][    nb_original['list_category'].indexOf(category_name)   ]
  log({res})
  
  if(categories_to_ignore){
    index_category_to_ignore = nb_original['list_category'].indexOf(categories_to_ignore)
    log({nb_original})
    denominator = nb_original['nb_occurences'].filter((e,i) => i !== index_category_to_ignore)
    log({nb_original})
  } else{
    denominator = nb_original['nb_occurences']
  }
  
  final_sum = sum_array(denominator)
  
  if(percentage_mode) res = 100* Number(res/(final_sum))

    res = res.toFixed(2)

  return res
}

function refresh_viz1_part_mobiles(){

  //pourcentage de mobiles
  let category_value_to_count = 'Mobile'


  nb_appareils_total = count_category_part(final_datas,'type_appareil','une_visite',false) 
  log({nb_appareils_total})

  part_mobile = get_specific_category_count(nb_appareils_total,category_value_to_count,'Resolution inconnue',true)
  log({part_mobile})
  
  gauge_datas = { min: 0,
                max:100,
                value:part_mobile,
                'customName':'Part des mobiles parmi les visites',
                total_count: nb_appareils_total,
                category_value_to_count: category_value_to_count
              }

  log({gauge_datas})
  tip = tips['viz1']['part_mobiles']
  refreshEchart(tip, 'gauge','.viz-gauge',0,gauge_datas)

}

function refresh_viz1_evolutions(){

  //evolution nb visites | clics
  let type_evolution = $("#type_evolution").val()
  tip = tips['viz1']['evolutions'].replaceAll('#type_evolution',type_evolution)
  field_to_count = evolution_field_to_count(type_evolution)

  log(field_to_count)
  refreshEchart(tip,'line','.chart-element',0,final_datas,'','date_heure_'+type_evolution,'date_'+type_evolution,'category',field_to_count,false,false)
  

}

function order_days(){

}

function refresh_viz1_affluences(){

  //affluences
  tip = tips['viz1']['affluences']
  let categ = $('#type_affluence').val() === "d" ? "jour_visite" :
              $('#type_affluence').val() === "h" ? "heure_visite" :
              $('#type_affluence').val() === "dh" ? "jour_heure_visite" 
              : "h"
  let categ_str = categ + '_str'
  refreshEchart(tip,'bar','.chart-element',1,final_datas,'',categ_str,categ,'category',evolution_field_to_count(),false, true,true)
  

}

function the_other_list_id(me){
  res = ''
  if(me.id === 'type_evolution'){
    res = 'type_evolution_affluences'
  }else if(me.id === 'type_evolution_affluences'){
    res = 'type_evolution'
  }

  return res
}

function refresh_viz1_counters(ceci){

  if(ceci){

    let list_to_update = $('select[id="'+the_other_list_id(ceci)+'"]')
    list_to_update.val(ceci.value)
    log(ceci.value)

  }

  refresh_viz1_evolutions()
  refresh_viz1_affluences()
}

function refresh_viz1(){
  let tip = ''

  refresh_viz1_labels()
  refresh_viz1_part_mobiles()
  refresh_viz1_evolutions()
  refresh_viz1_affluences()

}

function animate_beginning_until_now(date_field_name,EVENT_DURATION_IN_SECONDS){
  a = final_datas
  final_datas  = []
  a.forEach(e => {
      setTimeout(function(){
        current_date=e[date_field_name]
        current_date = display_if_date(current_date)
        $('#current_page').text('Date en cours: '+current_date)
        log(current_date)
        final_datas.push(e)
        refresh_all_viz()
     },EVENT_DURATION_IN_SECONDS*1000)
  })

}


function append_colors(){

  //main color
  $('.viz-title').addClass('theme')
  $('.viz-text, .viz-title').addClass('themeViz')

}


function creer_dataviz(){
  log(final_datas)


  append_colors()

  
  //viz1
  refresh_viz1()


  //viz2 : 



  //viz3 : 

  //put tooltips everywhere the mouse goes
  window.onmousemove = function (e) {

    var x = e.clientX,
        y = e.clientY;
        max_left_position =  window.innerWidth - $('.current_tooltip')[0].offsetWidth - 30 

    $(".current_tooltip")[0].style.top = (y + 20) + 'px';
    $(".current_tooltip")[0].style.left = Math.max(0, Math.min( (x + 20),max_left_position)) + 'px';

    
  };


}


async function get_canaux(){
  const {data, error} = await supabase.from('canaux').select('*')
  log({data})

  return data
}





// ---------------------------------------------------------------- USEFUL FUNCTIONS ----------------------------------------------------------------


final_datas = []

async function select_all(name_table){
  const {data, error} = await supabase.from(name_table).select('*')
  return data
}


function unique(array){
  return [...new Set(array)];
}

function unique_objects_array(a,identifier){
  return [...new Map(a.map(item =>  [item[identifier], item])).values()].filter(e => e[identifier]);
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
const sum_array = arr => accumulate(arr).pop()
const percentage_of_total = (arr,nb_of_decimals) => arr.map(e => Number((100*(Number(e)/accumulate(arr).pop())).toFixed(   (nb_of_decimals ? nb_of_decimals : 1) ))  )
const countOccurrences = (a,b) => b.map(e => a.filter(c => c['type_appareil'] === e).length)
const zip = (x, y) => Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]])


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


