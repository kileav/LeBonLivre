const connection = require("./db")

class Annonce {
    
    static create (titre, categorie, etat, description, prix, photo, localisation, email, tel, cb) {

        connection.query("INSERT INTO annonce SET titre = ?, categorie_id = ?, etat_id = ?, description = ?, prix = ?, photo = ?, localisation = ?, email = ?, tel = ?", [titre, categorie, etat, description, prix, photo, localisation, email, tel], (err, resultat) => {
            if(err) throw err
            cb(resultat)
        })
    }

    static selectAll(cb) {
        connection.query("SELECT * FROM annonce ORDER BY id DESC", (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

    static select(id, cb) {
        connection.query("SELECT * FROM annonce WHERE id = ?", [id], (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

    static delete(id, cb) {
        connection.query("DELETE FROM annonce WHERE id = ?", [id], (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }

    static update (id, titre, categorie, etat, description, prix, photo, localisation, email, tel, cb) {

        connection.query("UPDATE annonce SET titre = ?, categorie_id = ?, etat_id = ?, description = ?, prix = ?, photo = ?, localisation = ?, email = ?, tel = ? WHERE id = ?", [titre, categorie, etat, description, prix, photo, localisation, email, tel, id], (err, resultat) => {
            if(err) throw err
            cb(resultat)
        })
    }
}

module.exports = Annonce