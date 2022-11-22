import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

/*  Class that uses Tensorflow.js's Universal Sentence encoder
    in order to group sentences based on similarity. */
class SentenceModel {
    
    // Initializes the model with sentences and a similarity threshold
    constructor(sentences, thres=0.50) {
        this.list_sentences = sentences;
        this.threshold = thres;
        this.analyzing_text = false;
    }

    // setters & getters for sentences and threshold to run the model on
    setSentences(sentences) {
        this.list_sentences = sentences;
    }

    getSentences() {
        return this.sentences;
    }

    setThreshold(thres) {
        this.threshold;
    }

    getThreshold() {
        return this.threshold;
    }

    // Tensorflow's model embeddings
    get_embeddings(callback) {
        use.load().then(model => {
            model.embed(this.list_sentences).then(embeddings => {
            callback(embeddings);
            });
        });
    }

    // Dot product
    dot(a, b){
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var sum = 0;
        for (var key in a) {
            if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
            sum += a[key] * b[key]
            }
        }
        return sum;
    }

    
    similarity(a, b) {
        var magnitudeA = Math.sqrt(dot(a, a));
        var magnitudeB = Math.sqrt(dot(b, b));
    
        if (magnitudeA && magnitudeB) {
            return dot(a, b) / (magnitudeA * magnitudeB);
        } else {
            return false;
        } 
    }

    cosine_similarity_matrix(matrix){
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

    form_groups(cosine_similarity_matrix){
        let dict_keys_in_group = {};
        let groups = [];
    
        for(let i=0; i<cosine_similarity_matrix.length; i++){
            var this_row = cosine_similarity_matrix[i];
            for(let j=i; j<this_row.length; j++){
                if(i!=j){
                    let sim_score = cosine_similarity_matrix[i][j];
                    if(sim_score > this.threshold){
    
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
        return return_groups;
    }

    async  get_similarity(){
        let callback = async function(embeddings) {
    
            let cosine_similarity_m = cosine_similarity_matrix(embeddings.arraySync());
    
            let groups = form_groups(cosine_similarity_m);
            return groups;
        };
    
        return await get_embeddings(this.list_sentences, callback.bind(this));
    }
}
var threshold = 0.50;
var analyzing_text = true;

function get_embeddings(this.list_sentences, callback) {
    use.load().then(model => {
        model.embed(this.list_sentences).then(embeddings => {
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
    return sum;
}

function similarity(a, b) {
    var magnitudeA = Math.sqrt(dot(a, a));
    var magnitudeB = Math.sqrt(dot(b, b));

    if (magnitudeA && magnitudeB) {
        return dot(a, b) / (magnitudeA * magnitudeB);
    } else {
        return false;
    } 
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
                if(sim_score > this.threshold){

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
    return return_groups;
}

async function get_similarity(this.list_sentences){
    let callback = async function(embeddings) {

        let cosine_similarity_m = cosine_similarity_matrix(embeddings.arraySync());

        let groups = form_groups(cosine_similarity_m);
        return groups;
    };

    return await get_embeddings(this.list_sentences, callback.bind(this));
}