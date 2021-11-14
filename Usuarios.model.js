const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DataSchema = new mongoose.Schema({
    nome:String,
    email:String,
    tipo:{type:Number, default:1},
    senha:String,
},{
    timestamps:true
});

DataSchema.pre('save',function(next){
    if(!this.isModified("senha")){
        return next();
    }
    this.senha = bcrypt.hashSync(this.senha,10);
    next();
});

DataSchema.pre('findOneAndUpdate', function (next){
    var password = this.getUpdate().senha+'';
    if(password.length<55){
        this.getUpdate().senha = bcrypt.hashSync(password,10);
    }
    next();
});

DataSchema.methods.isCorrectPassword = function (password, callback ){
    bcrypt.compare(password,this.senha,function(err,same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    })
}
const usuarios = mongoose.model('Usuarios',DataSchema);
module.exports = usuarios;