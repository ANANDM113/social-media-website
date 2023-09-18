const nodemailer    =   require("nodemailer");
const ejs   =   require("ejs");
const path  =   require("path");

//This is the part which sends the email. It defines how this communication is going to take place
let transporter =   nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ninjadeveloper45@gmail.com',
        pass: 'xocjzgbxitajunnx'
    }
});
//It defines whenever you are going to send an HTML email where the file would be placed inside views and
//mailer folder
let renderTemplate  =   (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering template');
                return;
            }
            mailHTML    =   template;
        }
    )
    return mailHTML;
}

module.exports  =   {
    transporter: transporter,
    renderTemplate: renderTemplate
}