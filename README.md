# sails-hook-sqlize
`Sequelize` hook for Sails.js v0.11

# Install
`npm install --save sails-hook-sqlize`

# Purpose
create `Sequelize` models using your sails model definitions, and make them available via `sails.sequelize['modelName']`, giving you access to both sails and sequelize models for the same table

# Background
`Sails` is pretty great. Even `Waterline`, Sails' default ORM is pretty great and works fine for most heavily CRUD based apps. It even gives you some pretty cool things right out of the box like pubsub support over websockets. But when you start to get into some more complex querying, the limitations become apparent fairly quickly. My biggest complaint is `Waterline`'s lack of support for proper joins.

 Take a data structure like the following:
- `Users` belong to many `Groups`
- `Groups` belong to many `Abilities` and `Abilities` belong to many `Groups`
- `Abilities` belong to one `Resource`

Going from `Users` to `Resource`s in `Waterline` would involve 6 separate queries behind the scenes
- a query to `users` to find the user
- a query to the `group_users__user_groups` join table
- a query to `groups` to find the actual groups
- a query to the `ability_groups__group_abilities` join table
- a query to `abilities` to find the actual abilities
- a query to `resources` to find the resources

Not very efficient when we're using a relational database that could handle our "complex" join with a single query. And the actual deep/nested population needed to get you there is painful to write (trust me).

`Sequelize` on the other hand, will get you there pretty easily, and with one query:
```
sails.sequelize['user'].findOne({
    where: {
        id: 1
    },
    include: [{
        model: sails.sequelize['groups'],
        as: 'groups',
        include: [{
            model: sails.sequelize['abilities'],
            as: 'abilities',
            include: [{
                model: sails.sequelize['resource'],
                as: 'resource'
            }]
        }]
    }]
}).nodeify(function(err, user) {});
```
 
 This `hook` aims to give you the best of both worlds, native `Waterline` models for your day-to-day CRUD stuff (blueprints, pubsub, etc), and more robust `Sequelize` models that will allow you to sleep soundly every night knowing that you have a model capable of handling your complex SQL needs. This module also does not require you to disable the native `Sails` hooks (orm, pubsub, etc) that some other hooks require.
 
 # Getting started
 Check out the `/api` folder for a sample model setup. Create a new file called `sequelize.js` in `/config` containing your config options (more to come on this, but for now, see `/test/bootstrap.test.js` for sample config)
 
 # Testing
 - install a compatible sequelize database (mysql, postgresql, ms sql server, etc)
 - edit the connection info in `/test/bootstrap.test.js`
 - `npm test`
 
 # To Do
 Improve docs. Improve feature suite. ADD MORE TESTS.