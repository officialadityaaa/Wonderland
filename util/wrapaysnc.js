//wrapasync is used as good version of the using try and catch
// function wrapaAsync(fn){ diretcly exports;
module.exports=(fn)=>{
return function(req,res,next){
fn(req,res,next).catch(next);
}}