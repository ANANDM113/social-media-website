const express   =   require('express');
const router    =   express.Router();
const passport  =   require('passport');
const postApi   =   require("../../../controllers/api/v1/posts_api");

router.get('/',postApi.index);
//{session:false} so that session cookies are not generated

router.delete('/:id',passport.authenticate('jwt',{session:false}),postApi.destroy);

module.exports  =   router;