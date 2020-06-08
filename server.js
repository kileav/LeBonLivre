const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const upload = require("express-fileupload")

// MOTEUR DE TEMPLATES
app.set('view engine', 'ejs')

// MIDDLEWARE
app.use("/assets", express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(upload())

const etats = (req, res, next) => {
    const Etats = require('./js/etat')
    Etats.all((etats) => {
        req.etats = etats
        next()
    })
}

const categories = (req, res, next) => {
    const Categories = require("./js/categorie")
    Categories.selection((categories) => {
        req.categories = categories
        next()
    })
}

const annonces = (req, res, next) => {
    const Annonces = require("./js/annonce")
    Annonces.selectAll((annonces) => {
        req.annonces = annonces
        next()
    })
}

const annonce = (req, res, next) => {
    const Annonce = require("./js/annonce")
    Annonce.select(req.params.id, (rows) => {
        req.annonce = rows
        console.log(req.annonce)
        next()
    })
}

// ROUTES

 app.get("/", annonces, (req, res) => {
    res.render("index", { annonces: req.annonces})
 })

 app.get("/depose_annonce", etats, categories, (req, res) => {
        res.render("depose_annonce", {etats: req.etats , categories: req.categories})
 })

 
 app.post("/depose_annonce", (req, res) => {

    const Annonce = require("./js/annonce")
    Annonce.create(req.body.titre, req.body.categorie, req.body.etat, req.body.description, req.body.prix, req.files.photo.name, req.body.localisation, req.body.email, req.body.tel, function(annonce) {
        const Categories = require("./js/categorie")
        const Etats = require("./js/etat")

        Categories.selection((categorieAll) => {

            for(categorie of categorieAll) {
                if (req.body.categorie == categorie.id) {
                    req.categorie = categorie.categorie

                    Etats.all((etatAll) => {

                        for(etat of etatAll) {
                            if (req.body.etat == etat.id) {
                                req.etat = etat.etat

                                let sampleFile = req.files.photo
    
                                sampleFile.mv('./public/image/' + req.files.photo.name, function(err) {
                                    if(err) throw err
                                    console.log("fichier uploadé")
                                    res.redirect("/")
                                })   
                            }
                        }
                    })
                }
            }
        })
     })
 })

 app.get("/annonce/:id", annonce, (req, res) => {

    const Categories = require("./js/categorie")
    const Etats = require("./js/etat")

    Categories.selection((categorieAll) => {

        for(categorie of categorieAll) {
            if (req.annonce[0].categorie_id == categorie.id) {
                req.categorie = categorie.categorie

                Etats.all((etatAll) => {

                for(etat of etatAll) {
                    if (req.annonce[0].etat_id == etat.id) {
                        req.etat = etat.etat
                        
                        res.render("annonce", {annonce: req.annonce, categorie : req.categorie, etat : req.etat})
                        }
                    }
                })
            }
        }
    })
})

app.get("/supprimer_annonce/:id", (req, res) => {
    const Annonce = require("./js/annonce")
    Annonce.delete(req.params.id, (rows) => {
        console.log("l'annonce a bien été supprimé")
        res.redirect('/')
    })
})

app.get("/modifier_annonce/:id", etats, categories, annonce, (req, res) => {
    res.render("modifier_annonce", { etats: req.etats, categories: req.categories, annonce: req.annonce })
})

app.post("/modifier_annonce/:id", (req, res) => {
        console.log(req.body)
        const Modif = require("./js/annonce")
        if(req.files) {
            Modif.update(req.params.id, req.body.titre, req.body.categorie, req.body.etat, req.body.description, req.body.prix, req.files.photo.name, req.body.localisation, req.body.email, req.body.tel, function() {
                req.files.photo.mv("./public/image/" + req.files.photo.name, (err) => {
                    if (err) throw err
                    console.log('fichier uploadé')
                    res.redirect('/')
            })
        })
    }
    else {
        Modif.select(req.params.id, (rows) => {
            Modif.update(req.params.id, req.body.titre, req.body.categorie, req.body.etat, req.body.description, req.body.prix, rows[0].photo, req.body.localisation, req.body.email, req.body.tel, function () {
                res.redirect("/")
            })
        })
    }
})

app.listen(8080)
