
let DEBUGGING_MODE = false
supabase = createClient(racine_data(),  apikey())

final_datas = []
original_final_datas = []

const date_ref_site = new Date(2022, 5, 19, 8, 14, 35) // MONTH BEGINS WITH 0 ! new Date('2022-06-19T08:14:35')
const tips = {
  'group1': {ip_unique: `L'adresse IP représente l'identité de votre appareil lorsqu'il est connecté à un réseau.<br/>
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


          clics_max: `Le <strong>nombre de clics maximal</strong> représente l'<strong>utilisateur le plus actif</strong> de <strong>toutes les visites</strong> depuis la création du site.`,
          
          duree_max_visite: `La <strong>durée maximale de visite</strong> ne considère que les visiteurs ayant fait <strong>au moins 2 clics</strong>, parmi <strong>les visites de 30 minutes maximum</strong>.`,

          elapsed_time: `Ce site a été mis en ligne pour la toute première fois le <strong>` + date_ref_site.toLocaleString() + `</strong> (heure locale <strong>France</strong>).`,

          date_premiere_visite: `Il m'a fallu <strong>#durée_attente</strong> pour avoir <strong>ma toute première visite</strong> !`,


          part_mobiles: `Les appareils <strong>mobiles</strong> sont <strong>souvent majoritaires</strong> parmi les visites.
          <br/>
          C'est pourquoi il est important qu'un site web soit <strong>responsive</strong> : le contenu doit s'adapter à la taille de l'écran.`,
          
          evolutions: `Seules les dates-heures ayant reçues <strong>au moins 1 #type_evolution</strong> sont affichées.
          <br/>
          Les dates sont affichées selon l'UTC+002, en référence aux horaires en France.
          `,

          affluences: `Observez les affluences soit <strong>par Jour</strong> de la semaine, soit <strong>par Heure</strong>, soit <strong>les deux</strong>.
          <br/>Les dates sont affichées selon l'<strong>UTC+002</strong>, en référence aux horaires en France.
          
          `
          },


  'group2': {
    sections: `Les sections sont les éléments de la <strong>barre de navigation</strong> tout en haut de la page.`,
    categ_projets: `Il y a <strong>3 catégories</strong> de projets, dont le <strong>détail</strong> de chacune sera résumé dans une <strong>prochaine dataviz</strong>.`,
    liens: `Il y a <strong>2 types de liens</strong> reportés sur ce site. <strong>A vous de décider</strong> ce que vous souhaitez voir !`,
    technos: `Les technos ont chacune une <strong>description</strong> au clic. Considérant tous les pays confondus, on remarque que <strong>Tableau Software</strong> sort du lot !`
  }
}
    




