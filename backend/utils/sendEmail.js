import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export function sendEmailAuthentication(){
    resend.emails.send({
        from: 'TeamTask <authentication@teamtask.app>',
        to: ['sohailijaz09@gmail.com'],
        subject: 'test email',
        html: '<strong>It works!</strong>'
    })
}

