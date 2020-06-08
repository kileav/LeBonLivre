const connection = require("./db")

class Etats {

    static all (cb) {

        connection.query("SELECT * FROM etats", (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
}
module.exports = Etats