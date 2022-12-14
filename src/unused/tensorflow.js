import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

var list_sentences = [];
var input_threshold = 0.47;
var analyzing_text = true;
let tabDict = {}

async function onClickAnalyzeSentences(){

  let queryOptions = { currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);

  let inactiveTabs = [];
  let activeTabs = [];
  let tabTitles = [];

  // sort tabs by activeness
  tabs.forEach(tab => {
    tabTitles.push(tab.title);

    tabDict[tab.title] = tab.id;

    if (tab.active) {
      activeTabs.push(tab.url);
    } else {
      inactiveTabs.push(tab.url);
    }
  });

  console.log(tabDict);

  list_sentences = tabTitles;
  console.log(tabTitles);
  get_similarity(tabTitles);
}

function get_embeddings(list_sentences, callback) {
  use.load().then(model => {
    model.embed(list_sentences).then(embeddings => {
      callback(embeddings);
    });
  });
}

function dot(a, b){
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var sum = 0;
  for (var key in a) {
    if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
      sum += a[key] * b[key]
    }
  }
  return sum
}

function similarity(a, b) {
  var magnitudeA = Math.sqrt(dot(a, a));
  var magnitudeB = Math.sqrt(dot(b, b));
  if (magnitudeA && magnitudeB)
    return dot(a, b) / (magnitudeA * magnitudeB);
  else return false
}

function cosine_similarity_matrix(matrix){
  let cosine_similarity_matrix = [];
  for(let i=0;i<matrix.length;i++){
    let row = [];
    for(let j=0;j<i;j++){
      row.push(cosine_similarity_matrix[j][i]);
    }
    row.push(1);
    for(let j=(i+1);j<matrix.length;j++){
      row.push(similarity(matrix[i],matrix[j]));
    }
    cosine_similarity_matrix.push(row);
  }
  return cosine_similarity_matrix;
}

function form_groups(cosine_similarity_matrix){
  let dict_keys_in_group = {};
  let groups = [];

  for(let i=0; i<cosine_similarity_matrix.length; i++){
    var this_row = cosine_similarity_matrix[i];
    for(let j=i; j<this_row.length; j++){
      if(i!=j){
        let sim_score = cosine_similarity_matrix[i][j];
        if(sim_score > input_threshold){

          let group_num;

          if(!(i in dict_keys_in_group)){
            group_num = groups.length;
            dict_keys_in_group[i] = group_num;
          }else{
            group_num = dict_keys_in_group[i];
          }
          if(!(j in dict_keys_in_group)){
            dict_keys_in_group[j] = group_num;
          }

          if(groups.length <= group_num){
            groups.push([]);
          }
          groups[group_num].push(i);
          groups[group_num].push(j);
        }
      }
    }
  }

  let return_groups = [];
  for(var i in groups){
    return_groups.push(Array.from(new Set(groups[i])));
  }

  console.log(return_groups);
  return return_groups;
}

async function get_similarity(list_sentences){

  let callback = async function(embeddings) {

    let cosine_similarity_m = cosine_similarity_matrix(embeddings.arraySync());

    let groups = form_groups(cosine_similarity_m);

    var createData = {type: "normal", state: "maximized"};
      var winId;
      chrome.windows.create(createData, function(w) {
        winId = w.windowId;
    });

    for(let i in groups){
      console.log("group:" + i);
      let tabIds= [];
      for(let j in groups[i]){
        tabIds.push(tabDict[list_sentences[ groups[i][j] ]]);

        console.log(groups[i][j], list_sentences[ groups[i][j] ])
      }
      console.log(tabIds);
      const groupId = await chrome.tabs.group({createProperties: {windowId: winId}, tabIds: tabIds});
    }
  };

  let embeddings = await get_embeddings(list_sentences, callback.bind(this));
}

onClickAnalyzeSentences();