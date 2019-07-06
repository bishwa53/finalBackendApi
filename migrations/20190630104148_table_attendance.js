const table = 'attendance';
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
                    table.string('class')
                    table.string('subject')
                    table.dateTime('datetime')
                    table.integer("studentId")
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
