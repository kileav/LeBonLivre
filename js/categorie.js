const connection = require("./db")

class Categories {

    static selection (cb) {

        connection.query("SELECT * FROM categories", (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
}

module.exports = Categories