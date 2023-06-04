const express=require("express")
const mongoose=require('mongoose');
const cors=require('cors');
const User =require('./db/User');
const Product=require("./db/product")
require('./db/config');
const app=express();
app.use(express.json());
app.use(cors());
app.post("/register",async (req,resp)=>{
    const user=new User(req.body);
    let result=await user.save();
    result==result.toObject();
    delete result.password;
    console.log(result);
resp.send(result);
})

app.post("/login",async(req,resp)=>{
    const result=await User.findOne(req.body).select("-password");
    if(result){
    resp.send(result);
    }
    else
    {
        resp.send("no User found");
    }

})

app.post("/add-product",async(req,resp)=>{
    const data=new Product(req.body);
    let result=await data.save();
    // result=JSON.stringify(result);
    resp.send(result);

})
app.get("/ListProduct",async(req,resp)=>{
   const result =await Product.find();
   resp.send(result);
})
app.delete("/Delete/:id",async(req,resp)=>{
    let result =await Product.deleteOne({_id:req.params.id});
    // result =await result.json();
    resp.send(result);
})
app.get("/product/:id",async(req,resp)=>{
    let result =await Product.findOne({_id:req.params.id})
    resp.send(result)
})
app.put("/update/:id",async(req,resp)=>{
    let result =await Product.updateOne({_id:req.params.id},{
        $set:req.body
    })
    resp.send(result);
})
app.get("/search/:key",async(req,resp)=>{
    let result =await Product.find({
      "$or":[
        {
            name:{$regex:req.params.key}
        },
        {
            company:{$regex:req.params.key}
        },
        {
            category:{$regex:req.params.key}
        }
        
      ]  
    });
    resp.send(result);
})
app.listen(5000);