const table = 'student';
exports.up = function(knex) {
    return knex
    .schema
    .hasTable(table)
    .then(function (exists) {
        if (!exists) {
            return knex
                .schema
                .createTable(table, function (table) {
                    table.increments('id').primary()
                    table.string('username')
                    table.string('password')
                    table.string('firstName')
                    table.string('lastName')
                    table.string('class')
                    table.string('contactNumber')
                    table.string('address')
     
                })
                .then(console.log("Table "+table+" created."));
        }else{
            console.log("Table "+table+" already created!");
        }
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable(table);
};
