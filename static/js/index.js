import { createToast } from '../toast/script.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseurl='https://kwaxoydcynkxkotnjtct.supabase.co'
const supabasekey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YXhveWRjeW5reGtvdG5qdGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAzMTk5OTAsImV4cCI6MjAxNTg5NTk5MH0.HMHaUc_wL2RrT_sJ9vQUqz1NxlBpjT_pMM0wVAtNxRE'

const supabase = createClient(supabaseurl, supabasekey);

const luser = document.getElementById("luser");
const lpass = document.getElementById("lpass");
const ruser = document.getElementById("ruser");
const rpass = document.getElementById("rpass");
const loginbtn = document.getElementById("login");
const signupbtn = document.getElementById("register");
let luserval, ruserval;
loginbtn.addEventListener("click", (e) => {
    e.preventDefault();
    luserval = luser.value.toLowerCase();
    if(isemail(luserval)) {
        searchdata();
    }
});

signupbtn.addEventListener("click", (e) => {
    e.preventDefault();
    ruserval = ruser.value.toLowerCase();
    if(isemail(ruserval)) {
        insertdata();
    }
})

const isemail = (email) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.match(mailformat)){
        createToast("warning", "Email Address Invalid");
        return false;
    }
    else return true
}


async function searchdata() {
    const { data, error } = await supabase
    .from('user')
    .select('*')
    .match({email: luserval, pass: CryptoJS.MD5(lpass.value).toString()})

    if(data.length<=0) {
        createToast("error", "Incorrect credentials");
    }

    if(data.length > 0 && !error) {
        createToast("success", "Welcome");
        window.location.replace('changePage')
    } 
}


async function insertdata() {
    const { error } = await supabase
    .from('user')
    .insert({ email: ruserval, pass: CryptoJS.MD5(rpass.value).toString()})
    if(!error){ 
        createToast("success", "Welcome Aboard! Login"); 
    }
    
    if(error['code']=="23505") {
        createToast("warning", "User Already Present");
    }
    if(error['code']!="23505") {
        createToast("error", "Sorry! Try Again");
    }
    clearvalue(ruser, rpass);

}


const clearvalue=(a=null,b=null, c=null) => {
    if(a!=null)
    a.value=''
    if(a!=null)
    b.value=''
    if(c!=null)
    c.value=''
}