const kue   =   require('kue');

const queue =   kue.createQueue();

module.exports  =   queue;

//With this setup done next step is to create a worker