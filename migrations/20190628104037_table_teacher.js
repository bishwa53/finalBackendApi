
exports.up = function(knex) {
    return knex
    .schema
    .hasTable('teachers')
    .then(function (exists) {
        if (!exists) {
            return knex
                .schema
                .createTable('teachers', function (table) {
                    table.increments('id').primary()
                    table.string('username')
                    table.string('password')
                    table.string('firstName')
                    table.string('lastName')
                    table.string('contact')
                    table.string('address')
                })
                .then(console.log("Table teachers created."));
        }else{
            console.log("Table teachers already created!");
        }
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('teachers');
};
