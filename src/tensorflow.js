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
        this.groups = [];
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

    getGroups() {
        return this.groups;
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

    // Calculates similarity between sentences based on their embeddings' dot product
    similarity(a, b) {
        var magnitudeA = Math.sqrt(dot(a, a));
        var magnitudeB = Math.sqrt(dot(b, b));
    
        if (magnitudeA && magnitudeB) {
            return dot(a, b) / (magnitudeA * magnitudeB);
        } else {
            return false;
        } 
    }

    // Creates a cosine similarity matrix based on similarity of sentences' embeddings
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

    // Form our groups based on the cosine_similarity_matrix
    form_groups(cosine_similarity_matrix){
        let dict_keys_in_group = {};
        let groups = [];
    
        for(let i=0; i<cosine_similarity_matrix.length; i++){
            var this_row = cosine_similarity_matrix[i];
            for(let j=i; j<this_row.length; j++){
                if(i!=j){
                    let sim_score = cosine_similarity_matrix[i][j];

                    // Check if similarity is within our threshold
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
    
        // Return our newly created groups and remove duplicates within group
        let return_groups = [];
        for(var i in groups){
            return_groups.push(Array.from(new Set(groups[i])));
        }
        return return_groups;
    }

    // Function to get groups based on similarity
    async get_similarity() {
        let callback = async function(embeddings) {
    
            let cosine_similarity_m = cosine_similarity_matrix(embeddings.arraySync());
    
            let groups = form_groups(cosine_similarity_m);
            return groups;
        };
    
        return await get_embeddings(this.list_sentences, callback.bind(this));
    }

    optimizeGroups() {

    }
}

// Export our model
module.exports = {SentenceModel};