async function subscribe_supabase(){
  last_tout = []
  return await supabase
    .from('*')
    .on('*', async function (payload){
      log({payload})
      if(payload.table === 'visites' || payload.table === 'clics'){
        log('------🡺 update viz \n\n\n')

        //await get_donnees_site()

        //insertion ---> on ajoute le dernier element de 'tout'
        if(payload.eventType === 'INSERT'){

          //to ignore cause local
          if(payload.new.id_visite){
            a = await supabase.from('all_my_visits').select('*').eq('id_visite',payload.new.id_visite);
            if(a['data'].length > 0) return log('ignoring new visit')
          }

          //with ip address ---> new visit
          if(payload.new.adresse_ip){
            log('new visit to keep',false,true)
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

          log(last_tout,false,true)

          if(last_tout && last_tout.data){
            last_tout = last_tout.data[0]
            log({last_tout})

            log('new payload ' +final_datas.length)
            final_datas.push(last_tout)
            refresh_all_viz(true)
            log('payload OK.')
          }

        //update or delete ---> get ALL
        }else {

          window.location.href = window.location.href 

        }
        
          
        log({final_datas})
        refresh_all_viz(true)

      }



  }).subscribe()

}


    
async function get_donnees_site(){
  final_datas = await select_all('tout')
  original_final_datas = final_datas
  creer_dataviz()
}

function one_filter(filter_name,html){
  return `<div class="a_filter"><strong>`+filter_name+`</strong>
          <br/>
          `+html+`
          </div>

  `
}

function selected_if_default(id_select,a){
  return a === previous_filter_value(id_select) ? ' selected="selected" ' : ''
}

function select_list_from_array(arr,id_select){
  const final_list = '<option value="(TOUT)">(TOUT)</option>' + arr.map(a => `<option  `+selected_if_default(id_select,a)+` value="`+(a ? a : '(inconnu)')+`">`+(a ? a : '(inconnu)')+`</option>`).join('')
  return `<select class="filter_choice" id="choix_`+id_select+`">` +  final_list+ `</select><br/>`
}

function previous_filter_value(id_filter){

  let default_value = false
  const current_filters_str = get_item('current_filters')
  if(current_filters_str){
    current_filters = JSON.parse(current_filters_str)
    if(current_filters[id_filter]){
      default_value = current_filters[id_filter]
    }
  }

  return default_value
}

function applicable_filters(){
  return  one_applicable_filter('pays','Pays') 
}

function no_filters(){
  return get_item('current_filters',true) ? ` <span class="no-filter" onclick="reset_filters()">❌ Supprimer tous les filtres</span> ` : ""
}

function reset_filters(){
  $('.filter_choice').val('(TOUT)')
}

function one_applicable_filter(id_filter,displayed_name_filter){

  let my_list = unique(original_final_datas.map(e => e[id_filter]))
  my_list = my_list.sort()
  return one_filter(displayed_name_filter,select_list_from_array(my_list,id_filter))

}

function filters(){

  // RIGHT SIDEBAR
  Swal.fire({
    title: 'Filtres',
    html: applicable_filters() + no_filters(),
    position: 'top-end',
    showClass: {
      popup: `
        animate__animated
        animate__fadeInRight
        animate__faster
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutRight
        animate__faster
      `
    },
    grow: false,
    width: 300,
    showConfirmButton: true,
    confirmButtonText: `<span class="apply_filters">Appliquer</span>`,
    confirmButtonColor: '#cacaca',
    showCloseButton: false,
    preConfirm: apply_filters_with_swal
  })

}

function apply_filters_with_swal(){
  apply_filters(false)
  refresh_all_viz()
}

function with_or_without_filters(current_filters){
  if(current_filters && Object.keys(current_filters).length > 0){
    $('#filters-btn').addClass('with_filters')
  }else{
    $('#filters-btn').removeClass('with_filters')        
  }
}

function apply_filters(without_swal){
  log(original_final_datas)

  final_datas = original_final_datas
  log('--------- original:\n')
  log(final_datas)

  //very first time with some filters already
  if(without_swal){
    log('without swal!')
    if(get_item('current_filters')){
      current_filters = get_item('current_filters',true)
      with_or_without_filters(current_filters)
      Object.keys(current_filters).map((key) => {
        final_datas = final_datas.filter(e => e[key] === current_filters[key])
      })
    }
  //with swal
  }else{
    log('with swal!')

    log('current choices:')
    $('.filter_choice').get().forEach(function(e){
      choice_to_make = e.id.replace('choix_','')
      value_to_keep = e.value === '(inconnu)' ? null : e.value
      log(choice_to_make)
      log(value_to_keep)

      if(value_to_keep === '(TOUT)'){      
        current_filters = remove_filter(choice_to_make)    
      }else{
        final_datas = final_datas.filter(e => e[choice_to_make] === value_to_keep)
        current_filters = save_current_filters({[choice_to_make]: value_to_keep})
      }
      

    })

    with_or_without_filters(current_filters)

  }


  log('--------- FINAL:\n')
  log(final_datas)
  log('\n\n\n\n\n')
  
}

function save_current_filters(new_element){
  //very first filter to apply
  if(!get_item('current_filters')){
    return save_item('current_filters',JSON.stringify(new_element))
  
  //new one in addition to what existed
  } else{
    current_filters = get_item('current_filters',true)
    new_key = Object.keys(new_element)[0]
    new_value = new_element[new_key]
    current_filters[new_key] = new_value
    return save_item('current_filters',JSON.stringify(current_filters))
  }

  
}

function remove_filter(id_filter){
  if(get_item('current_filters')) {
    current_filters = get_item('current_filters',true)
    delete current_filters[id_filter]
    log(current_filters)

    //still some filters to apply
    if(Object.keys(current_filters).length > 0){
      save_item('current_filters',JSON.stringify(current_filters))
      
    //no filters anymore
    }else{
      del_item('current_filters')
    }

    return current_filters

  }else {
    return {}
  }
}

function current_text(node_element){
  return $(node_element)
    .clone()    //clone the element
    .children() //select all the children
    .remove()   //remove all the children
    .end()  //again go back to selected element
    .text()
    .trim();
}

function main(){

  load_swal()
  subscribe_supabase()

  $(document).on('click',function(e){
    initial_value = DEBUGGING_MODE
    DEBUGGING_MODE = false    
    log('refreshing group 1')
    refresh_group1() //todo for all groups
    DEBUGGING_MODE = initial_value
  })

  get_donnees_site()
  let imlocal = local_if_dataviz_not_iframe()
  if(imlocal){
    console.warn('showing icon')
    apply_light() 
    document.getElementById('switch').style.display= ""
    console.warn('ignoring IP')
    //send only if local (not in iframe)
    send_ip_ignore()
  
  } else{
    console.warn('hiding icon')
    document.getElementById('switch').style.display= "none"
  }


  //only chose dataviz
  load_group($('#chosen').val())
}

async function send_ip_ignore(){ 
  if(is_local_host()) return false
  await visit_details(true)
  const adresse_ip = get_item('adresse_ip')   || ''
  const ville = JSON.parse(get_item('my_datas'))['ville'] || ''
  const url_page_source = top.location.href
  const my_ip = {
                 adresse_ip: adresse_ip,
                 ville: ville,
                 url_page_source: url_page_source
               }
  const {data, error} = await supabase.from('ip_ignore')
                      .insert([my_ip])
  $('#myip').text(adresse_ip)
  $('#current_page').show()
  return {data,error}
}

function load_group(e){
  $('.conteneurDashboard').hide()
  $('#'+e).show()

  $(window).resize() //for group 1 & 2 

  //if in iframe ---> adapt it
  if(inIframe()) window.top.adapt_iframe_height('DATAVIZ')
}


function check_if_collecting_datas(){
  collect_datas = !is_local_host()
  console.warn({collect_datas})
  return collect_datas
}

function refresh_all_viz(update_only){

  loading(true)

  apply_filters(true)
  console.info('refreshing... ' + final_datas.length)

  
  if(update_only){
    refresh_group1() //group 1
    $(window).resize() //group 2

  //create for the first time
  }else{

    //group1 : main vision
    refresh_group1()

    //group2 : clicks
    refresh_group2()

    //group3 : from where people come from (countries, websites, social medias) --> todo
  }

  loading(false)
  log('refreshing done.')
}

main()

function log(content,json_mode,forcing){
  if (DEBUGGING_MODE || forcing) return json_mode ? console.log({[content]:content}) : console.log(content)
}

//TOOLTIP FOR LABELS
function refresh_content(selector,content,index,tooltipText){
  log((selector + ',' + content +',' + index).split(','))
  $($(selector)[index]).html(content)

  //on hover : set current tooltip on TEXT and its TITLE
  show_tip_on_hover($(selector)[index],tooltipText)
  show_tip_on_hover($($(selector)[index]).prev()[0].firstElementChild,tooltipText)

  return content

}

function show_tip_on_hover(nodes,tooltipText){
  $(nodes).on('mouseover',function(e){
      show_tip(true,tooltipText)
  })

  $(nodes).on('click',function(e){
    show_tip(true,tooltipText)
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

  nb = count_all(final_datas,fields_to_display)
  refresh_content(label_selector,nb,index,tooltipText)
  return Number(nb)
}


function seriesOf(typeChart,datas){
  let res = []
  let colorValue = $('.themeViz.viz-title').css('color')

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

function refreshEchart(tip,typeChart,parentSelector,parentSelectorIndex,JsonData,title,xFieldName,xFieldOrderBy,xFieldType,seriesFieldNameToCount,with_cumulate,with_percentage_only,ignore_evolution_for_tooltip,optional_object_filtering_on_categories) {
  log('\n\n\n\n\n')

  set_up_tool_tips_for_graphs(typeChart,parentSelector,parentSelectorIndex,tip)

  let myChart = echarts.init($(parentSelector)[parentSelectorIndex], null);
  let displayed_datas = []
  let src_datas = []
  let xDatas = []
  let yDatas = []

  log(typeChart)
  if(typeChart !== 'gauge'){

    field_to_filter = optional_object_filtering_on_categories ? optional_object_filtering_on_categories['field_to_filter'] : ''
      
    //let temp = unique(keep_fields(JsonData,xFieldName,xFieldOrderBy,seriesFieldNameToCount)); //keep only the 3 fields we need
    let temp = keep_unique_records(JsonData,xFieldName,xFieldOrderBy,seriesFieldNameToCount,field_to_filter)
    temp = sort_by(temp,xFieldOrderBy) // order by xFieldOrderBy
    log({temp})

    //filter if needed
    if(optional_object_filtering_on_categories){
      field_to_filter = optional_object_filtering_on_categories['field_to_filter']
      value_filter = optional_object_filtering_on_categories['value_filter']
      temp = temp.filter(e => e[field_to_filter] === value_filter)
      log({temp})
    }

    xDatas = get_elements(temp, xFieldName, true, xFieldOrderBy, false, true) //unique(temp.map(row => row[xFieldName])) // get unique X elements
    log({xDatas})

    //ignore nulls
    xDatas = xDatas.filter(e => e)
    log({xDatas})



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

  //NOT GAUGE ---> only charts
  if(typeChart !== 'gauge'){
    option = {
      title: {
        text: title
      },


      xAxis: {
        type: xFieldType,//'category',
        data: xDatas,
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}' + (with_percentage_only ? ' %' : '')
        },

      },

      grid: {
        top: 30,
        left: 50,
        right: 30,
        bottom: 30
      }
    };


    //INVERTED AXIS if category is kinda long
    if(optional_object_filtering_on_categories){
      //reverse X axis
      option['xAxis']['data'] = option['xAxis']['data'].reverse()
      displayed_series[0]['data']  =  displayed_series[0]['data'].reverse()

      tmp = option['xAxis']
      option['xAxis'] = option['yAxis']
      option['yAxis'] = tmp

      //some padding on left
      option['grid']['left'] = optional_object_filtering_on_categories['grid_left']

      option['xAxis']['axisLabel']['confine'] = true
    }

  }

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

function xData_column_length(xDatas){
  return $('.chart:visible').width() / xDatas.length
}

function css_tooltip(){
  return `
    border-width:0;
    white-space: initial;
    max-width:` + $('.current_tooltip').css('max-width') + ';'+ `
    overflow-wrap: break-word;



    `
}

function tooltipFormatter(params, src_datas){
  
  log(params.name) //X axis
  log(params.value) //Y axis
  

  log('\n\n\n\n')
  log({params})
  log(src_datas['typeChart'] )
  if(src_datas['typeChart'] !== 'gauge'){
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


    detail = unique_objects_array(keep_unique_records(detail,'pays','region','ville','operateur','resolution',src_datas['fieldName_to_count'],'adresse_ip','date_heure_'+type_evolution,'date_'+type_evolution,'url_page_source_local'),field_to_count) 
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
  return '<div class="echarts_tooltip">' + current_data +'</div>'
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

function display(infos,with_tab,no_cut){
  let res = ""
  $.each(infos, function( k, value  ) {
    res +=  (with_tab ? '&ensp;&ensp;' : '') + '<strong>' + k + '</strong>: ' + (no_cut ? value : slice_if_needed(value))  + '<br/>\n' 
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

function refresh_group1_labels(){

  let label_selector = '.viz-label > .viz-text'

  // nb adresses IP, visites, clics, nb moyen de clics par visites 
  nb_ip = refresh_labelcount_viz(label_selector,'adresse_ip',0,tips['group1']['ip_unique'])
  nb_visites = refresh_labelcount_viz(label_selector,'une_visite',1,tips['group1']['visite_unique'])
  nb_clics = refresh_labelcount_viz(label_selector,'id_clic',2,tips['group1']['clic_unique'])
  ratio = refresh_content(label_selector,(nb_clics/nb_visites).toFixed(2),3,tips['group1']['clic_par_visite'])
  
  // ip revenus + %
  nb_ip_back = refresh_content(label_selector,count_ip_back(final_datas),4,tips['group1']['ip_revenu'])
  part_nb_ip_back = (100*(nb_ip_back/nb_ip)).toFixed(2) 
  refresh_content(label_selector, part_nb_ip_back +'%',5,tips['group1']['part_ip_revenu'])

  // clics max
  clics_max = calculate_clic_max(final_datas)
  refresh_content(label_selector,clics_max,6,tips['group1']['clics_max'])
  
  // durée max visite
  duree_max_visite = max_duration_visit(final_datas)
  refresh_content(label_selector,duree_max_visite,7,tips['group1']['duree_max_visite'])

  // elapsed time: only once
  if(no_elapsed_time_yet(label_selector)){
    
    //set it first
    refresh_time_elapsed(label_selector)

    //update every 1 second
    setInterval(function(){
      refresh_time_elapsed(label_selector)
    },1000)
  }

  // very 1st visit
  date_premiere_visite = very_first_visit(final_datas)
  date_premiere_visite_str = display_date_dd_mm_yy_hh_min(date_premiere_visite)
  duree_attente = display_as_long_duration(duration_in_seconds(date_ref_site,date_premiere_visite))
  refresh_content(label_selector,date_premiere_visite_str,9,tips['group1']['date_premiere_visite'].replace('#durée_attente',duree_attente))

}

function very_first_visit(final_datas){
  return new Date(Math.min(... final_datas.map(e => new Date(e['date_visite']))))
}

function refresh_time_elapsed(label_selector){
  refresh_content(label_selector,elapsed_time(),8,tips['group1']['elapsed_time'])
}

function no_elapsed_time_yet(label_selector){
  return $(label_selector)[9].innerText.trim() === ''
}

function elapsed_time(){ // TO CHECK
  duration_in_s = duration_in_seconds(date_ref_site, new Date())
  res = display_as_long_duration(duration_in_s) //date_ref_site + '<br/>' + (new Date())
  return res
}

function duration_in_seconds(date_min,date_max){
  return Math.round( (date_max - date_min)/1000 )
}

function display_as_long_duration(duration_in_seconds){
  log('\n\n'+duration_in_seconds)

  let day = Math.floor(duration_in_seconds/(24*60*60))
  var remaining_sec = Math.floor(duration_in_seconds%(24*60*60))

  log({remaining_sec})

  let hour = Math.floor(remaining_sec/(60*60))
  remaining_sec = Math.floor(remaining_sec%(60*60))
  log({remaining_sec})
  
  let min = Math.floor(remaining_sec/60); 
  remaining_sec = Math.floor(remaining_sec%60)
  log({remaining_sec})

  let sec = (remaining_sec.length === 1 ? '0' : '') + remaining_sec

  return  (day > 0 ? day+'j ' : '') +hour+'h'+min+'m'+sec
}

function display_as_duration(duration_in_seconds){
  let min = (duration_in_seconds/60).toFixed(0)
  let sec = (duration_in_seconds%60).toFixed(0)
  return  '00:'+ two_digits(min)+ ':' + two_digits(sec) + ''
}


function calculate_clic_max(final_datas){

  all_visits = select_from_where(final_datas,'une_visite','id_clic is not null',true)
  nb_clics_per_visit = all_visits.map(vis => count_all(final_datas,'id_clic','une_visite = "'+vis['(une_visite)']+'"'))
  log(nb_clics_per_visit)

  let res = nb_clics_per_visit.length > 0 ? Math.max(...nb_clics_per_visit) : 0
  log(res)
  
  return res

}


function max_duration_visit(final_datas){

  //get all visits ID WITH A CLICK
  let all_visits_with_click = select_from_where(final_datas,'une_visite','date_clic is not null',true)



  let MAXDUR = 1800; // 1800seconds = 30 minutes
  //for each visit
  let durs = all_visits_with_click.map(function(v){
    //get all click dates
    all_dates = final_datas.filter(e => e['une_visite'] === v['(une_visite)']).map(e => new Date(e['date_clic']).getTime())
    
    //no possible duration so we discard
    if(all_dates.length <= 1) return null
    
    //deduce min and max
    mindate = (Math.min(...all_dates));
    maxdate = (Math.max(...all_dates));

    //calculate dur = (max-min) IN SECONDS
    durDate = (maxdate-mindate)/1000
    
    //if dur > 30 min then discard
    if(durDate > MAXDUR){
      return null
    }

    log('\n\n\n' + v['(une_visite)']+'\n'+JSON.stringify(all_dates)+'\n'+new Date(mindate)+'\n'+new Date(maxdate)+'\n'+durDate)
    
    return durDate
    
  }).filter(e => e !== null)//keep non null values

  log({durs})

  let res = durs.length > 0 ? Math.max(... durs) : 0
  return display_as_duration(res) //'19:22'
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

function refresh_group1_part_mobiles(){

  //pourcentage de mobiles
  let category_value_to_count = 'Mobile'


  nb_appareils_total = count_category_part(final_datas,'type_appareil','une_visite',false) 
  log({nb_appareils_total})

  part_mobile = get_specific_category_count(nb_appareils_total,category_value_to_count,'Resolution inconnue',true)
  log({part_mobile})
  if(isNaN(part_mobile)) part_mobile = 0
  
  gauge_datas = { min: 0,
                max:100,
                value:part_mobile,
                'customName':'Part des mobiles parmi les visites',
                total_count: nb_appareils_total,
                category_value_to_count: category_value_to_count
              }

  log({gauge_datas})
  tip = tips['group1']['part_mobiles']
  refreshEchart(tip, 'gauge','.viz-gauge',0,gauge_datas)

}

function refresh_group1_evolutions(){

  //evolution nb visites | clics
  let type_evolution = $("#type_evolution").val()
  tip = tips['group1']['evolutions'].replaceAll('#type_evolution',type_evolution)
  field_to_count = evolution_field_to_count(type_evolution)

  log(field_to_count)
  refreshEchart(tip,'line','.chart-element',0,final_datas,'','date_heure_'+type_evolution,'date_'+type_evolution,'category',field_to_count,false,false)
  

}

function refresh_group1_affluences(){

  //affluences
  tip = tips['group1']['affluences']
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

function refresh_group1_counters(ceci){

  if(ceci){

    let list_to_update = $('select[id="'+the_other_list_id(ceci)+'"]')
    list_to_update.val(ceci.value)
    log(ceci.value)

  }

  refresh_group1_evolutions()
  refresh_group1_affluences()
}

function refresh_group1(){

  refresh_group1_labels()
  refresh_group1_part_mobiles()
  refresh_group1_evolutions()
  refresh_group1_affluences()

}

function get_words(final_datas,fieldName_to_count,fieldName_to_display){
  return final_datas.map(function(e) {return {[fieldName_to_count]: e[fieldName_to_count], [fieldName_to_display]: e[fieldName_to_display]}   }).filter(e => e).map(e => e.trim()).filter(e => e)
}

function refresh_group2(){

  refresh_group2_sections()
  refresh_group2_projects()
  refresh_group2_links()
  refresh_group2_techs()

}


function generateWords(element_node,final_list){

  log('\n\n\n')
  log({element_node})
  log({final_list})


  let all_percents = final_list.map(e => e['html']['weight_percent'])
  let min_value = Math.floor( Math.min(... all_percents) ) /100
  log({min_value})

  let max_value = Math.ceil( Math.max(... all_percents) ) /100
  log({max_value})

  
  let node_height = $($('#group2 .chart')[1]).height()
  let node_width = $($('#group2 .chart')[1]).width()

  log(node_width + ' x ' + node_height)

  let opt = {
    removeOverflowing: true,
    delayedMode: false, 
    autoresize: true,
    height: node_height, 
    width: node_width,
    fontSize: {
      from: min_value,
      to: max_value
    },
    afterCloudRender : function(){
      //each element
      $(element_node).children().get().forEach(function(node){
        
        //tooltip on hover and clicks
        show_tip_on_hover(node,node.getAttribute('tooltipText'))

        //link open on double click
        node.addEventListener('dblclick', function(){
          if(node.getAttribute('link')){
            window.open(node.getAttribute('link'), '_blank').focus();  
          }
          
        })

      })

      //reload if resizing
      $(window).resize(function() {
          clearTimeout(window.resizedFinished);
          window.resizedFinished = setTimeout(function(){
              //console.log('Resized finished.');
              refresh_group2()
          }, 50);
      });

    }
  }

  $(element_node).html("");

  if(final_list.length > 0){
    $(element_node).jQCloud(final_list, opt)      
  }
  


}

function get_clicks_of(datas_original,fieldName,optional_field_name_to_filter,optional_field_value_filter){
  datas = datas_original

  //if we need to filter before counting
  if(optional_field_name_to_filter){
    datas = datas.filter(e => e[optional_field_name_to_filter] === optional_field_value_filter)
  }

  //useful if percentage
  total_local_clics = count_elements(datas,'id_clic',true,true)

  //get all unique contents
  all_contents = get_elements(datas,fieldName,true,fieldName,false,true).filter(e => e)


  //for each content, count id_clic
  final_contents = all_contents.map(function(content){    
      let res = {}
      let final_html = {}

      val = unique(datas.filter(d => d[fieldName] === content).map(e => e['id_clic'])).length
      val_percent =(100*(val/total_local_clics)).toFixed(2) 
      val_percent_str = val_percent + '%'
      terminaison = fieldName.charAt(fieldName.length-1) === 's' ? '' : 's'
      titre_part = 'Part de clics parmi les '+fieldName +terminaison

      to_display = {
        Clic : content,
        'Nombre de clics' : val,
        [titre_part] : val_percent_str,
      }

      curr_link = ''
      if(is_a_link(content)){
        curr_link = content.replace('./',window.location.origin + '/')
        to_display['Double-cliquez pour aller au lien associé'] = curr_link
      }
      
      tooltipText = display(to_display,false,true)
      final_html['weight'] = val
      final_html['weight_percent'] = val_percent
      final_html['tooltipText'] = tooltipText
      if(curr_link) final_html['link'] = curr_link


      res['text'] = content 
      res['weight'] = val 
      res['html'] = final_html 

      log(res['text'] + ','+res['weight'])
      return res
  })

  //display
  return final_contents
    
}

function is_a_link(content){
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(content) || content.includes('./');
}

function refresh_group2_sections(){
  let res = get_clicks_of(final_datas,'section_page_clic','est_section',true)
  generateWords($('#group2 .chart-element')[0],res)
  show_tip_on_hover($('#group2 .viz-title')[0],tips['group2']['sections'])
  return res;
}

function refresh_group2_projects(){  

  //projects
  tip = tips['group2']['categ_projets']
  let categ = 'categorie_projet'
  let categ_str = categ
  let myFilter = {
    field_to_filter: 'est_projet_categorie',
    value_filter: true,
    grid_left: '150px'
  }
  refreshEchart(tip,'bar','#group2 .chart-element',1,final_datas,'',categ_str,categ,'category','id_clic',false, true,true,myFilter)




}

function refresh_group2_links(){

  //links
  tip = tips['group2']['liens']
  let categ = 'lien'
  let categ_str = categ
  let myFilter = {
    field_to_filter: $('#type_link').val(),
    value_filter:  true,
    grid_left: '50%'
  }
  refreshEchart(tip,'bar','#group2 .chart-element',2,final_datas,'',categ_str,categ,'category','id_clic',false, true,true,myFilter)

}

function refresh_group2_techs(){
  let res = get_clicks_of(final_datas,'techno','est_techno',true)
  generateWords($('#group2 .chart-element')[3],res)
  show_tip_on_hover($('#group2 .viz-title')[3],tips['group2']['technos'])
  return res;
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

function loading(yes){
  if(yes){
    $('.loading').show()
  }else{
    $('.loading').hide()
    $('#last-update').text((new Date).toLocaleString())
  }
}


function creer_dataviz(){
  log(final_datas)
  append_colors()  
  refresh_all_viz()





  //put tooltips everywhere the mouse goes, and show it if we need to
  window.onmousemove = function (e) {
    if(e) place_tooltip(e)
  };

  //for me in /DATAVIZ/ + iframe
  $(document).scroll(hide_all_tooltips);
  $(window.parent.document).scroll(hide_all_tooltips);

}

function hide_all_tooltips(){
    show_tip(false)    
    $('.echarts_tooltip').hide()

}

function is_mobile(){
  return window.innerHeight > window.innerWidth
}

function place_tooltip(e){
    log(e)
    var x = is_mobile() ? e.clientX :  e.pageX
        y =  is_mobile() ? e.clientY :  e.pageY
        max_left_position =  window.innerWidth - $('.current_tooltip')[0].offsetWidth - 30 
        max_top_position =  window.innerHeight - $('.current_tooltip')[0].offsetHeight - 30 
        
    var final_x = Math.max(0, Math.min( (x + 20),max_left_position)) + 'px';
    var final_y = Math.max(0, Math.min( (y + 20),max_top_position)) + 'px';

    $(".current_tooltip")[0].style.top = final_y
    $(".current_tooltip")[0].style.left = final_x

    log('\n\n\n')
    log('from '+x+' '+y)
    log('to '+final_x+' '+final_y)

    if(e && e !== null){
      current_target_text =current_text(e.target)
      if(current_target_text.length === 0){
        show_tip(false)
      }else{
        log(current_target_text)
      }      
    }

}



// ---------------------------------------------------------------- USEFUL FUNCTIONS ----------------------------------------------------------------


