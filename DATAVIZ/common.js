
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


