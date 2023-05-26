
exports.indexPage = (req,res)=>{
    const isAuthenticated = req.session.isAuthenticated || false;
    res.render("index.ejs",{isAuthenticated})
}
