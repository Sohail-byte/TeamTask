import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmailAuthentication(email, subject, html){
    try{
    await resend.emails.send({
        from: 'TeamTask <authentication@teamtask.app>',
        to: email,
        subject,
        html
    })
} catch(e){
    console.log(e)
}
}

